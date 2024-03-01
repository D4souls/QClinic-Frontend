import { Routes } from '@angular/router';
import { AppointmentsComponent } from './show-appointments/appointments.component';
import { CreateAppointmentComponent } from './create-appointment/create-appointment.component';
import { EditAppointmentComponent } from './edit-appointment/edit-appointment.component';


export const patients_routes: Routes = [
  {
    path: '',
    title: 'Manage appointments',
    component: AppointmentsComponent,
    children: [
      {
        path: '',
        redirectTo: '/appointments/create',
        pathMatch: 'full'
      },
      {
        path: 'create',
        component: CreateAppointmentComponent
      },
      {
        path: 'edit',
        component: EditAppointmentComponent
      },
    ]
  },
];
