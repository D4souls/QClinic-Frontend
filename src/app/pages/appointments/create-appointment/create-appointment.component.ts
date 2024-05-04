import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { patientsInterfaces } from '../../../core/interfaces/patients/patients-interfaces';
import { ApiService } from '../../../core/services/api.service';
import { dateTimeValidator } from '../../../shared/validators/dateTime.validator';
import { textValidator } from '../../../shared/validators/text.validator';
import { Router } from '@angular/router';
import { ModalOptions, InstanceOptions, Modal } from 'flowbite';

@Component({
  selector: 'app-create-appointment',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './create-appointment.component.html',
  styleUrl: './create-appointment.component.css'
})
export class CreateAppointmentComponent implements OnInit{

  @Input() modalId?: string;
  
  patients: patientsInterfaces[] = [];
  filteredPatient: patientsInterfaces[] = [];
  
  doctors: any = [];
  filteredDoctor: any [] = [];

  constructor(
    private apiService: ApiService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.getDoctors();
    this.getPatients();
  }

  createAppointmentForm = new FormGroup({
    searchDataPatientForm: new FormGroup({
      dataToSearch: new FormControl(''),
      dataSelect : new FormControl('', Validators.required)

    }),
    searchDataDoctorForm: new FormGroup({
      dataToSearch: new FormControl(''),
      dataSelect : new FormControl('', Validators.required)

    }),
    dateTime: new FormControl('', [Validators.required, dateTimeValidator]),
    appointmentComment: new FormControl('', [Validators.required, textValidator])
  });


  getPatients(): void{

    const data = {
      pagination: 0,
      token: localStorage.getItem('token')
    }

    this.apiService.getPatients(data).subscribe((data: any) => {
      
      if (data){
        this.patients = data;
        this.filteredPatient = this.patients.slice();
      }
    });
  }

  getDoctors(){

    const token = localStorage.getItem('token')!;

    this.apiService.getDoctors(token).subscribe((data: any) => {

      if (data){
        this.doctors = data;
        this.filteredDoctor = this.doctors.slice();
      }

    })
  }

  createAppointment(): void {

    // If appointment count is less than 8
    const data = {
      token: localStorage.getItem('token'),
      appointmentData: {
        appointmentDate: this.createAppointmentForm.value.dateTime,
        appointmentStart: this.createAppointmentForm.value.dateTime,
        assignedPatient: this.createAppointmentForm.value.searchDataPatientForm?.dataSelect,
        assignedDoctor: this.createAppointmentForm.value.searchDataDoctorForm?.dataSelect,
        comment: this.createAppointmentForm.value.appointmentComment,
      }
    };


    Swal.fire({
      title: 'Do you want to create this appointment?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.apiService.createAppointments(data).subscribe(
          (data: any) => {

            // console.log(data);

            if (data.status == 200) {
              Swal.fire({
                title: 'Appointment created!',
                icon: 'success',
                toast: true,
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
                position: 'bottom'
              });
    
              setTimeout(() => {
                window.location.reload();
              }, 2000);
            
             } else {
               Swal.fire({
                 title: 'Error',
                 text: 'Error creating new appointment. Please try again.',
                 icon: 'error',
               });
             }
           },
           (error) => {
             console.error('Error creating new appointment:', error);

             Swal.fire({
               title: 'Error',
               text: 'Error creating new appointment. Please try again.',
               icon: 'error',
             });
           }
         );
       }
    });

    
  }


  filterPatients(dataToSearch: string): void{
    if (!dataToSearch) {
      this.filteredPatient = this.patients.slice();
    } else {
      const searchName = this.patients.filter((dataAppointmentToFilter: any) =>
        dataAppointmentToFilter.firstname.toLowerCase().includes(dataToSearch.toLowerCase()) ||
        dataAppointmentToFilter.lastname.toLowerCase().includes(dataToSearch.toLowerCase()) ||
        dataAppointmentToFilter.dni.toLowerCase().includes(dataToSearch.toLowerCase())

      );

      if (searchName.length > 0) {

        if (searchName.length === 1){

          this.createAppointmentForm.patchValue({
            searchDataPatientForm: {
              dataSelect: searchName[0].dni,
            },
          });

          this.filteredPatient = searchName;

        } else {
          this.filteredPatient = searchName;
        }

      } else {
        this.filteredPatient = this.patients;

        Swal.fire({
          icon: 'error',
          toast: true,
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          position: 'bottom',
          text: "We didn't found any patients..."
        });
      }

    }
  }

  filterDoctors(dataToSearch: string): void {
    if (!dataToSearch) {
      this.filteredDoctor = this.doctors.slice();
    } else {
      const searchName = this.doctors.filter((dataDoctorToFilter: any) =>
        dataDoctorToFilter.firstname.toLowerCase().includes(dataToSearch.toLowerCase()) ||
        dataDoctorToFilter.lastname.toLowerCase().includes(dataToSearch.toLowerCase()) ||
        dataDoctorToFilter.dni.toLowerCase().includes(dataToSearch.toLowerCase()) ||
        dataDoctorToFilter.email.toLowerCase().includes(dataToSearch.toLowerCase())

      );

      if (searchName.length > 0) {

        if (searchName.length === 1){

          this.createAppointmentForm.patchValue({
            searchDataDoctorForm: {
              dataSelect: searchName[0].dni,
            },
          });

          this.filteredDoctor = searchName;

        } else {
          this.filteredDoctor = searchName;
        }

      } else {
        this.filteredDoctor = this.doctors;

        Swal.fire({
          icon: 'error',
          toast: true,
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          position: 'bottom',
          text: "We didn't found any doctors..."
        });
      }

    }
  }

  onSubmitPatient(event: Event): void{
    event.preventDefault();
  }

  onSubmitDoctor(event: Event): void{
    event.preventDefault();
  }

  returnBack(): void {
    const modalElement = document.getElementById(this.modalId!);

    if (modalElement) {
      const options: ModalOptions = {
        placement: 'bottom-right',
        backdrop: 'dynamic',
        backdropClasses:
          'bg-gray-900/50 dark:bg-gray-900/80 fixed inset-0 z-40',
        closable: true,
      };

      const instanceOptions: InstanceOptions = {
        id: this.modalId,
        override: true,
      };

      const modal: Modal = new Modal(modalElement, options, instanceOptions);

      modal.hide();
    } else {
      console.error('We did not found ID:', this.modalId);
    }
  }

}
