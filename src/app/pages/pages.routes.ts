import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PagesComponent } from './pages.component';
import { roleGuard } from '../core/guards/role.guard';
import { DoctorPortalComponent } from './doctors/doctor-portal/doctor-portal.component';

export const page_routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        title: 'Home page',
        component: HomeComponent,
        canActivate: [roleGuard],
      },
      {
        path: 'patients',
        title: 'Manage patients',
        canActivate: [roleGuard],
        loadChildren: () =>
          import('./patients/patients.routes').then((m) => m.patients_routes),
      },
      {
        path: 'appointments',
        title: 'Manage appointments',
        canActivate: [roleGuard],
        loadChildren: () =>
          import('./appointments/appointments.routes').then((m) => m.patients_routes),
      },
      {
        path: 'doctors',
        title: 'Manage doctors',
        canActivate: [roleGuard],
        loadChildren: () =>
          import('./doctors/doctors.routes').then((m) => m.doctorsPages_routes),
      },
      {
        path: 'portal',
        title: 'Doctor portal',
        component: DoctorPortalComponent,
      }
    ]
  },
];
