import { Component, OnInit } from '@angular/core';
import { ModifyUserService } from '../service/modify-user.service';
import { Router } from '@angular/router';
import { PatientApiService } from '../service/patient-api.service';
import Swal from 'sweetalert2';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-modify-patient',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './modify-patient.component.html',
  styleUrl: './modify-patient.component.css',
})
export class ModifyPatientComponent implements OnInit {
  load: boolean = false;

  createPatientForm = new FormGroup({
    patientDNI: new FormControl("Hola", Validators.required),
    patientName: new FormControl('', Validators.required),
    patientLastname: new FormControl('', Validators.required),
    // patientPhone: new FormControl('', Validators.required),
    patientEmail: new FormControl('', Validators.required),
    patientCity: new FormControl('', Validators.required),
    // patientGender: new FormControl('', Validators.required),
    // patientDirection: new FormControl('', Validators.required),
    patientPassword: new FormControl('', Validators.required),
    patientDoctor: new FormControl('', Validators.required),
  });

  constructor(
    public modifyUserService: ModifyUserService,
    private router: Router,
    private apiService: PatientApiService
  ) {}

  ngOnInit(): void {
    // console.log(this.modifyUserService.userDNI.length);
    this.chekData();
  }

  chekData(): void {
    if (this.modifyUserService.userDNI.length > 0) {
      this.load = true;
    } else {
      this.router.navigate(['/patients']);
    }
  }

  discardChanges(): void {
    this.router.navigate(['/patients']);
  }

  saveChanges(): void {

    const dataPatient = {
      dni: this.createPatientForm.value.patientDNI,
      firstname: this.createPatientForm.value.patientName,
      lastname: this.createPatientForm.value.patientLastname,
      city: this.createPatientForm.value.patientCity,
      email: this.createPatientForm.value.patientEmail,
      // telefono: this.createPatientForm.value.patientPhone,
      // genero: this.createPatientForm.value.patientGender,
      // direccion: this.createPatientForm.value.patientDirection,
      assignedDoctor: this.createPatientForm.value.patientDoctor,
      password: this.createPatientForm.value.patientPassword,

    };

    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.apiService.modifyPatient(dataPatient).subscribe(
          (data: any) => {
            console.log(data);

            if (data.message) {
              Swal.fire({
                title: 'Success',
                text: data.message,
                icon: 'success',
                confirmButtonText: "Return back",
              }).then((result) => {
                if (result.isConfirmed) {
                  this.router.navigate(['/patients']);
                }
              });
              
            } else {
              Swal.fire({
                title: 'Error',
                text: 'Error deleting patient. Please try again.',
                icon: 'error',
              });
            }
          },
          (error) => {
            console.error('Error deleting patient:', error);

            Swal.fire({
              title: 'Error',
              text: 'Error deleting patient. Please try again.',
              icon: 'error',
            });
          }
        );
      }
    });
  }

  deletePatient(dni: string): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.apiService.deletePatient(dni).subscribe(
          (data: any) => {
            console.log(data);

            if (data.message) {
              Swal.fire({
                title: 'Success',
                text: data.message,
                icon: 'success',
                confirmButtonText: "Return back",
              }).then((result) => {
                if (result.isConfirmed) {
                  this.router.navigate(['/patients']);
                }
              });
              
            } else {
              Swal.fire({
                title: 'Error',
                text: 'Error deleting patient. Please try again.',
                icon: 'error',
              });
            }
          },
          (error) => {
            console.error('Error deleting patient:', error);

            Swal.fire({
              title: 'Error',
              text: 'Error deleting patient. Please try again.',
              icon: 'error',
            });
          }
        );
      }
    });
  }
}
