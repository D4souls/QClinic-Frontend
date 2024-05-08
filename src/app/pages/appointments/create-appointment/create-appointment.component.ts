import { Component, Input, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { patientsInterfaces } from '../../../core/interfaces/patients/patients-interfaces';
import { ApiService } from '../../../core/services/api.service';
import { dateTimeValidator } from '../../../shared/validators/dateTime.validator';
import { textValidator } from '../../../shared/validators/text.validator';
import { Router } from '@angular/router';
import { ModalOptions, InstanceOptions, Modal } from 'flowbite';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-appointment',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create-appointment.component.html',
  styleUrl: './create-appointment.component.css'
})
export class CreateAppointmentComponent implements OnInit{

  @Input() modalId?: string;

  private token = localStorage.getItem('token');

  constructor(
    private apiService: ApiService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.getPatients();
    this.getDoctors();
    this.countDoctors();
    this.countPatients();
  }

  createAppointmentForm = new FormGroup({
    
    dateTime: new FormControl('', [Validators.required, dateTimeValidator]),
    appointmentComment: new FormControl('', [Validators.required, textValidator]),
    assignedDoctor: new FormControl('', [Validators.required]),
    assignedPatient: new FormControl('', [Validators.required])
  });


  onSubmit(event: Event): void {
    event.preventDefault();
  }


