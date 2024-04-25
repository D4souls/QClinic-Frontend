import { Routes } from '@angular/router';


export const doctorsPages_routes: Routes = [
  {
    path: '',
    title: 'Manage doctors',
    loadChildren: () => import('./doctors/doctors.routes').then(m => m.doctor_routes),
  },
];
