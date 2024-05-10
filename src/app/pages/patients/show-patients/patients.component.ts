import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
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
  data: any[] = [];
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

  filter: any = undefined;

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
    const data = {
      token: localStorage.getItem('token')!,
      textFilter: this.filter,
    };

    this.patientapiservice.countPatients(data).subscribe((countRes: any) => {
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
    if (totalPages < 1) pagesArray.push(1);
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
        limit: this.limit,
        textFilter: this.filter,
      }

      this.patientapiservice.getPatients(data).subscribe((data: any) => {
        
        if (data.status != 200 && this.filter != undefined) {
          Swal.fire({
            text: "We can't find any patient",
            icon: 'info',
            toast: true,
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            position: 'bottom'
          });
        }
        if (data.status == 200){
          this.data = data.res;
          this.filteredPatient = data.res;
        }

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

    if (dataToSearch === "") {
      
      this.filter = undefined;
      
      this.getUser();
      this.countPatients();
      this.generatePageNumbers();
      
    } else {
  
      this.filter = dataToSearch;
  
      this.getUser();
      this.countPatients();
      this.generatePageNumbers();
  
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

  returnBack(modalName: string){
    
    const $targetEl = document.getElementById(modalName);
    // Modal Options
    const options: ModalOptions = {
      placement: 'bottom-right',
      backdrop: 'dynamic',
      backdropClasses: 'bg-gray-900/50 fixed inset-0 z-40',
      closable: false,
    };
    
    // Modal instance options
    const instanceOptions: InstanceOptions = {
      id: modalName,
      override: true
    };

    const modal: Modal = new Modal($targetEl, options, instanceOptions);

    
    modal.hide();

    this.router.navigate(["/patients"]);

  }
}
