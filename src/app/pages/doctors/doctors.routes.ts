import { Routes } from '@angular/router';


export const doctorsPages_routes: Routes = [
  {
    path: '',
    title: 'Manage doctors',
    loadChildren: () => import('./doctors/doctors.routes').then(m => m.doctor_routes),
  },
  {
    path: 'schedules',
    title: 'Manage doctors Schedules',
    loadChildren: () => import('./doctors-schedules/doctorsSchedules.routes').then(m => m.doctorSchedules_routes),
  },
];
