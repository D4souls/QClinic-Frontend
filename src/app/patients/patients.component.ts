import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { ModifyUserService } from '../service/modify-user.service';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [],
  templateUrl: './patients.component.html',
  styleUrl: './patients.component.css'
})
export class PatientsComponent{

  constructor(public modifyUserService: ModifyUserService, private router: Router) {};

  httpClient = inject(HttpClient);
  data: any = [];

  ngOnInit(): void {
    this.getUser();
  }

  getUser(): void {
    this.httpClient.get('http://localhost/api/patients.php')
      .subscribe((data: any) => {
        console.log(data);
        this.data = data;
      });
  };

  modifyPatient(dni: string):void{
    this.modifyUserService.shareData(dni);
    console.info(this.modifyUserService.userDNI);
    this.router.navigate(['/modify-patient']);
    // window.location.href = '/modify-patient';
  }
}
