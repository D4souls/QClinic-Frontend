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

  // UPLOAD IMAGES METHODS
  uploadImg(data: any): Observable<any> {
    return this.httpclient.post(this.url + 'patient-avatar', data.img, this.configureAuthHeader(data.token));
  }

  // PATIENTS METHODS
  getPatients(data: any): Observable<any>{
    return this.httpclient.get(this.url + `patient?offset=${data.offset}&limit=${data.limit}&textFilter=${data.textFilter}`, this.configureAuthHeader(data.token));
  }

  countPatients(data: any): Observable<any>{
    return this.httpclient.get(this.url + `patient-count?textFilter=${data.textFilter}`, this.configureAuthHeader(data.token));
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

  changeStatusPatient(data: any): Observable<any> {
    return this.httpclient.put(this.url + `patient-changestatus/${data.dni}`, null, this.configureAuthHeader(data.token));
  }

  getPatientsByDniDoctor(data: any): Observable<any>{
    return this.httpclient.get(this.url + `patient-by-doctor-dni?offset=${data.offset}&limit=${data.limit}&dni=${data.dni}`, this.configureAuthHeader(data.token));
  }


  // DOCTORS METHODS
  getDoctors(data: any): Observable<any> {
    return this.httpclient.get(this.url + `doctor?limit=${data.limit}&offset=${data.offset}&textFilter=${data.textFilter}`, this.configureAuthHeader(data.token));
  }

  countDoctors(token: string): Observable<any> {
    return this.httpclient.get(this.url + `doctor-count`, this.configureAuthHeader(token));
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

  changeStatusDoctor(data: any): Observable<any> {
    return this.httpclient.put(this.url + `doctor-changestatus/${data.dni}`, null, this.configureAuthHeader(data.token));
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
    return this.httpclient.post(this.url + 'doctorSchedule-create', data.scheduleData, this.configureAuthHeader(data.token));
  }

  modifyDoctorSchedule(data: any): Observable<any> {
    return this.httpclient.put(this.url + 'doctorSchedule-update', data.doctorScheduleData, this.configureAuthHeader(data.token));
  }



  // APPOINMENTS METHODS
  getAppointments(data: any): Observable<any> {
    return this.httpclient.get(this.url + `appointment?limit=${data.limit}&offset=${data.offset}`, this.configureAuthHeader(data.token));
  }

  createAppointments(data: any): Observable<any> {
    return this.httpclient.post(this.url + 'appointment-create', data.appointmentData, this.configureAuthHeader(data.token));
  }

  getUserAppointments(data: any): Observable<any> {
    return this.httpclient.get(this.url + `appointment-info-patient/${data.dni}?limit=${data.limit}&offset=${data.offset}&order=${data.order}&filterText=${data.filterText}`, this.configureAuthHeader(data.token));
  }

  getDayAppointments(data: any): Observable<any> {
    return this.httpclient.get(this.url + `appointment-info-day/${data.date}`, this.configureAuthHeader(data.token));
  }

  countDayAppointments(data: any): Observable<any> {
    return this.httpclient.get(this.url + `appointment-count-day/${data.date}`, this.configureAuthHeader(data.token));
  }

  countAppointmentWithFilter(data: any): Observable<any> {
    return this.httpclient.get(this.url + `appointment-count-with-filter/?dni=${data.dni}&filterText=${data.filterText}`, this.configureAuthHeader(data.token));
  }

  countAppointments(token: string): Observable<any> {
    return this.httpclient.get(this.url + `appointment-count`, this.configureAuthHeader(token));
  }

  updateAppointments(data: any): Observable<any> {
    return this.httpclient.put(this.url + `appointment-update/`, data.appointmentData, this.configureAuthHeader(data.token));
  }

  deleteAppointments(data: any): Observable<any> {
    return this.httpclient.delete(this.url + `appointment-delete/${data.id}`, this.configureAuthHeader(data.token));
  }

  updatePaymentStatus(data: any): Observable<any> {
    return this.httpclient.put(this.url + `appointment-pay`, data.id, this.configureAuthHeader(data.token));
  };

  // AI METHOD
  callAssistant(data: any): Observable<any>{
    return this.httpclient.post('http://localhost:4047/api/v1/ollama', data);
  }
}
