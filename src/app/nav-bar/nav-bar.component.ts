import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PatientApiService } from '../service/patient-api.service';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {
  
  name = "Sergio"

  //? NEED LOGIN DATA TO USE THIS

  // data: any = [];

  // constructor(
  //   public patientApiService: PatientApiService,
  // ){}

  // ngOnInit(): void {
  //   this.getUserName();
  // }

  // getUserName(): void {
  //   this.patientApiService.getPatientData().subscribe((data: any) => {
  //     console.log(data);
  //     this.data = data;
  //   });
  // }

  
}