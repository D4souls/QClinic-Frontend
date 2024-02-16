import { Routes } from '@angular/router';
import { PatientsComponent } from './show-patients/patients.component';
import { CreatePatientComponent } from './create-patient/create-patient.component';
import { ModifyPatientComponent } from './modify-patient/modify-patient.component';


export const patients_routes: Routes = [
  {
    path: '',
    title: 'Manage patients',
    component: PatientsComponent,
  },
  {
    path: 'modify-patient/:dniPatient',
    title: 'Modify patient',
    component: ModifyPatientComponent,
  },
  {
    path: 'create-patient',
    title: 'Create patient',
    component: CreatePatientComponent,
  },
];
