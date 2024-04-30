import { Component, HostListener } from '@angular/core';
import { InstanceOptions, Modal, ModalOptions } from 'flowbite';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ApiService } from '../../../../core/services/api.service';
import { CreateDoctorTypeComponent } from '../create-doctor-type/create-doctor-type.component';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-doctors-type',
  standalone: true,
  imports: [CreateDoctorTypeComponent, NgxPaginationModule],
  templateUrl: './doctors-type.component.html',
  styleUrl: './doctors-type.component.css'
})
export class DoctorsTypeComponent {
  data: any[] = [];
  filteredDoctorType: any[] = [];

  alldoctors: number = 0;
  pagination: number = 1;

  cantdoctorsPerPage: number = 11;

  token = localStorage.getItem('token');

  constructor(
    private router: Router,
    public doctorapiservice: ApiService
  ) {}

  ngOnInit(): void {
    this.getDoctorType();
  }

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

  getDoctorType(): void {

    try {

      const token = localStorage.getItem('token')!;

      this.doctorapiservice.getDoctorsType(token).subscribe((data: any[]) => {
        this.data = data;
        this.filteredDoctorType = data;
      });
    } catch (error) {
      console.log('Error while getting doctor types: ',error);
    }

  }

  modifyDoctorType(id: number): void {
    this.router.navigate(['/doctors/specializations/modify-specialization', id]);
  }

  redirectToDoctors(): void {
    this.router.navigate(['/doctors']);
  }

  redirectToSchedules(): void {
    this.router.navigate(['/doctors/schedules']);
  }

  newDoctorType(): void {
    const $targetEl = document.getElementById('modal-create-doctor-type');
    // Modal Options
    const options: ModalOptions = {
      placement: 'bottom-right',
      backdrop: 'dynamic',
      backdropClasses: 'bg-gray-900/50 fixed inset-0 z-40',
      closable: true,
    };
    
    // Modal instance options
    const instanceOptions: InstanceOptions = {
      id: 'modal-create-doctor-type',
      override: true
    };

    const modal: Modal = new Modal($targetEl, options, instanceOptions);

    
    modal.show();
  }

  filterDoctorType(dataToSearch: string): void {

    // console.log(dataToSearch);

    if (!dataToSearch) {
      this.filteredDoctorType = this.data.slice();
      // console.log(this.filteredDoctorType);
    } else {
      const searchName = this.data.filter((doctorType: any) =>
        doctorType.name.toLowerCase().includes(dataToSearch.toLowerCase()) ||
        doctorType.description.toLowerCase().includes(dataToSearch.toLowerCase())

      );

      if (searchName.length > 0) {
        this.filteredDoctorType = searchName;
      } else {
        this.filteredDoctorType = this.data;

        Swal.fire({
          text: "We didn't found any specializations..." ,
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
    this.getDoctorType();
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
