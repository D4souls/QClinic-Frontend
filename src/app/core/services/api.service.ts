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

  // PATIENTS METHODS
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



  // DOCTORS METHODS
  getDoctors(token: string): Observable<any> {
    return this.httpclient.get(this.url + 'doctor', this.configureAuthHeader(token));
  }

  getDoctorByDNI(data: any): Observable<any> {
    return this.httpclient.get(this.url + `doctor-info/${data.dni}`, this.configureAuthHeader(data.token));
  }

  deleteDoctor(data: any): Observable<any> {
    return this.httpclient.delete(this.url + `doctor-delete/${data.dni}`, this.configureAuthHeader(data.token));
  }

  createDoctor(data: any): Observable<any> {
    return this.httpclient.post(this.url + 'doctor-create', data.doctorData, this.configureAuthHeader(data.token));
  }

  modifyDoctor(data: any): Observable<any> {
    return this.httpclient.put(this.url + 'doctor-update', data.doctorData, this.configureAuthHeader(data.token));
  }


  // DOCTOR TYPE METHODS
  getDoctorsType(token: string): Observable<any> {
    return this.httpclient.get(this.url + 'doctorType', this.configureAuthHeader(token));
  }

  getDoctorTypeById(data: any): Observable<any> {
    return this.httpclient.get(this.url + `doctorType-info/${data.id}`, this.configureAuthHeader(data.token));
  }

  deleteDoctorType(data: any): Observable<any> {
    return this.httpclient.delete(this.url + `doctorType-delete/${data.id}`, this.configureAuthHeader(data.token));
  }

  createDoctorType(data: any): Observable<any> {
    return this.httpclient.post(this.url + 'doctorType-create', data.doctorTypeData, this.configureAuthHeader(data.token));
  }

  modifyDoctorType(data: any): Observable<any> {
    return this.httpclient.put(this.url + 'doctorType-update', data.doctorTypeData, this.configureAuthHeader(data.token));
  }


  // DOCTOR SCHEDULE METHODS
  getDoctorsSchedule(token: string): Observable<any> {
    return this.httpclient.get(this.url + 'doctorSchedule', this.configureAuthHeader(token));
  }

  getDoctorScheduleById(data: any): Observable<any> {
    return this.httpclient.get(this.url + `doctorSchedule-info/${data.id}`, this.configureAuthHeader(data.token));
  }

  deleteDoctorSchedule(data: any): Observable<any> {
    return this.httpclient.delete(this.url + `doctorSchedule-delete/${data.id}`, this.configureAuthHeader(data.token));
  }

  createDoctorSchedule(data: any): Observable<any> {
    return this.httpclient.post(this.url + 'doctorSchedule-create', data.doctorScheduleData, this.configureAuthHeader(data.token));
  }

  modifyDoctorSchedule(data: any): Observable<any> {
    return this.httpclient.put(this.url + 'doctorSchedule-update', data.doctorScheduleData, this.configureAuthHeader(data.token));
  }



  // APPOINMENTS METHODS
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
