import { Routes } from "@angular/router";
import { AppointmentsComponent } from "./appointments/appointments.component";
import { CreatePatientComponent } from "./create-patient/create-patient.component";
import { DoctorsComponent } from "./doctors/doctors.component";
import { HomeComponent } from "./home/home.component";
import { ModifyPatientComponent } from "./modify-patient/modify-patient.component";
import { PatientsComponent } from "./patients/patients.component";
import { UserDataComponent } from "./user-data/user-data.component";

export const page_routes: Routes = [
    {
        path: '',
        redirectTo: '/home',
        pathMatch: "full"
      },
      { 
        path: 'home', 
        title: 'Home page', 
        component: HomeComponent 
      },
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
        path: 'appointments',
        title: 'Manage appointments',
        component: AppointmentsComponent,
      },
      {
        path: 'doctors',
        title: 'Manage doctors',
        component: DoctorsComponent,
      },
      {
        path: 'patients/modify-patient/:dniPatient',
        title: 'Modify patient',
        component: ModifyPatientComponent,
      },
      {
        path: 'patients/create-patient',
        title: 'Create patient',
        component: CreatePatientComponent,
      },
]