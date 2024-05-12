import { Component, inject, signal } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { ApiService } from '../../../core/services/api.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-doctor-portal',
  standalone: true,
  imports: [CommonModule],
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

  appointmentsStadistics: any = [];
  appointmentsDay = signal<any>([]);

  moneyStadistics: any = [];

  token: string = localStorage.getItem('token')!;
  webLogin: string = localStorage.getItem('webLogin')!;
  router: any;


  ngOnInit(): void {
    this.getStadistics();
    this.getDoctor();
    // this.getAppointments();
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
    }

    this._apiService.getDayAppointments(data).subscribe((appointmentsRes: any) => {
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

  updateStatusPaymentSignal(id: number): void {
    
    const appointmentToUpdate = this.appointmentsDay().find((a: any) => a.appointmentInfo.id === id);

    if (appointmentToUpdate) appointmentToUpdate.appointmentInfo.payed = true;

    this.getStadistics();

  }
  

  updateStatusPayment(id: number){
    
    this._apiService.updatePaymentStatus({id: id, token: localStorage.getItem('token')}).subscribe((updatePayStatusRes: any) => {

      if (updatePayStatusRes.status == 200) {

        this.updateStatusPaymentSignal(id);

        Swal.fire({
          text: 'Now appoinment is payed',
          icon: 'success',
          toast: true,
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          position: 'bottom'
        });

      } else {
        Swal.fire({
          text: updatePayStatusRes.msn,
          icon: 'error',
          toast: true,
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          position: 'bottom'
        });
      }

    })
  }

  // GET DOCTOR
  getDoctor(){

    this._apiService.getDoctorByWebloginId({token: this.token, id: this.webLogin, date: new Date().toISOString().split('T')[0],}).subscribe((doctorsSignRes: any) => {
      if (doctorsSignRes.status == 200 && doctorsSignRes.res.length > 0){
        this.doctorInfo = doctorsSignRes.res[0];
      }
    });

  }

  redirectToDoctor(dni: string): void{
    this._router.navigate(["/doctors/modify-doctor", dni]);
  }
}
