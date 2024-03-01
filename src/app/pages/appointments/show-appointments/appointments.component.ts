import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';

// FULLCALENDAR MODULS
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions  } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import esLocale from '@fullcalendar/core/locales/es';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

// SWEETALERTS
import Swal from 'sweetalert2';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [FullCalendarModule, ReactiveFormsModule, RouterOutlet, RouterLinkActive, RouterLink],
  templateUrl: './appointments.component.html',
  styleUrl: './appointments.component.css',
})
export class AppointmentsComponent implements OnInit {

  constructor(private apiGetPatient: ApiService, private router: Router){}

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
    editable: true,
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
  };

  handleDateClick(arg:any) {
    alert('date click! ' + arg.dateStr)
  }

  getAppointments(): void {
    this.apiGetPatient.getAppointments().subscribe((data: any) => {
      const dataEvent = data.data.map((appointments: any) => {
        return {
          title: `${appointments.patientFirstname} ${appointments.patientLastname}`,
          start: appointments.date,
        };
      });
      
      this.calendarEvents = dataEvent;

      console.log(dataEvent);

    })
  }
}
