import { Routes } from '@angular/router';
import { PatientsComponent } from './show-patients/patients.component';
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
];
