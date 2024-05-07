import { Routes } from '@angular/router';
import { DoctorsScheduleComponent } from './show-doctors-schedules/show-doctors-schedules.component';
import { ModifyDoctorScheduleComponent } from './modify-doctor-schedules/modify-doctor-schedule.component';


export const doctorSchedules_routes: Routes = [
  {
    path: '',
    title: 'Manage doctors schedules',
    component: DoctorsScheduleComponent,
    children: [
      {
        path: 'modify-schedule/:idSchedule',
        title: 'Modify schedule',
        component: ModifyDoctorScheduleComponent
      }
    ]
  },
];
