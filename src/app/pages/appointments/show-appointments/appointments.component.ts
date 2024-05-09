import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { forkJoin, Observable } from 'rxjs';

// FULLCALENDAR MODULS
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventClickArg } from '@fullcalendar/core';
import esLocale from '@fullcalendar/core/locales/es';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';

import { InstanceOptions, Modal, ModalOptions } from 'flowbite';
import { CreateAppointmentComponent } from '../create-appointment/create-appointment.component';
import { EditAppointmentComponent } from '../edit-appointment/edit-appointment.component';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [
    FullCalendarModule,
    ReactiveFormsModule,
    CreateAppointmentComponent,
    EditAppointmentComponent,
  ],
  templateUrl: './appointments.component.html',
  styleUrl: './appointments.component.css',
})
export class AppointmentsComponent implements OnInit {
  router: any;
  constructor(private apiGetPatient: ApiService) {}

  token: any = localStorage.getItem('token');

  calendarEvents: any[] = [];

  ngOnInit(): void {
    this.getAppointments();
    setTimeout(() => {
      this.mdCalendarOptions = {
        events: this.calendarEvents,
      };
    }, 225);

    setTimeout(() => {
      this.smCalendarOptions = {
        events: this.calendarEvents,
      };
    }, 1);
  }

  mdCalendarOptions: CalendarOptions = {
    themeSystem: 'standard',
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
      day: 'numeric',
    },
    dayMaxEventRows: true,
    views: {
      timeGrid: {
        dayMaxEventRows: 4,
      },
    },
    eventClick(info: EventClickArg) {
      // Get all modal parameters to put data
      const $targetEl = document.getElementById('show-info-appointment');
      const titleModal = document.getElementById('modal-header');
      const thNamePatient = document.getElementById('th-namePatient');
      const thDateTime = document.getElementById('th-dateTime');
      const thNameDoctor = document.getElementById('th-nameDoctor');
      const thComment = document.getElementById('th-comment');

      if (
        $targetEl &&
        titleModal &&
        thNamePatient &&
        thDateTime &&
        thNameDoctor &&
        thComment
      ) {
        // Format title
        const title = `Info appointment #${info.event.id}`;

        // Format dateTime
        const startDate = info.event.start ? new Date(info.event.start) : null;
        const formattedDateTime = startDate
          ? `${startDate.toLocaleDateString()} ${startDate.toLocaleTimeString()}`
          : '';

        // Configure text
        titleModal!.innerHTML = title;
        thNamePatient!.innerHTML = info.event.title;
        thDateTime!.innerHTML = formattedDateTime;
        thNameDoctor!.innerHTML = info.event.extendedProps['doctor'];
        thComment!.innerHTML = info.event.extendedProps['description'];

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
          override: true,
        };

        const modal: Modal = new Modal($targetEl, options, instanceOptions);

        modal.show();
      } else {
        console.error('One or more elements were not found in the DOM');
      }
    },
    datesSet(arg) {
      const calendarDate = arg.view.currentStart;

      const month = (calendarDate.getMonth() + 1).toLocaleString();
      const year = calendarDate.getFullYear();
      
    },
  };

  smCalendarOptions: CalendarOptions = {
    themeSystem: 'standard',
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
      // center: 'title',
      end: 'dayGridMonth,timeGridWeek,timeGridDay',
    },
    titleFormat: {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    },
    dayMaxEventRows: true,
    views: {
      timeGrid: {
        dayMaxEventRows: 4,
      },
    },
    eventClick(info: EventClickArg) {
      // Get all modal parameters to put data
      const $targetEl = document.getElementById('show-info-appointment');
      const titleModal = document.getElementById('modal-header');
      const thNamePatient = document.getElementById('th-namePatient');
      const thDateTime = document.getElementById('th-dateTime');
      const thNameDoctor = document.getElementById('th-nameDoctor');
      const thComment = document.getElementById('th-comment');

      if (
        $targetEl &&
        titleModal &&
        thNamePatient &&
        thDateTime &&
        thNameDoctor &&
        thComment
      ) {
        // Format title
        const title = `Info appointment #${info.event.id}`;

        // Format dateTime
        const startDate = info.event.start ? new Date(info.event.start) : null;
        const formattedDateTime = startDate
          ? `${startDate.toLocaleDateString()} ${startDate.toLocaleTimeString()}`
          : '';

        // Configure text
        titleModal!.innerHTML = title;
        thNamePatient!.innerHTML = info.event.title;
        thDateTime!.innerHTML = formattedDateTime;
        thNameDoctor!.innerHTML = info.event.extendedProps['doctor'];
        thComment!.innerHTML = info.event.extendedProps['description'];

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
          override: true,
        };

        const modal: Modal = new Modal($targetEl, options, instanceOptions);

        modal.show();
      } else {
        console.error('One or more elements were not found in the DOM');
      }
    },
  };

  newAppointment(): void {
    const $targetEl = document.getElementById('new-appointment');

    // Modal Options
    const options: ModalOptions = {
      placement: 'bottom-right',
      backdrop: 'dynamic',
      backdropClasses: 'bg-gray-900/50 dark:bg-gray-900/80 fixed inset-0 z-40',
      closable: true,
    };

    // Modal instance options
    const instanceOptions: InstanceOptions = {
      id: 'new-appointment',
      override: true,
    };

    const modal: Modal = new Modal($targetEl, options, instanceOptions);

    modal.show();
  }

  editAppointment(): void {
    const $targetEl = document.getElementById('edit-appointment');

    // Modal Options
    const options: ModalOptions = {
      placement: 'bottom-right',
      backdrop: 'dynamic',
      backdropClasses: 'bg-gray-900/50 dark:bg-gray-900/80 fixed inset-0 z-40',
      closable: true,
    };

    // Modal instance options
    const instanceOptions: InstanceOptions = {
      id: 'new-appointment',
      override: true,
    };

    const modal: Modal = new Modal($targetEl);

    modal.show();
  }

  hideModal(): void {
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
      override: true,
    };

    const modal: Modal = new Modal($targetEl, options, instanceOptions);

    modal.hide();
  }

  getAppointments(): void {
    
    const now = new Date();
    const month = (now.getMonth() + 1).toLocaleString();
    const year = now.getFullYear().toLocaleString();

    const data = {
      token: this.token,
      month: month,
      year: year
    }
  
    this.apiGetPatient.getAppointmentsByMonthAndYear(data).subscribe((appointmentsData: any) => {

      if (appointmentsData.status == 200) {
        const appointmentsObservables: Observable<any>[] = [];
  
        appointmentsData.res.forEach((appointment: any) => {

          const patientData$ = this.apiGetPatient.getPatientData({ dni: appointment.assignedPatient, token: this.token });
  
          const doctorData$ = this.apiGetPatient.getDoctorByDNI({ dni: appointment.assignedDoctor, token: this.token});
  
          appointmentsObservables.push(patientData$);
          appointmentsObservables.push(doctorData$);
        });
  
        forkJoin(appointmentsObservables).subscribe((results: any[]) => {
          const calendarEvents: any[] = [];
  
          for (let i = 0; i < results.length; i += 2) {
            const patientData = results[i];
            const doctorData = results[i + 1];
            const appointment = appointmentsData.res[i / 2];
  
            const event = {
              id: appointment.id,
              title: `${patientData.firstname} ${patientData.lastname}`,
              start: appointment.appointmentStart,
              extendedProps: {
                description: appointment.comment,
                doctor: `${doctorData.firstname} ${doctorData.lastname}`
              }
            };
  
            calendarEvents.push(event);
          }
  
          // console.log(calendarEvents);
          this.calendarEvents = calendarEvents;
        }, (error) => {
          console.error('Error retrieving appointment data:', error);
        });
      }
    });
  }

  returnBack(modalName: string){
    
    const $targetEl = document.getElementById(modalName);
    // Modal Options
    const options: ModalOptions = {
      placement: 'bottom-right',
      backdrop: 'dynamic',
      backdropClasses: 'bg-gray-900/50 fixed inset-0 z-40',
      closable: false,
    };
    
    // Modal instance options
    const instanceOptions: InstanceOptions = {
      id: modalName,
      override: true
    };

    const modal: Modal = new Modal($targetEl, options, instanceOptions);

    
    modal.hide();

    this.router.navigate(["/appointments"]);

  }
  
}
