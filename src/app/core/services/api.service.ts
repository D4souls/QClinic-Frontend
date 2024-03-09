import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private httpclient: HttpClient) { }
  port = '8080'
  url = `http://localhost:${this.port}/`

  login(dataToLogin: unknown): Observable<any>{
    return this.httpclient.post(this.url + 'login', dataToLogin);
  }

  // Function to configure auth header

  configureAuthHeader(token: string){
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': token
      })
    }

    return httpOptions;
  }

  getPatients(data: any): Observable<any>{
    return this.httpclient.get(this.url + 'patients' + '?page=' + data.pagination, this.configureAuthHeader(data.token));
  }

  getPatientData(data: any): Observable<any>{
    return this.httpclient.get(this.url + `patient/${data.dni}`, this.configureAuthHeader(data.token));
  }  

  deletePatient(data: any): Observable<any> {
    return this.httpclient.delete(this.url + `delete-patient/${data.dni}`, this.configureAuthHeader(data.token));
  }

  createPatient(data: any): Observable<any> {
    return this.httpclient.post(this.url + 'create-patient', data.patientData, this.configureAuthHeader(data.token));
  }

  modifyPatient(data: any): Observable<any> {
    return this.httpclient.post(this.url + 'modify-patient', data.patientData, this.configureAuthHeader(data.token));
  }

  getDoctors(token: string): Observable<any> {
    return this.httpclient.get(this.url + 'doctors', this.configureAuthHeader(token));
  }

  getAppointments(token: string): Observable<any> {
    return this.httpclient.get(this.url + 'appointments', this.configureAuthHeader(token));
  }

  createAppointments(data: any): Observable<any> {
    return this.httpclient.post(this.url + 'create-appointment', data.appointmentData, this.configureAuthHeader(data.token));
  }

  getUserAppointments(data: any): Observable<any> {
    return this.httpclient.get(this.url + `user-appointments/${data.dni}`, this.configureAuthHeader(data.token));
  }

  getDayAppointments(data: any): Observable<any> {
    return this.httpclient.get(this.url + `day-appointments/${data.date}`, this.configureAuthHeader(data.token));
  }

  updateAppointments(data: any): Observable<any> {
    return this.httpclient.post(this.url + `update-appointment/`, data.appointmentData, this.configureAuthHeader(data.token));
  }

  deleteAppointments(data: any): Observable<any> {
    return this.httpclient.delete(this.url + `delete-appointment/${data.id}`, this.configureAuthHeader(data.token));
  }
}
