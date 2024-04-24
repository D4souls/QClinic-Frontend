import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private httpclient: HttpClient) { }
  port: number = 5172;
  ip: string = 'localhost';
  ip2: string = '192.168.0.142';
  url = `http://${this.ip}:${this.port}/api/`

  login(dataToLogin: unknown): Observable<any>{
    return this.httpclient.post(this.url + 'login', dataToLogin);
  }

  // Function to configure auth header

  configureAuthHeader(token: string){
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    }

    return httpOptions;
  }

  getPatients(data: any): Observable<any>{
    // return this.httpclient.get(this.url + 'patient' + '?page=' + data.pagination, /*this.configureAuthHeader(data.token)*/);
    return this.httpclient.get(this.url + 'patient', this.configureAuthHeader(data.token));
  }

  getPatientData(data: any): Observable<any>{
    return this.httpclient.get(this.url + `patient-info/${data.dni}`, this.configureAuthHeader(data.token));
  }  

  deletePatient(data: any): Observable<any> {
    return this.httpclient.delete(this.url + `patient-delete/${data.dni}`, this.configureAuthHeader(data.token));
  }

  createPatient(data: any): Observable<any> {
    return this.httpclient.post(this.url + 'patient-create', data.patientData, this.configureAuthHeader(data.token));
  }

  modifyPatient(data: any): Observable<any> {
    return this.httpclient.put(this.url + 'patient-update', data.patientData, this.configureAuthHeader(data.token));
  }

  getDoctors(token: string): Observable<any> {
    return this.httpclient.get(this.url + 'doctor', this.configureAuthHeader(token));
  }

  getDoctorByDNI(data: any): Observable<any> {
    return this.httpclient.get(this.url + `doctor-info/${data.dni}`, this.configureAuthHeader(data.token));
  }

  getAppointments(token: string): Observable<any> {
    return this.httpclient.get(this.url + 'appointment', this.configureAuthHeader(token));
  }

  createAppointments(data: any): Observable<any> {
    return this.httpclient.post(this.url + 'appointment-create', data.appointmentData, this.configureAuthHeader(data.token));
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
