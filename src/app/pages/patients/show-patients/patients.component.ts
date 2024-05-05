import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { patientsInterfaces } from '../../../core/interfaces/patients/patients-interfaces'
import { CreatePatientComponent } from '../create-patient/create-patient.component';

import { InstanceOptions, Modal, ModalOptions } from 'flowbite';
import { ModifyPatientComponent } from '../modify-patient/modify-patient.component';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [NgxPaginationModule, CommonModule, RouterOutlet, RouterLink, CreatePatientComponent, ModifyPatientComponent, ReactiveFormsModule ],
  templateUrl: './patients.component.html',
  styleUrl: './patients.component.css',
})
export class PatientsComponent implements OnInit {
  data: patientsInterfaces[] = [];
  filteredPatient: any[] = [];

  allPatients: number = 0;
  pagination: number = 1;

  cantPatientsPerPage: number = 11;

  dniSelected: string = '';

  offset: number = 0;
  limit: number = 11;
  maxPatients: number = 0;
  maxPages: number = 0;
  currentPage: number = 1;

  constructor(
    private router: Router,
    public patientapiservice: ApiService
  ) {}

  ngOnInit(): void {
    this.getUser();
    this.countPatients();
  }

  nextPage(): void{
    const currentOffset = this.offset + this.limit;
    this.offset = currentOffset;
    this.currentPage = ++this.currentPage;
    this.getUser();
  }

  previousPage(): void{
    const currentOffset = this.offset - this.limit;
    this.offset = currentOffset;
    this.currentPage = --this.currentPage;
    this.getUser();
  }

  countPatients() {
    const token = localStorage.getItem('token')!;

    this.patientapiservice.countPatients(token).subscribe((countRes: any) => {
      this.maxPatients = countRes.msn;
    });

  }

  totalPages(): number {
    this.maxPages = Math.ceil(this.maxPatients / this.limit);
    return this.maxPages;
  }

  generatePageNumbers(): number[] {
    const pagesArray = [];
    const totalPages = this.totalPages();
    for (let i = 1; i <= totalPages; i++) {
      pagesArray.push(i);
    }
    return pagesArray;
  }

  goToPage(page: number){
    this.offset = ( page - 1 ) * this.limit;
    this.currentPage = page;
    this.getUser();
  }
  
  getUser(): void {

    try {

      const token = localStorage.getItem('token')!;

      const data = {
        token: token,
        offset: this.offset,
        limit: this.limit
      }

      this.patientapiservice.getPatients(data).subscribe((data: any) => {
        this.data = data;
        this.filteredPatient = data;

      });
    } catch (error) {
      console.log('Error while getting users: ',error);
    }

  }

  modifyPatient(dni: string): void {

    const appModify = document.getElementById('app-modify-patient');
    appModify?.setAttribute('dni', dni);

    const $targetEl = document.getElementById('modal-edit-patient');

    // Modal Options
    const options: ModalOptions = {
      placement: 'bottom-right',
      backdrop: 'dynamic',
      backdropClasses: 'bg-gray-900/50 fixed inset-0 z-40',
      closable: false,
    };
    
    // Modal instance options
    const instanceOptions: InstanceOptions = {
      id: 'modal-edit-patient',
      override: true,
    };

    const modal: Modal = new Modal($targetEl, options, instanceOptions);

    
    modal.show();

    this.router.navigate(["/patients/modify-patient", dni]);

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
          text: "We didn't found any patients..." ,
          icon: 'error',
          toast: true,
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          position: 'bottom'
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
