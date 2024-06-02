import { Component, inject, OnInit, signal } from '@angular/core';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { ApiService } from '../../core/services/api.service';
import { forkJoin, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { FormatLastnamePipe } from '../../core/pipe/format-lastname.pipe';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NavBarComponent, CommonModule, FormatLastnamePipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{

  private _apiService = inject(ApiService);
  private _router = inject(Router);

  patientsStadistics: any = [];
  patientsDay: any = [];

  doctorsStadistics: any = [];
  doctorsDay: any = [];

  appointmentsStadistics: any = [];
  appointmentsDay = signal<any>([]);

  moneyStadistics: any = [];

  token: string = localStorage.getItem('token')!;
  router: any;


  ngOnInit(): void {
    this.getStadistics();
    this.getAppointments();
    this.getDoctors();
  }

  getStadistics(){

    this._apiService.getPatientsStadistics(this.token).subscribe((patientsStadisticsRes: any) => {

      if (patientsStadisticsRes.status == 200){
        this.patientsStadistics = patientsStadisticsRes.res;
      }

    });

    this._apiService.getDoctorsStadistics(this.token).subscribe((doctorsStadisticsRes: any) => {

      if (doctorsStadisticsRes.status == 200){
        this.doctorsStadistics = doctorsStadisticsRes.res;
      }

    });

    this._apiService.getAppointmentsStadistics(this.token).subscribe((appointmentsStadisticsRes: any) => {
      
      if (appointmentsStadisticsRes.status == 200){
        this.appointmentsStadistics = appointmentsStadisticsRes.res;
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

  // GET DOCTORS AND SCHEDULES

  getDoctors(){

    this._apiService.getDoctorsSignUp(this.token).subscribe((doctorsSignRes: any) => {
      if (doctorsSignRes.status == 200 && doctorsSignRes.res.length > 0){
        this.doctorsDay = doctorsSignRes.res;
      }
    });

  }

  redirectToDoctor(dni: string): void{
    this._router.navigate(["/doctors/modify-doctor", dni]);
  }

}
