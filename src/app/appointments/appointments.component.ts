import { Component } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import esLocale from '@fullcalendar/core/locales/es';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [FullCalendarModule],
  templateUrl: './appointments.component.html',
  styleUrl: './appointments.component.css'
})
export class AppointmentsComponent {

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin],
    weekNumbers: true,
    navLinks: true,
    firstDay: 1,
    nowIndicator: true,
    locale: esLocale,
    height: 650,
    events: [
      { title: 'event 1', date: '2024-02-01' },
      { title: 'event 2', date: '2024-02-02' }
    ]
  }
}
