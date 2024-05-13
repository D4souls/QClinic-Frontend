import { Component, inject, signal } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { ApiService } from '../../../core/services/api.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { InstanceOptions, Modal, ModalOptions } from 'flowbite';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormatTimesPipe } from '../../../core/pipe/format-times.pipe';

@Component({
  selector: 'app-doctor-portal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormatTimesPipe],
  templateUrl: './doctor-portal.component.html',
  styleUrl: './doctor-portal.component.css'
})
export class DoctorPortalComponent {
  private _apiService = inject(ApiService);
  private _router = inject(Router);

  patientsStadistics: any = [];
  patientsDay: any = [];

  doctorStadistics: any = [];
  doctorInfo: any = [];
  doctorSpecialization: any = [];
  doctorSchedule: any = [];

  appointmentsStadistics: any = [];
  appointmentsDay = signal<any>([]);

  appointmentSelected: number | undefined = undefined;


  token: string = localStorage.getItem('token')!;
  webLogin: string = localStorage.getItem('webLogin')!;
  router: any;


  ngOnInit(): void {
    this.getStadistics();
    this.getDoctor();
  }

  getStadistics(){

    this._apiService.getDoctorStadistics({id: this.webLogin, token: this.token }).subscribe((doctorStadisticsRes: any) => {

      if (doctorStadisticsRes.status == 200){
        this.doctorStadistics = doctorStadisticsRes.res;
      }

    });

  }

  getAppointments(){
    
    const data = {
      token: this.token,
      date: new Date().toISOString().split('T')[0],
      dni: this.doctorInfo.dni,
    }

    this._apiService.getDayAppointmentsByDoctor(data).subscribe((appointmentsRes: any) => {
      if (appointmentsRes) {

        const appointmentsObservables: Observable<any>[] = [];
        appointmentsRes.forEach((appointment: any) => {
          const patientData$ = this._apiService.getPatientData({ dni: appointment.assignedPatient, token: this.token });
          const doctorData$ = this._apiService.getDoctorByDNI({ dni: appointment.assignedDoctor, token: this.token });
          appointmentsObservables.push(patientData$);
          appointmentsObservables.push(doctorData$);
        });
    
        forkJoin(appointmentsObservables).subscribe((results: any[]) => {
          const calendarEvents: any[] = [];
    
          for (let i = 0; i < results.length; i += 2) {
            const patientData = results[i];
            const doctorData = results[i + 1];
            const appointment = appointmentsRes[i / 2];
            const finalData = {
              appointmentInfo: appointment,
              patientInfo: patientData,
              doctorInfo: doctorData
            };
            calendarEvents.push(finalData);

          }

          this.appointmentsDay.set(calendarEvents);

        }, (error) => {
          console.error('Error retrieving appointment data:', error);
        });
      }
    }, err => {
      console.error('Error fetching appointments: ' + err.error);
    });
    

  }


  // GET DOCTOR
  getDoctor(){

    this._apiService.getDoctorByWebloginId({token: this.token, id: this.webLogin}).subscribe((doctorsSignRes: any) => {
      if (doctorsSignRes.status == 200 && doctorsSignRes.res.length > 0){
        this.doctorInfo = doctorsSignRes.res[0];

        // console.log(this.doctorInfo);

        this.getAppointments();
        this.getSpecialization();
        this.getSchedule();

      }
    });

  }

  getSpecialization(): void {
    this._apiService.getDoctorTypeById({token: this.token, id: this.doctorInfo.doctorType}).subscribe((doctorTypeRes: any) => {
      if (!doctorTypeRes){
        Swal.fire({
          icon: 'error',
          text: "Error getting doctor specialization",
          toast: true,
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          position: 'bottom'
        });
      }

      this.doctorSpecialization = doctorTypeRes;

    });
  }

  getSchedule(): void {
    this._apiService.getDoctorScheduleById({token: this.token, id: this.doctorInfo.doctorSchedule}).subscribe((doctorScheduleRes: any) => {
      // console.log(doctorScheduleRes);

      if (!doctorScheduleRes){
        Swal.fire({
          icon: 'error',
          text: "Error getting doctor schedule",
          toast: true,
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          position: 'bottom'
        });
      }

      this.doctorSchedule = doctorScheduleRes;

    });
  }

  updateAppointment(){

    const textArea = document.getElementById('commentAppointment') as HTMLTextAreaElement;
    const now = new Date();
    const day = now.getDate();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    const formattedDate = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;

    const formattedTime = `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;

    const dateTime = `${formattedDate} ${formattedTime}`;

    const data = {
      token: this.token,
      appoinment: {
        id: this.appointmentSelected,
        AppointmentEnd: dateTime,
        comment: textArea.value
      }
    }

    this._apiService.updateAppointmentEnd(data).subscribe((endAppointmentRes: any) => {
      console.log(endAppointmentRes);

      if (endAppointmentRes.status != 200){
        Swal.fire({
          icon: 'error',
          text: "Error updating appointment",
          toast: true,
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          position: 'bottom'
        });
      }

      Swal.fire({
        icon: 'success',
        text: "Appointment finished",
        toast: true,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        position: 'bottom'
      });

    });

  }

  userWebForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  })

  updateCredentials(){
    
    const data = {
      token: this.token,
      newCredentials: {
        id: localStorage.getItem('webLogin'),
        username: this.userWebForm.value.username,
        passwd: this.userWebForm.value.password,
      }
    }

    this._apiService.updateCredentials(data).subscribe((credentialsRes: any) => {
      // console.log(credentialsRes);

      if (credentialsRes.status != 200){
        Swal.fire({
          icon: 'error',
          text: "Error updating credentials...",
          toast: true,
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          position: 'bottom'
        });
      }

      Swal.fire({
        icon: 'success',
        text: credentialsRes.msn,
        toast: true,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        position: 'bottom'
      });

    });

  }
  

  showPassword(): void {

    const showPassword = document.getElementById('openEye');
    const noShowPassword = document.getElementById('closeEye');

    const inputPassword = document.getElementById('passwd');

    if (showPassword?.style.display == 'none') {

      inputPassword?.setAttribute('type', 'text');
      
      showPassword!.style.display = 'block';
      noShowPassword!.style.display = 'none';

      
      noShowPassword!.classList.remove('animate-pop');
      showPassword!.classList.add('animate-pop');

    } else {

      inputPassword?.setAttribute('type', 'password');

      showPassword!.style.display = 'none';
      noShowPassword!.style.display = 'block';

      noShowPassword!.classList.add('animate-pop');
      showPassword!.classList.remove('animate-pop');
    }

  }

  redirectToDoctor(dni: string): void{
    this._router.navigate(["/doctors/modify-doctor", dni]);
  }

  openModal(appointmentID: number | null, modalName: string): void {
    const $targetEl = document.getElementById(modalName);

    if (appointmentID != null) this.appointmentSelected = appointmentID;

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
      override: true,
    };

    const modal: Modal = new Modal($targetEl, options, instanceOptions);

    
    modal.show();
  }

  returnBack(modalName: string) {

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
      override: true,
    };

    const modal: Modal = new Modal($targetEl, options, instanceOptions);

    
    modal.hide();
  }
}
