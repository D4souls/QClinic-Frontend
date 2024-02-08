import { Component, OnInit } from '@angular/core';
import { ModifyUserService } from '../service/modify-user.service';
import { Router } from '@angular/router';
import { ApiService } from '../service/api.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

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

    try {
      this.patientapiservice.getPatients(this.pagination).subscribe((data: any) => {
        // console.log(data);
        this.data = data;
        this.filteredPatient = this.data;
      });
    } catch (error) {
      console.log('Error while getting users: ',error);
    }

  }

  modifyPatient(dni: string): void {

    // SHARE DATA TO MODIFY-PATIENT COMPONENT

    this.modifyUserService.shareData(dni);
    this.router.navigate(['/patients/modify-patient', dni]);
  }

  newPatient(): void {
    this.router.navigate(['/create-patient']);
  }

  filterPatients(dataToSearch: string): void {

    if (!dataToSearch) {
      this.filteredPatient = this.data;
    } else {
      const searchName = this.data.filter((dataPatientToFilter: any) =>
        dataPatientToFilter.firstname.toLowerCase().includes(dataToSearch.toLowerCase()) ||
        dataPatientToFilter.lastname.toLowerCase().includes(dataToSearch.toLowerCase()) ||
        dataPatientToFilter.dni.toLowerCase().includes(dataToSearch.toLowerCase()) ||
        dataPatientToFilter.city.toLowerCase().includes(dataToSearch.toLowerCase()) ||
        dataPatientToFilter.email.toLowerCase().includes(dataToSearch.toLowerCase())

      );

      if (searchName.length > 0) {
        this.filteredPatient = searchName;
      } else {
        this.filteredPatient = this.data;

        Swal.fire({
          title: 'Search error',
          text: "We didn't found any patients..." ,
          icon: 'error',
        });
      }

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
