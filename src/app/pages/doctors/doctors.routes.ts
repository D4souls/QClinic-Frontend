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
  {
    path: 'specializations',
    title: 'Manage doctor specializations',
    loadChildren: () => import('./doctors-type/doctors-type.routes').then(m => m.doctors_type)
  }
];
