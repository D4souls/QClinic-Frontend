import { Component, HostListener, OnChanges, OnInit } from '@angular/core';
import { InstanceOptions, Modal, ModalOptions } from 'flowbite';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ApiService } from '../../../../core/services/api.service';
import { CreateDoctorComponent } from '../create-doctor/create-doctor.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-doctors',
  standalone: true,
  imports: [CreateDoctorComponent, NgxPaginationModule, CommonModule],
  templateUrl: './doctors.component.html',
  styleUrl: './doctors.component.css'
})
export class DoctorsComponent implements OnInit{
  data: any[] = [];
  filtereddoctor: any[] = [];

  alldoctors: number = 0;
  pagination: number = 1;

  cantdoctorsPerPage: number = 8;

  token = localStorage.getItem('token');

  offset: number = 0;
  limit: number = 11;
  maxPatients: number = 0;
  maxPages: number = 0;
  currentPage: number = 1;

  constructor(
    private router: Router,
    public doctorapiservice: ApiService
  ) {}

  // Change number of doctors per page
  @HostListener('window:resize', ['$event'])
  onResize(): void {
    let height = window.innerHeight;

    if (height < 800) {
      this.cantdoctorsPerPage = 8;
    } else {
      this.cantdoctorsPerPage = 12;
    }
  }

  ngOnInit(): void {
    this.getUser();
    this.onResize();
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

  countDoctors() {
    const token = localStorage.getItem('token')!;

    this.doctorapiservice.countDoctors(token).subscribe((countRes: any) => {
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

      this.doctorapiservice.getDoctors({limit: this.limit, offset: this.offset, token: this.token}).subscribe((data: any[]) => {
        this.data = data;
        this.filtereddoctor = data;
      });
    } catch (error) {
      console.log('Error while getting users: ',error);
    }

  }

  modifydoctor(dni: string): void {
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

    // console.log(dataToSearch);

    if (!dataToSearch) {
      this.filtereddoctor = this.data.slice();
      // console.log(this.filtereddoctor);
    } else {
      const searchName = this.data.filter((datadoctorToFilter: any) =>
        datadoctorToFilter.firstname.toLowerCase().includes(dataToSearch.toLowerCase()) ||
        datadoctorToFilter.lastname.toLowerCase().includes(dataToSearch.toLowerCase()) ||
        datadoctorToFilter.dni.toLowerCase().includes(dataToSearch.toLowerCase()) ||
        datadoctorToFilter.phone.toLowerCase().includes(dataToSearch.toLowerCase()) /*||
        datadoctorToFilter.city.toLowerCase().includes(dataToSearch.toLowerCase()) ||
        datadoctorToFilter.email.toLowerCase().includes(dataToSearch.toLowerCase())*/

      );

      if (searchName.length > 0) {
        this.filtereddoctor = searchName;
      } else {
        this.filtereddoctor = this.data;

        Swal.fire({
          text: "We didn't found any doctors..." ,
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

  renderPage(event: any) {
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
