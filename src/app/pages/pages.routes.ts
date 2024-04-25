import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { UserDataComponent } from './user-data/user-data.component';
import { PagesComponent } from './pages.component';

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
      },
      {
        path: 'user-data',
        title: 'Personal information',
        component: UserDataComponent,
      },
      {
        path: 'patients',
        title: 'Manage patients',
        loadChildren: () =>
          import('./patients/patients.routes').then((m) => m.patients_routes),
      },
      {
        path: 'appointments',
        title: 'Manage appointments',
        loadChildren: () =>
          import('./appointments/appointments.routes').then((m) => m.patients_routes),
      },
      {
        path: 'doctors',
        title: 'Manage doctors',
        loadChildren: () =>
          import('./doctors/doctors.routes').then((m) => m.doctorsPages_routes),
      },
    ]
  },
];
