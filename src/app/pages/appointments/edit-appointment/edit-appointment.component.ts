import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ApiService } from '../../../core/services/api.service';
import { dateValidator } from '../../../shared/validators/date.validator';
import { textValidator } from '../../../shared/validators/text.validator';

// FLOWBITE MODAL
import { ModalOptions, InstanceOptions, Modal } from 'flowbite';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormatLastnamePipe } from '../../../core/pipe/format-lastname.pipe';
@Component({
  selector: 'app-edit-appointment',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormatLastnamePipe],
  templateUrl: './edit-appointment.component.html',
  styleUrl: './edit-appointment.component.css'
})
export class EditAppointmentComponent implements OnInit {

  @Input() modalId?: string;
  
  // Save info appointment
  infoAppointmentDay: any = [];

  // Save info patient
  infoPatient: any = [];

  // Merge infoAppointmentDay + infoPatient
  generalData: any = [];

  apiService = inject(ApiService);
  router = inject(Router);
  
  // Save doctorInfo
  doctors: any = [];
  token: any = localStorage.getItem('token');

  // to show tables
  status = signal<boolean>(false);
  
  ngOnInit(): void {

  }

  // FormGroup to creat appointment
  createAppointmentForm = new FormGroup({
    searchAppointment: new FormGroup({
      date : new FormControl('', [Validators.required, dateValidator]),
      selectAppointment: new FormControl('', Validators.required),
    }),
    patientDNI: new FormControl('', [Validators.required]),
    doctorDNI: new FormControl('', [Validators.required]),
    appointmentComment: new FormControl('', [Validators.required])
  });

  getAppointments(date: string): void {
    let data = {
      date: date,
      token: localStorage.getItem('token')
    };


    // Reset arrays to clear data
    this.infoAppointmentDay = [];
    this.infoPatient = [];
    this.generalData = [];
    
    // Fetch dayAppointmentData from API
    this.apiService.getDayAppointments(data).subscribe((appointmentPerDayDataResponse: any) => {
      if (appointmentPerDayDataResponse) { 
        this.infoAppointmentDay = appointmentPerDayDataResponse;
        
        // Fetch dataPatient for each patient from dayAppointmentData
        const requests = appointmentPerDayDataResponse.map((patient: any) => {
          return this.apiService.getPatientData({dni: patient.assignedPatient, token: localStorage.getItem('token')}).toPromise();
        });
        
        // Create new promise to merge patientDataResponses with dayAppointmentData
        Promise.all(requests).then((patientDataResponses: any) => {
          patientDataResponses.forEach((patientDataResponse: any, index: any) => {
            if (patientDataResponse) {
              const combinedObject = Object.assign({}, appointmentPerDayDataResponse[index], patientDataResponse);
              this.generalData.push(combinedObject); 
              // console.log(this.generalData);
            }
          });
        });
      }


    }, (error) => {
      Swal.fire({
        icon: 'error',
        toast: true,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        position: 'bottom',
        text: error.error.message
      });
    });
  }


  loadData(id: string): void {

    const findIndexAppointment = this.generalData.findIndex((appointment:any) => appointment.id == id);

    this.dniSelectedDoctor.set(this.generalData[findIndexAppointment].assignedDoctor);
    this.dniSelectedPatient.set(this.generalData[findIndexAppointment].assignedPatient);

    this.filterDoctor = this.generalData[findIndexAppointment].assignedDoctor;
    this.filterPatient = this.generalData[findIndexAppointment].assignedPatient;

    // this.createAppointmentForm.get('doctorDNI')?.setValue(this.filterDoctor);
    // this.createAppointmentForm.get('patientDNI')?.setValue(this.filterPatient);
    
    const comment = this.generalData[findIndexAppointment].comment
    console.log(comment);

    this.createAppointmentForm.patchValue({
      patientDNI: `${this.filterPatient}`,
      appointmentComment: `${comment}`,
      doctorDNI: `${this.filterDoctor}`
    });
    

    this.getPatients();
    this.getDoctors();
    this.countPatients();
    this.countDoctors();

    this.status.set(true);
  }


  updateAppointment(): void {

    const dataAppointment = {
      token: localStorage.getItem('token'),
      appointmentData: {
        id: this.createAppointmentForm.value.searchAppointment?.selectAppointment,
        assignedPatient: this.createAppointmentForm.value.patientDNI,
        assignedDoctor: this.createAppointmentForm.value.doctorDNI,
        comment: this.createAppointmentForm.value.appointmentComment
      }
    }

    console.log(dataAppointment.appointmentData);

    Swal.fire({
      title: 'Do you want to save changes?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.apiService.updateAppointments(dataAppointment).subscribe(
          (data: any) => {
            // console.log(data);

             if (data) {
                Swal.fire({
                  title: 'Appointment edited!',
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
                 text: 'Error updating appointment. Please try again.',
                 icon: 'error',
               });
             }
           },
           (error) => {
             console.error('Error updating appointment:', error);

             Swal.fire({
               title: 'Error',
               text: 'Error updating appointment. Please try again.',
               icon: 'error',
             });
           }
         );
       }
     });
  }

  deleteAppointment(): void {

    const id = this.createAppointmentForm.value.searchAppointment!.selectAppointment;

    // console.log(id);

    Swal.fire({
      title: 'Do you want to delete this appointment?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!',
    }).then((result) => {
      if (result.isConfirmed) {

        const data = {
          token: localStorage.getItem('token'),
          id: id
        }

        this.apiService.deleteAppointments(data).subscribe(
          (data: any) => {
            // console.log(data);

             if (data) {
                Swal.fire({
                  title: 'Appointment deleted!',
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
                 text: 'Error deleting appointment. Please try again.',
                 icon: 'error',
               });
             }
           },
           (error) => {
             console.error('Error deleting appointment:', error);

             Swal.fire({
               title: 'Error',
               text: 'Error deleting appointment. Please try again.',
               icon: 'error',
             });
           }
         );
       }
    });

  }

  onSubmit(event: Event): void{
    event.preventDefault();
  }

  returnBack(): void {
    const modalElement: HTMLElement = document.getElementById('edit-appointment')!;

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
    this.createAppointmentForm.get('doctorDNI')?.setValue(null);
    this.filterDoctor = undefined;
    this.getDoctors();
  }

  markDoctor(dni: string){
    this.dniSelectedDoctor.set(dni);
    this.createAppointmentForm.get('doctorDNI')?.setValue(dni);
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
    this.createAppointmentForm.get('patientDNI')?.setValue(null);
    this.filterPatient = undefined;
    this.getPatients();
  }

  markPatient(dni: string){
    this.dniSelectedPatient.set(dni);
    this.createAppointmentForm.get('patientDNI')?.setValue(dni);
  }

  filterPatients(dataToSearch: string): void {

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
