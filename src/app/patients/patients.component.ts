import { Component, OnInit } from '@angular/core';
import { ModifyUserService } from '../service/modify-user.service';
import { Router } from '@angular/router';
import { ApiService } from '../service/api.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [NgxPaginationModule, CommonModule],
  templateUrl: './patients.component.html',
  styleUrl: './patients.component.css',
})
export class PatientsComponent implements OnInit {
  data: any = [];
  filteredPatient: any = this.data;

  allPatients: number = 0;
  pagination: number = 1;

  constructor(
    public modifyUserService: ModifyUserService,
    private router: Router,
    public patientapiservice: ApiService
  ) {}

  ngOnInit(): void {
    this.getUser();
  }

  getUser(): void {
    this.patientapiservice.getPatients(this.pagination).subscribe((data: any) => {
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

  onSubmit(event: Event): void {
    event.preventDefault();
  }

  renderPage(event: number) {
    this.pagination = event;
    this.getUser();
  }
}
