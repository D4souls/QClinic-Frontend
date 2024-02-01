import { Component } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { Calendar, CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import esLocale from '@fullcalendar/core/locales/es';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [FullCalendarModule],
  templateUrl: './appointments.component.html',
  styleUrl: './appointments.component.css'
})
export class AppointmentsComponent {

  calendarEvents: any = []

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',    
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    weekNumbers: true,
    navLinks: true,
    firstDay: 1,
    nowIndicator: true,
    locale: esLocale,
    height: 650,
    editable: true,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    themeSystem: 'standard',
    events: [
      { title: 'event 1', date: '2024-02-01' },
      { title: 'event 2', date: '2024-02-02' }
    ],
    dayMaxEvents: true,
  }

  createAppointment(){

  }

  

}
