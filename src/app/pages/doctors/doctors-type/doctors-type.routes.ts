import { Routes } from '@angular/router';
import { DoctorsTypeComponent } from './show-doctors-type/doctors-type.component';
import { ModifyDoctorTypeComponent } from './modify-doctor-type/modify-doctor.component';


export const doctors_type: Routes = [
  {
    path: '',
    title: 'Manage specializations',
    component: DoctorsTypeComponent,
  },
  {
    path: 'modify-specialization/:idType',
    title: 'Modify specialization',
    component: ModifyDoctorTypeComponent,
  }
];
