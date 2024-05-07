import { Routes } from '@angular/router';
import { PatientsComponent } from './show-patients/patients.component';
import { ModifyPatientComponent } from './modify-patient/modify-patient.component';
import { patientChildrenComponentGuard } from '../../core/guards/patient-children-component.guard';


export const patients_routes: Routes = [
  {
    path: '',
    title: 'Manage patients',
    component: PatientsComponent,
    children: [
      {
        path: 'modify-patient/:dniPatient',
        title: 'Modify patient',
        component: ModifyPatientComponent,
        canActivate: [patientChildrenComponentGuard]
      },
    ]
  },
];
