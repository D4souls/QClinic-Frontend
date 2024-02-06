import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { Router } from '@angular/router';

import Swal from 'sweetalert2';
import { ApiService } from '../service/api.service';

@Component({
  selector: 'app-create-patient',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './create-patient.component.html',
  styleUrl: './create-patient.component.css',
})
export class CreatePatientComponent implements OnInit{
  constructor(private router: Router, private apiPatient: ApiService) {}

  ngOnInit(): void {
      this.getDoctors()
  }

  createPatientForm = new FormGroup({
    patientDNI: new FormControl('', Validators.required),
    patientName: new FormControl('', Validators.required),
    patientLastname: new FormControl('', Validators.required),
    patientPhone: new FormControl('', Validators.required),
    patientGender: new FormControl('', Validators.required),
    patientDoctor: new FormControl('', Validators.required),
    patientEmail: new FormControl(''),
    patientCity: new FormControl(''),
  });

  returnBack(){
    this.router.navigate(['/patients']);
  }

  createPatient() {
    const dataPatient = {
      dni: this.createPatientForm.value.patientDNI,
      firstname: this.createPatientForm.value.patientName,
      lastname: this.createPatientForm.value.patientLastname,
      gender: this.createPatientForm.value.patientGender,
      city: this.createPatientForm.value.patientCity,
      email: this.createPatientForm.value.patientEmail,
      phone: this.createPatientForm.value.patientPhone,
      // direccion: this.createPatientForm.value.patientDirection,
      assignedDoctor: this.createPatientForm.value.patientDoctor,
      // password: this.createPatientForm.value.patientPassword,

    };

    this.apiPatient.createPatient(dataPatient).subscribe(
      (response: any) => {
        if (response.message) {
          Swal.fire({
            title: 'Patient created!',
            showDenyButton: true,
            confirmButtonText: 'Return to patients',
            denyButtonText: 'Create more',
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigate(['/patients']);
            } else if (result.isDenied) {
              setTimeout(() => {
                this.router.navigate(['/create-patient']);
              }, 1000);
            }
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: response.message,
          });
        }
      },
      (error) => {
        console.error('Error en la solicitud:', error.error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error.error.data,
        });
      }
    );
  }

  doctors: any = [];

  getDoctors(){
    this.apiPatient.getDoctors().subscribe((data: any) => {

      if (data.success){
        this.doctors = data.data
        // console.log(this.doctors);
      } else {
        console.log(data);
      }

    })
  }

}
