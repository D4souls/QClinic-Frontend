import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { patientsInterfaces } from '../../../core/interfaces/patients/patients-interfaces'
import { CreatePatientComponent } from '../create-patient/create-patient.component';

import { InstanceOptions, Modal, ModalOptions } from 'flowbite';

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [NgxPaginationModule, CommonModule, RouterOutlet, RouterLink, CreatePatientComponent],
  templateUrl: './patients.component.html',
  styleUrl: './patients.component.css',
})
export class PatientsComponent implements OnInit {
  data: patientsInterfaces[] = [];
  filteredPatient: patientsInterfaces[] = [];

  allPatients: number = 0;
  pagination: number = 1;

  cantPatientsPerPage: number = 10;

  constructor(
    private router: Router,
    public patientapiservice: ApiService
  ) {}

  ngOnInit(): void {
    this.getUser();
  }

  getUser(): void {

    try {
      this.patientapiservice.getPatients(this.pagination).subscribe((data: patientsInterfaces[]) => {
        this.data = data;
        this.filteredPatient = this.data.slice();
      });
    } catch (error) {
      console.log('Error while getting users: ',error);
    }

  }

  modifyPatient(dni: string): void {
    this.router.navigate(['/patients/modify-patient', dni]);
  }

  newPatient(): void {
    const $targetEl = document.getElementById('modal-create-patient');
    // Modal Options
    const options: ModalOptions = {
      placement: 'bottom-right',
      backdrop: 'dynamic',
      backdropClasses: 'bg-gray-900/50 fixed inset-0 z-40',
      closable: true,
    };
    
    // Modal instance options
    const instanceOptions: InstanceOptions = {
      id: 'modal-create-patient',
      override: true
    };

    const modal: Modal = new Modal($targetEl, options, instanceOptions);

    
    modal.show();
  }

  filterPatients(dataToSearch: string): void {

    if (!dataToSearch) {
      this.filteredPatient = this.data.slice();
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

  orderFilterPatients: string = 'Descending';

  changeOrderFilterPatients(): void {
    if (this.orderFilterPatients === 'Ascending') {
      this.filteredPatient?.sort((a: patientsInterfaces, b: patientsInterfaces) => a.firstname.localeCompare(b.firstname));
      this.orderFilterPatients = 'Descending';
    } else {
      this.filteredPatient?.sort((a: patientsInterfaces, b: patientsInterfaces) => b.firstname.localeCompare(a.firstname));
      this.orderFilterPatients = 'Ascending';
    }
  }

  onSubmit(event: Event): void {
    event.preventDefault();
  }

  renderPage(event: number) {
    this.pagination = event;
    this.getUser();
  }

  hideModal(): void{
    // Get modal id
    const $targetEl = document.getElementById('show-info-appointment');
  
    // Modal Options
    const options: ModalOptions = {
      placement: 'bottom-right',
      backdrop: 'dynamic',
      backdropClasses: 'bg-gray-900/50 dark:bg-gray-900/80 fixed inset-0 z-40',
      closable: true,
    };
    
    // Modal instance options
    const instanceOptions: InstanceOptions = {
      id: 'show-info-appointment',
      override: true
    };

    const modal: Modal = new Modal($targetEl, options, instanceOptions);
  
    modal.hide();

  }
}