  createAppointment(): void {

    // If appointment count is less than 8
    const data = {
      token: localStorage.getItem('token'),
      appointmentData: {
        appointmentDate: this.createAppointmentForm.value.dateTime,
        appointmentStart: this.createAppointmentForm.value.dateTime,
        assignedPatient: this.createAppointmentForm.value.assignedPatient,
        assignedDoctor: this.createAppointmentForm.value.assignedDoctor,
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

  // SEARCH DOCTOR
  filteredDoctor: any = [];
  offsetDoctor: number = 0;
  limitDoctor: number = 11;
  maxDoctors: number = 0;
  maxPagesDoctors: number = 0;
  currentPageDoctor: number = 1;

  filterDoctor: any = undefined;

  dniSelectedDoctor = signal<any>("");

  countDoctors() {
    const token = localStorage.getItem('token')!;

    this.apiService.countDoctors(token).subscribe((countRes: any) => {
      // console.log(countRes)
      this.maxDoctors = countRes;
    });

  }

  nextPageDoctor(): void{
    const currentOffset = this.offsetDoctor + this.limitDoctor;
    this.offsetDoctor = currentOffset;
    this.currentPageDoctor = ++this.currentPageDoctor;
    this.getDoctors();
    this.countDoctors();
  }

  previousPageDoctor(): void{
    const currentOffset = this.offsetDoctor - this.limitDoctor;
    this.offsetDoctor = currentOffset;
    this.currentPageDoctor = --this.currentPageDoctor;
    this.getDoctors();
  }

  totalPagesDoctors(): number {
    this.maxPagesDoctors = Math.ceil(this.maxDoctors / this.limitDoctor);
    return this.maxPagesDoctors;
  }

  generatePageDoctorNumbers(): number[] {
    const pagesArray = [];
    const totalPages = this.totalPagesDoctors();
    if (totalPages < 1) pagesArray.push(1);
    
    for (let i = 1; i <= totalPages; i++) {
      pagesArray.push(i);
    }
    return pagesArray;
  }

  goToPageDoctor(page: number){
    this.offsetDoctor = ( page - 1 ) * this.limitDoctor;
    this.currentPageDoctor = page;
    this.getDoctors();
  }

  getDoctors(): void {

    const data = {
      limit: this.limitDoctor, 
      offset: this.offsetDoctor, 
      token: this.token,
      textFilter: this.filterDoctor,
    }

    try {

      this.apiService.getDoctors(data).subscribe((data: any) => {

        if (data.status != 200) {

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
          this.filteredDoctor = data.res;
        }
      });
    } catch (error) {
      console.log('Error while getting users: ',error);
    }

  }

  redirectToDoctor(dni: string): void {
    this.returnBack();
    this.router.navigate(['/doctors/modify-doctor', dni]);
  }

  filterDoctors(dataToSearch: string): void {

    if (dataToSearch === "") {
      
      this.filterDoctor = undefined;
      
      this.getDoctors();
      this.countDoctors();
      this.generatePageDoctorNumbers();
      
    } else {
  
      this.filterDoctor = dataToSearch;
  
      this.getDoctors();
      this.countDoctors();
      this.generatePageDoctorNumbers();
  
    }
    
  }

  unMarkDoctor(){
    this.dniSelectedDoctor.set(null);
    this.createAppointmentForm.get('assignedDoctor')?.setValue(null);
  }

  markDoctor(dni: string){
    this.dniSelectedDoctor.set(dni);
    this.createAppointmentForm.get('assignedDoctor')?.setValue(dni);
  }


  // SEARCH PATIENT
  filteredPatient: any = [];
  offsetPatient: number = 0;
  limitPatient: number = 5;
  maxPatients: number = 0;
  maxPagesPatients: number = 0;
  currentPagePatient: number = 1;

  filterPatient: any = undefined;

  dniSelectedPatient = signal<any>("");

  nextPagePatient(): void{
    const currentOffset = this.offsetPatient + this.limitPatient;
    this.offsetPatient = currentOffset;
    this.currentPagePatient = ++this.currentPagePatient;
    this.getPatients();
    this.countPatients();
  }

  previousPagePatient(): void{
    const currentOffset = this.offsetPatient - this.limitPatient;
    this.offsetPatient = currentOffset;
    this.currentPagePatient = --this.currentPagePatient;
    this.getPatients();
  }

  totalPagesPatients(): number {
    this.maxPagesPatients = Math.ceil(this.maxPatients / this.limitPatient);
    return this.maxPagesPatients;
  }

  generatePagePatientNumbers(): number[] {
    const pagesArray = [];
    const totalPages = this.totalPagesPatients();
    if (totalPages < 1) pagesArray.push(1);
    
    for (let i = 1; i <= totalPages; i++) {
      pagesArray.push(i);
    }
    return pagesArray;
  }

  goToPagePatient(page: number){
    this.offsetPatient = ( page - 1 ) * this.limitPatient;
    this.currentPagePatient = page;
    this.getPatients();
  }

  getPatients(){

    let patientData = {
      token: localStorage.getItem('token'),
      limit: this.limitPatient,
      offset: this.offsetPatient,
      textFilter: this.filterPatient
    }
  
    this.apiService.getPatients(patientData).subscribe((patientResponse: any) => {
      if(patientResponse.status == 200){
        
        this.filteredPatient = patientResponse.res;
  
      } else {
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
    });
  }

  countPatients() {
    const data = {
      token: localStorage.getItem('token')!,
      textFilter: this.filterPatient,
    };

    this.apiService.countPatients(data).subscribe((countRes: any) => {
      this.maxPatients = countRes.msn;
    });

  }

  redirectToPatient(dni: string): void {
    this.returnBack();
    this.router.navigate(['/patients/modify-patient', dni]);
  }

  unMarkPatient(){
    this.dniSelectedPatient.set(null);
    this.createAppointmentForm.get('assignedPatient')?.setValue(null);
  }

  markPatient(dni: string){
    this.dniSelectedPatient.set(dni);
    this.createAppointmentForm.get('assignedPatient')?.setValue(dni);
  }

  filterPatients(dataToSearch: string): void {

    console.log(dataToSearch);

    if (dataToSearch === "") {
      
      this.filterPatient = undefined;
      
      this.getPatients();
      this.countPatients();
      this.generatePagePatientNumbers();
      
    } else {
  
      this.filterPatient = dataToSearch;
  
      this.getPatients();
      this.countPatients();
      this.generatePagePatientNumbers();
  
    }
    
  }
}
