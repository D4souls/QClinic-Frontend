import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';

// FULLCALENDAR MODULS
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventClickArg } from '@fullcalendar/core';
import esLocale from '@fullcalendar/core/locales/es';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';

import { InstanceOptions, Modal, ModalOptions } from 'flowbite';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [FullCalendarModule, ReactiveFormsModule, RouterOutlet, RouterLinkActive, RouterLink],
  templateUrl: './appointments.component.html',
  styleUrl: './appointments.component.css',
})
export class AppointmentsComponent implements OnInit {

  constructor(private apiGetPatient: ApiService){}

  calendarEvents: any[] = [];

  ngOnInit(): void {
    this.getAppointments();
    setTimeout(() => {
      this.calendarOptions = {
        events: this.calendarEvents,
      }
    }, 1);
  }

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    weekNumbers: true,
    navLinks: true,
    firstDay: 1,
    nowIndicator: true,
    locale: esLocale,
    height: 725,
    editable: false,
    headerToolbar: {
      start: 'prev,next today',
      center: 'title',
      end: 'dayGridMonth,timeGridWeek,timeGridDay',
    },
    titleFormat: {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    },
    dayMaxEventRows: true,
    views: {
      timeGrid: {
        dayMaxEventRows: 4
      }
    },
    eventClick(info: EventClickArg) {

      // Get all modal parameters to put data
      const $targetEl = document.getElementById('show-info-appointment');
      const titleModal = document.getElementById('modal-header');
      const thNamePatient = document.getElementById('th-namePatient');
      const thDateTime = document.getElementById('th-dateTime');
      const thNameDoctor = document.getElementById('th-nameDoctor');
      const thComment = document.getElementById('th-comment');

      if ($targetEl && titleModal && thNamePatient && thDateTime && thNameDoctor && thComment){

        // Format title
        const title = `Info appointment #${info.event.id}`;
        
        // Format dateTime
        const startDate = info.event.start ? new Date(info.event.start) : null;
        const formattedDateTime = startDate ? `${startDate.toLocaleDateString()} ${startDate.toLocaleTimeString()}` : '';
  
        // Configure text
        titleModal!.innerHTML = title;
        thNamePatient!.innerHTML = info.event.title;
        thDateTime!.innerHTML = formattedDateTime;
        thNameDoctor!.innerHTML = info.event.extendedProps["doctor"];
        thComment!.innerHTML = info.event.extendedProps["description"];
  
        // Modal Options
        const options: ModalOptions = {
          placement: 'bottom-right',
          backdrop: 'dynamic',
          backdropClasses: 'bg-gray-900/50 fixed inset-0 z-40',
          closable: true,
        };
        
        // Modal instance options
        const instanceOptions: InstanceOptions = {
          id: 'show-info-appointment',
          override: true
        };
    
        const modal: Modal = new Modal($targetEl, options, instanceOptions);
    
        modal.show();

      } else {
        console.error("One or more elements were not found in the DOM");
      }
      
    }
  };

  hideModal(): void{
    // Get modal id
    const $targetEl = document.getElementById('show-info-appointment');
  
    // Modal Options
    const options: ModalOptions = {
      placement: 'bottom-right',
      backdrop: 'dynamic',
      backdropClasses: 'bg-gray-900/50 dark:bg-gray-900/80 fixed inset-0 z-40',
      closable: true,
    };
    
    // Modal instance options
    const instanceOptions: InstanceOptions = {
      id: 'show-info-appointment',
      override: true
    };

    const modal: Modal = new Modal($targetEl, options, instanceOptions);
  
    modal.hide();

  }


  getAppointments(): void {

    const token = localStorage.getItem('token')!;

    this.apiGetPatient.getAppointments(token).subscribe((data: any) => {
      const dataEvent = data.data.map((appointments: any) => {
        return {
          id: appointments.id,
          title: `${appointments.patientFirstname} ${appointments.patientLastname}`,
          start: appointments.date,
          extendedProps: {
            description: appointments.comment,
            doctor: `${appointments.doctorFirstname} ${appointments.doctorLastname}`
          }
        };
      });
      
      this.calendarEvents = dataEvent;

      // console.log(dataEvent);

    })
  }
}
