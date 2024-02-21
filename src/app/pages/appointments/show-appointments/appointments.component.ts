import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';

// FULLCALENDAR MODULS
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
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
    initialView: 'timeGridWeek',
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    weekNumbers: true,
    navLinks: true,
    firstDay: 1,
    nowIndicator: true,
    locale: esLocale,
    height: 530,
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
    dayMaxEventRows: false,
  };

  handleDateClick(arg:any) {
    alert('date click! ' + arg.dateStr)
  }

  createAppointmentForm = new FormGroup({
    patient: new FormControl('', Validators.required),
    date: new FormControl('', Validators.required),
    hour: new FormControl('', Validators.required),
  })

  createAppointment() {

    const dataCreateAppointment = {
      date: `${this.createAppointmentForm.value.date} ${this.createAppointmentForm.value.hour}`,
      dniPatient: this.createAppointmentForm.value.patient,
      dniDoctor: "72210584Z"
    }

    // console.log(dataCreateAppointment);

    
    this.apiGetPatient.createAppointments(dataCreateAppointment).subscribe((response: any) => {
      if (response.success) {
        Swal.fire({
          title: 'Appointment created!',
          showDenyButton: false,
          confirmButtonText: 'Ok',
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.reload();
          }
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: response.message,
        });
      }
    },
    (error) => {
      console.error('Error en la solicitud:', error.error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.error.data,
      });
    })
    
    console.log(this.calendarEvents);
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
