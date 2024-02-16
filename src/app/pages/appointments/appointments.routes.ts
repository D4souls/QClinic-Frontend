import { Routes } from '@angular/router';
import { AppointmentsComponent } from './show-appointments/appointments.component';


export const patients_routes: Routes = [
  {
    path: '',
    title: 'Manage appointments',
    component: AppointmentsComponent,
  },
];
