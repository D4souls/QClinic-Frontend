import { Component, OnInit } from '@angular/core';
import { ModifyUserService } from '../service/modify-user.service';
import { Router } from '@angular/router';
import { PatientApiService } from '../service/patient-api.service';
import Swal from 'sweetalert2';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-modify-patient',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './modify-patient.component.html',
  styleUrl: './modify-patient.component.css',
})
export class ModifyPatientComponent implements OnInit {

  load: boolean = false;

  dataPatient: any[] = [];

  doctors: any = [];

  createPatientForm = new FormGroup({
    patientDNI: new FormControl('', Validators.required),
    patientName: new FormControl('', Validators.required),
    patientLastname: new FormControl('', Validators.required),
    patientPhone: new FormControl('', Validators.required),
    patientGender: new FormControl('', Validators.required),
    patientDoctor: new FormControl('', Validators.required),
    patientEmail: new FormControl('', Validators.required),
    patientCity: new FormControl('', Validators.required),
    // patientDirection: new FormControl('', Validators.required),
    // patientPassword: new FormControl('', Validators.required),
  });

  constructor(
    public modifyUserService: ModifyUserService,
    private router: Router,
    private apiService: PatientApiService,
  ) {}

  ngOnInit(): void {
    this.chekData();
    this.getDataPatient(this.modifyUserService.userDNI[0])
    this.getDoctors();
  }

  chekData(): void {
    if (this.modifyUserService.userDNI.length > 0) {
      this.load = true;
    } else {
      this.router.navigate(['/patients']);
    }
  }

  getDataPatient(dniToFind: string){
    this.apiService.getPatientData(dniToFind).subscribe((data: any) => {

      if(data && data.length > 0){
        this.dataPatient = data;

        this.createPatientForm.patchValue({
          patientDNI: this.dataPatient[0].dni,
          patientName: this.dataPatient[0].firstname,
          patientLastname: this.dataPatient[0].lastname,
          patientCity: this.dataPatient[0].city,
          patientPhone: this.dataPatient[0].phone,
          patientEmail: this.dataPatient[0].email,
          patientGender: this.dataPatient[0].gender,
          patientDoctor: this.dataPatient[0].assignedDoctor
        });
      }

    })
  }

  getDoctors(){
    this.apiService.getDoctors().subscribe((data: any) => {

      if (data.success){
        this.doctors = data.data
        // console.log(this.doctors);
      } else {
        console.log(data);
      }

    })
  }

  returnBack(){
    this.router.navigate(['/patients']);
  }

  saveChanges(): void {
    const dataPatient = {
      dni: this.createPatientForm.value.patientDNI,
      firstname: this.createPatientForm.value.patientName,
      lastname: this.createPatientForm.value.patientLastname,
      city: this.createPatientForm.value.patientCity,
      email: this.createPatientForm.value.patientEmail,
      assignedDoctor: this.createPatientForm.value.patientDoctor,
      phone: this.createPatientForm.value.patientPhone,
      gender: this.createPatientForm.value.patientGender,
      // direccion: this.createPatientForm.value.patientDirection,

    };

    // console.log(dataPatient);

    Swal.fire({
      title: 'Do you want to save changes?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!',
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
