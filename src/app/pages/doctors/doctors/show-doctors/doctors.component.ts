import { Component, HostListener, OnChanges, OnInit } from '@angular/core';
import { InstanceOptions, Modal, ModalOptions } from 'flowbite';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import Swal from 'sweetalert2';
import { ApiService } from '../../../../core/services/api.service';
import { CreateDoctorComponent } from '../create-doctor/create-doctor.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-doctors',
  standalone: true,
  imports: [CreateDoctorComponent, NgxPaginationModule, CommonModule, RouterOutlet, RouterLink, CreateDoctorComponent],
  templateUrl: './doctors.component.html',
  styleUrl: './doctors.component.css'
})
export class DoctorsComponent implements OnInit{
  data: any[] = [];
  filtereddoctor: any[] = [];

  token = localStorage.getItem('token');

  offset: number = 0;
  limit: number = 11;
  maxDoctors: number = 0;
  maxPages: number = 0;
  currentPage: number = 1;

  filter: any = undefined;

  constructor(
    private router: Router,
    public doctorapiservice: ApiService
  ) {}

  // Change number of doctors per page
  @HostListener('window:resize', ['$event'])
  onResize(): void {
    let height = window.innerHeight;

    if (height < 800) {
      this.limit = 8;
      this.getUser();
    } else {
      this.limit = 11;
      this.getUser();
    }
  }

  ngOnInit(): void {
    this.getUser();
    this.countDoctors();
    this.onResize();
  }

  nextPage(): void{
    const currentOffset = this.offset + this.limit;
    this.offset = currentOffset;
    this.currentPage = ++this.currentPage;
    this.getUser();
    this.countDoctors();
  }

  previousPage(): void{
    const currentOffset = this.offset - this.limit;
    this.offset = currentOffset;
    this.currentPage = --this.currentPage;
    this.getUser();
  }

  countDoctors() {
    const token = localStorage.getItem('token')!;

    this.doctorapiservice.countDoctors(token).subscribe((countRes: any) => {
      // console.log(countRes)
      this.maxPages = countRes;
    });

  }

  totalPages(): number {
    this.maxPages = Math.ceil(this.maxDoctors / this.limit);
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

    const data = {
      limit: this.limit, 
      offset: this.offset, 
      token: this.token,
      textFilter: this.filter,
    }

    try {

      this.doctorapiservice.getDoctors(data).subscribe((data: any) => {

        if (data.status != 200 && this.filter != undefined) {

          Swal.fire({
            text: "We can't find any doctor",
            icon: 'info',
            toast: true,
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            position: 'bottom'
          });
          
        } else {
          this.data = data.res;
          this.filtereddoctor = data.res;
        }
      });
    } catch (error) {
      console.log('Error while getting users: ',error);
    }

  }

  modifydoctor(dni: string): void {

    const appModify = document.getElementById('app-modify-doctor');
    appModify?.setAttribute('dni', dni);

    const $targetEl = document.getElementById('modal-edit-doctor');

    // Modal Options
    const options: ModalOptions = {
      placement: 'bottom-right',
      backdrop: 'dynamic',
      backdropClasses: 'bg-gray-900/50 fixed inset-0 z-40',
      closable: false,
    };
    
    // Modal instance options
    const instanceOptions: InstanceOptions = {
      id: 'modal-edit-doctor',
      override: true,
    };

    const modal: Modal = new Modal($targetEl, options, instanceOptions);

    
    modal.show();

    this.router.navigate(['/doctors/modify-doctor', dni]);
  }

  redirectToDoctorType(): void {
    this.router.navigate(['/doctors/specializations']);
  }

  redirectToSchedules(): void {
    this.router.navigate(['/doctors/schedules']);
  }

  newdoctor(): void {
    const $targetEl = document.getElementById('modal-create-doctor');
    // Modal Options
    const options: ModalOptions = {
      placement: 'bottom-right',
      backdrop: 'dynamic',
      backdropClasses: 'bg-gray-900/50 fixed inset-0 z-40',
      closable: true,
    };
    
    // Modal instance options
    const instanceOptions: InstanceOptions = {
      id: 'modal-create-doctor',
      override: true
    };

    const modal: Modal = new Modal($targetEl, options, instanceOptions);

    
    modal.show();
  }

  filterdoctors(dataToSearch: string): void {

    if (dataToSearch === "") {
      
      this.filter = undefined;
      
      this.getUser();
      this.countDoctors();
      this.generatePageNumbers();
      
    } else {
  
      this.filter = dataToSearch;
  
      this.getUser();
      this.countDoctors();
      this.generatePageNumbers();
  
    }
    
  }

  onSubmit(event: Event): void {
    event.preventDefault();
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
