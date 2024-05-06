import { Routes } from '@angular/router';
import { DoctorsComponent } from './show-doctors/doctors.component';
import { ModifyDoctorComponent } from './modify-doctor/modify-doctor.component';


export const doctor_routes: Routes = [
  {
    path: '',
    title: 'Manage doctors',
    component: DoctorsComponent,
    children: [
      {
        path: 'modify-doctor/:dniDoctor',
        title: 'Modify doctor',
        component: ModifyDoctorComponent,
      },
    ]
  },
];
