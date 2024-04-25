import { Component } from '@angular/core';
import { InstanceOptions, Modal, ModalOptions } from 'flowbite';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ApiService } from '../../../../core/services/api.service';
import { CreateDoctorSchedulesComponent } from '../create-doctor-schedules/create-doctor-schedules.component';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-show-doctors-schedules',
  standalone: true,
  imports: [CreateDoctorSchedulesComponent, NgxPaginationModule],
  templateUrl: './show-doctors-schedules.component.html',
  styleUrl: './show-doctors-schedules.component.css'
})
export class DoctorsScheduleComponent {
  dataSchedules: any[] = [];
  filteredSchedules: any[] = [];

  alldoctors: number = 0;
  pagination: number = 1;

  cantdoctorsPerPage: number = 6;

  token = localStorage.getItem('token');

  constructor(
    private router: Router,
    public doctorapiservice: ApiService
  ) {}

  ngOnInit(): void {
    this.getSchedules();
  }

  getSchedules(): void {

    try {

      const token = localStorage.getItem('token')!;

      this.doctorapiservice.getDoctorsSchedule(token).subscribe((doctorsSchedules: any[]) => {
        this.dataSchedules = doctorsSchedules;
        this.filteredSchedules = doctorsSchedules;
      });
    } catch (error) {
      console.log('Error while getting schedules: ',error);
    }

  }

  modifydoctor(dni: string): void {
    this.router.navigate(['/doctors/modify-doctor', dni]);
  }

  redirectToDoctors(): void {
    this.router.navigate(['/doctors']);
  }

  redirectToDoctorType(): void {
    this.router.navigate(['/doctors/specializations']);
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
      this.filteredSchedules= this.dataSchedules.slice();
      // console.log(this.filteredSchedules);
    } else {
      const searchName = this.dataSchedules.filter((datadoctorToFilter: any) =>
        datadoctorToFilter.firstname.toLowerCase().includes(dataToSearch.toLowerCase()) ||
        datadoctorToFilter.lastname.toLowerCase().includes(dataToSearch.toLowerCase()) ||
        datadoctorToFilter.dni.toLowerCase().includes(dataToSearch.toLowerCase()) ||
        datadoctorToFilter.city.toLowerCase().includes(dataToSearch.toLowerCase()) ||
        datadoctorToFilter.email.toLowerCase().includes(dataToSearch.toLowerCase())

      );

      if (searchName.length > 0) {
        this.filteredSchedules = searchName;
      } else {
        this.filteredSchedules = this.dataSchedules;

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
    this.getSchedules();
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
