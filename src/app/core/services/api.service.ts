import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private httpclient: HttpClient) { }
  port = '8080'
  url = `http://localhost:${this.port}/`

  getPatients(page: number): Observable<any>{
    return this.httpclient.get(this.url + 'patients' + '?page=' + page);
  }

  getPatientData(dni: string): Observable<any>{
    return this.httpclient.get(this.url + `patient/${dni}`);
  }  

  deletePatient(dni: string): Observable<any> {
    return this.httpclient.delete(this.url + `delete-patient/${dni}`);
  }

  createPatient(patientData: any): Observable<any> {
    return this.httpclient.post(this.url + 'create-patient', patientData);
  }

  modifyPatient(patientData: any): Observable<any> {
    return this.httpclient.post(this.url + 'modify-patient', patientData);
  }

  getDoctors(): Observable<any> {
    return this.httpclient.get(this.url + 'doctors')
  }

  getAppointments(): Observable<any> {
    return this.httpclient.get(this.url + 'appointments')
  }

  createAppointments(appointmentData: any): Observable<any> {
    return this.httpclient.post(this.url + 'create-appointment', appointmentData);
  }

  getUserAppointments(dni: string): Observable<any> {
    return this.httpclient.get(this.url + `user-appointments/${dni}`);
  }

  getDayAppointments(date: string): Observable<any> {
    return this.httpclient.get(this.url + `day-appointments/${date}`);
  }

  updateAppointments(appointmentData: any): Observable<any> {
    return this.httpclient.post(this.url + `update-appointment/`, appointmentData);
  }

  deleteAppointments(id: string): Observable<any> {
    return this.httpclient.delete(this.url + `delete-appointment/${id}`);
  }
}
