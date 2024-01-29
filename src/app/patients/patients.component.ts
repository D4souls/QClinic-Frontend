import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { ModifyUserService } from '../service/modify-user.service';
import { Route, Router } from '@angular/router';
import { PatientApiService } from '../service/patient-api.service';

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [],
  templateUrl: './patients.component.html',
  styleUrl: './patients.component.css'
})
export class PatientsComponent{

  constructor(
    public modifyUserService: ModifyUserService, 
    private router: Router, 
    private patientapiservice: PatientApiService
  ) {};

  httpClient = inject(HttpClient);
  data: any = [];

  ngOnInit(): void {
    this.getUser();
  }

  getUser(): void {
    this.patientapiservice.getPatientData()
      .subscribe((data: any) => {
        console.log(data);
        this.data = data;
      });
  };

  modifyPatient(dni: string):void{
    this.modifyUserService.shareData(dni);
    this.router.navigate(['/modify-patient']);
  }
}
