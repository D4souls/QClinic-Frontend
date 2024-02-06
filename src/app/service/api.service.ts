import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private httpclient: HttpClient) { }

  getPatients(): Observable<any>{
    return this.httpclient.get('http://localhost:8080/patients');
  }

  getPatientData(dni: string): Observable<any>{
    return this.httpclient.get(`http://localhost:8080/patient/${dni}`);
  }  

  deletePatient(dni: string): Observable<any> {
    return this.httpclient.delete(`http://localhost:8080/delete-patient/${dni}`);
  }

  createPatient(patientData: any): Observable<any> {
    return this.httpclient.post('http://localhost:8080/create-patient', patientData);
  }

  modifyPatient(patientData: any): Observable<any> {
    return this.httpclient.post('http://localhost:8080/modify-patient', patientData);
  }

  getDoctors(): Observable<any> {
    return this.httpclient.get('http://localhost:8080/doctors')
  }

  getAppointments(): Observable<any> {
    return this.httpclient.get('http://localhost:8080/appointments')
  }

  createAppointments(appointmentData: any): Observable<any> {
    return this.httpclient.post('http://localhost:8080/create-appointment', appointmentData);
  }

  getUserAppointments(dni: string): Observable<any> {
    return this.httpclient.get(`http://localhost:8080/user-appointments/${dni}`);
  }
}
