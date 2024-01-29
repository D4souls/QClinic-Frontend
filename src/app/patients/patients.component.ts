import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ModifyUserService } from '../service/modify-user.service';
import { Router } from '@angular/router';
import { PatientApiService } from '../service/patient-api.service';

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [],
  templateUrl: './patients.component.html',
  styleUrl: './patients.component.css',
})
export class PatientsComponent implements OnInit {
  data: any = [];
  filteredPatient: any =  this.data;

  constructor(
    public modifyUserService: ModifyUserService,
    private router: Router,
    public patientapiservice: PatientApiService,
  ) {}

  ngOnInit(): void {
    this.getUser();
  }

  getUser(): void {
    this.patientapiservice.getPatientData().subscribe((data: any) => {
      // console.log(data);
      this.data = data;
      this.filteredPatient = this.data;
    });
  }

  modifyPatient(dni: string): void {
    this.modifyUserService.shareData(dni);
    this.router.navigate(['/modify-patient']);
  }

  newPatient(): void {
    this.router.navigate(['/create-patient']);
  }

  filterPatients(name: string): void {
    if (!name) {
      this.filteredPatient = this.data;
    } else {
      this.filteredPatient = this.data.filter((dataPatientToFilter: any) =>
        dataPatientToFilter.firstname.toLowerCase().includes(name.toLowerCase())
      );
    }
  }

  onSubmit(event: Event): void{
    event.preventDefault();
  }
}
