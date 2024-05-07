import { Component, HostListener } from '@angular/core';
import { InstanceOptions, Modal, ModalOptions } from 'flowbite';
import { Router, RouterOutlet } from '@angular/router';
import Swal from 'sweetalert2';
import { ApiService } from '../../../../core/services/api.service';
import { CreateDoctorSchedulesComponent } from '../create-doctor-schedules/create-doctor-schedules.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ModifyDoctorScheduleComponent } from '../modify-doctor-schedules/modify-doctor-schedule.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-show-doctors-schedules',
  standalone: true,
  imports: [CreateDoctorSchedulesComponent, NgxPaginationModule, ModifyDoctorScheduleComponent, RouterOutlet, CommonModule],
  templateUrl: './show-doctors-schedules.component.html',
  styleUrl: './show-doctors-schedules.component.css'
})
export class DoctorsScheduleComponent {
  dataSchedules: any = [];

  token = localStorage.getItem('token');

  offset: number = 0;
  limit: number = 11;
  maxSchedules: number = 0;
  maxPages: number = 0;
  currentPage: number = 1;

  filter: any = undefined;

  constructor(
    private router: Router,
    public doctorapiservice: ApiService
  ) {}

  ngOnInit(): void {
    this.getSchedules();
    this.countSchedules();
  }

  // Change number of doctors per page
  @HostListener('window:resize', ['$event'])
  onResize(): void {
    let height = window.innerHeight;

    if (height < 800) {
      this.limit = 8;
      this.getSchedules();
      this.countSchedules();
    } else {
      this.limit = 11;
      this.getSchedules();
      this.countSchedules();
    }
  }

  getSchedules(): void {

    try {

      const data = {
        token: this.token,
        limit: this.limit,
        offset: this.offset,
        textFilter: this.filter,

      }

      this.doctorapiservice.getDoctorsSchedule(data).subscribe((doctorsSchedulesRes: any) => {
        
        // console.log(doctorsSchedulesRes)

        if (doctorsSchedulesRes.status == 200) {
          this.dataSchedules = doctorsSchedulesRes.res;
        } else {
          Swal.fire({
            text: "We didn't find schedules",
            icon: 'error',
            toast: true,
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            position: 'bottom'
          });
        }

      });
    } catch (error) {
      console.log('Error while getting schedules: ',error);
    }

  }

  modifySchedule(dni: string): void {

    const $targetEl = document.getElementById('modal-edit-schedule');
    // Modal Options
    const options: ModalOptions = {
      placement: 'bottom-right',
      backdrop: 'dynamic',
      backdropClasses: 'bg-gray-900/50 fixed inset-0 z-40',
      closable: false,
    };
    
    // Modal instance options
    const instanceOptions: InstanceOptions = {
      id: 'modal-edit-schedule',
      override: true
    };

    const modal: Modal = new Modal($targetEl, options, instanceOptions);

    
    modal.show();

    this.router.navigate(['/doctors/schedules/modify-schedule', dni]);
  }

  newSchedule(): void {
    const $targetEl = document.getElementById('modal-create-schedule');
    // Modal Options
    const options: ModalOptions = {
      placement: 'bottom-right',
      backdrop: 'dynamic',
      backdropClasses: 'bg-gray-900/50 fixed inset-0 z-40',
      closable: true,
    };
    
    // Modal instance options
    const instanceOptions: InstanceOptions = {
      id: 'modal-create-schedule',
      override: true
    };

    const modal: Modal = new Modal($targetEl, options, instanceOptions);

    
    modal.show();
  }

  // FUNCTIONS TO PAGINATION

  filterSchedules(dataToSearch: string): void {
    if (dataToSearch === "") {
      
      this.filter = undefined;
      
      this.getSchedules();
      this.countSchedules();
      this.generatePageNumbers();
      
    } else {
  
      this.filter = dataToSearch;
  
      this.getSchedules();
      this.countSchedules();
      this.generatePageNumbers();
  
    }
  }

  nextPage(): void{
    const currentOffset = this.offset + this.limit;
    this.offset = currentOffset;
    this.currentPage = ++this.currentPage;
    this.getSchedules();
  }

  previousPage(): void{
    const currentOffset = this.offset - this.limit;
    this.offset = currentOffset;
    this.currentPage = --this.currentPage;
    this.getSchedules();
  }

  countSchedules() {
    const data = {
      token: localStorage.getItem('token')!,
      textFilter: this.filter,
    };

    this.doctorapiservice.countDoctorsSchedule(data).subscribe((countRes: any) => {
      this.maxSchedules = countRes.msn;
    });

  }

  totalPages(): number {
    this.maxPages = Math.ceil(this.maxSchedules / this.limit);
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
    this.getSchedules();
  }

  // END FUNCTIONS TO PAGINATION

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
