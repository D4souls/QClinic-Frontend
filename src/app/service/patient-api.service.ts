import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PatientApiService {

  constructor(private httpclient: HttpClient) { }

  data: any = [];

  getPatientData(): Observable<any>{
    return this.httpclient.get('http://localhost/api/patients.php');
  }
}
