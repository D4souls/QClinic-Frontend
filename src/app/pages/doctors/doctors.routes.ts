import { Routes } from '@angular/router';
import { DoctorsComponent } from './show-doctors/doctors.component';


export const patients_routes: Routes = [
  {
    path: '',
    title: 'Manage doctors',
    component: DoctorsComponent,
  },
];
