import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { UserDataComponent } from './user-data/user-data.component';
import { PatientsComponent } from './patients/patients.component';
import { DoctorsComponent } from './doctors/doctors.component';
import { ModifyPatientComponent } from './modify-patient/modify-patient.component';

export const routes: Routes = [
  { path: 'home', title: 'Home page', component: HomeComponent },
  {
    path: 'user-data',
    title: 'Personal information',
    component: UserDataComponent,
  },
  {
    path: 'patients',
    title: 'Manage patients',
    component: PatientsComponent,
  },
  {
    path: 'doctors',
    title: 'Manage doctors',
    component: DoctorsComponent,
  },
  {
    path: 'modify-patient',
    title: 'Modify patient',
    component: ModifyPatientComponent,
  },

];
