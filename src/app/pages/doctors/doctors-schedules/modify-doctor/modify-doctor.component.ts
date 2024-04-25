import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import Swal from 'sweetalert2';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { phoneNumberValidator } from '../../../shared/validators/phone.validator';
import { dniValidator } from '../../../shared/validators/dni.validator';

import { FormatFormsInputsService } from '../../../shared/services/format-forms-inputs.service';
import { textValidator } from '../../../shared/validators/text.validator';

@Component({
  selector: 'app-modify-doctor',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './modify-doctor.component.html',
  styleUrl: './modify-doctor.component.css',
})
export class ModifyDoctorComponent implements OnInit {

  datadoctor: any = [];

  dnidoctor: string = '';

  doctors: any = [];

  dataDoctor: any = [];

  appointmentsdoctor: any = [];

  token = localStorage.getItem('token');

  constructor(
    private router: Router,
    private apiService: ApiService,
    private activatedRouter: ActivatedRoute,
    private formatForm: FormatFormsInputsService,
  ) {}

  ngOnInit(): void {

    this.activatedRouter.params.subscribe(req => {

      this.dnidoctor = req['dniDoctor'];

      this.getDataDoctor(this.dnidoctor);
      this.getDoctors();
    })
  }

  modifyDoctorForm = new FormGroup({
    doctorDNI: new FormControl('', [
      Validators.required,
      dniValidator
    ]),
    doctorName: new FormControl('', [
      Validators.required,
      textValidator
    ]),
    doctorLastname: new FormControl('', [
      Validators.required, textValidator
    ]),
    doctorPhone: new FormControl('', [
      Validators.required,
      phoneNumberValidator
    ]),
    doctorGender: new FormControl('', Validators.required),
    doctorDoctor: new FormControl('', Validators.required),
    doctorEmail: new FormControl('', Validators.email),
    doctorCity: new FormControl('', [Validators.nullValidator, textValidator]),
  });

  getDataDoctor(dniToFind: string){

    let doctorData = {
      token: localStorage.getItem('token'),
      dni: dniToFind
    }
  
    this.apiService.getDoctorByDNI(doctorData).subscribe((doctorResponse: any) => {
      if(doctorResponse){
        this.dataDoctor = doctorResponse;
  
        this.modifyDoctorForm.patchValue({
          doctorDNI: this.dataDoctor.dni,
          doctorName: this.dataDoctor.firstname,
          doctorLastname: this.dataDoctor.lastname,
          doctorCity: this.dataDoctor.city,
          doctorPhone: this.dataDoctor.phone,
          doctorEmail: this.dataDoctor.email,
          doctorGender: this.dataDoctor.gender,
          doctorDoctor: this.dataDoctor.assigneddoctor != null ? this.dataDoctor.assigneddoctor : null,
        });
        
        if (this.dataDoctor.assigneddoctor){
          let doctorData = {
            dni: this.dataDoctor.assigneddoctor,
            token: this.token
          }
    
          this.apiService.getDoctorByDNI(doctorData).subscribe((doctorResponse: any) => {
            if(doctorResponse) {
              // console.log(doctorResponse);
    
              const doctorInfo = {
                doctorName: doctorResponse.firstname,
                doctorLastname: doctorResponse.lastname
              };
    
              this.dataDoctor = doctorInfo;
              // console.log(this.dataDoctor);
            }
          });
        }

  
      }
    });
  }

  getDoctors(){
    this.apiService.getDoctors(this.token!).subscribe((data: any) => {
      if (data){
        this.doctors = data;
        // console.log(this.doctors);
      }
    });
  }


  returnBack(){
    this.router.navigate(['/doctors']);
  }

  saveChanges(): void {

    // FORMAT DATA doctor
    const formattedName = this.formatForm.formatTextToUpper(this.modifyDoctorForm.value.doctorName!);
    const formattedLastName = this.formatForm.formatTextToUpper(this.modifyDoctorForm.value.doctorLastname!);
    const formattedCity = this.modifyDoctorForm.value.doctorCity ? this.formatForm.formatTextToUpper(this.modifyDoctorForm.value.doctorCity!) : this.modifyDoctorForm.value.doctorCity;


    const data = {
      token: localStorage.getItem('token'),
      doctorData: {
        dni: this.modifyDoctorForm.value.doctorDNI,
        firstname: formattedName,
        lastname: formattedLastName,
        gender: this.modifyDoctorForm.value.doctorGender,
        city: formattedCity,
        email: this.modifyDoctorForm.value.doctorEmail,
        phone: this.modifyDoctorForm.value.doctorPhone,
        assigneddoctor: this.modifyDoctorForm.value.doctorDoctor,
      }
    }

    // console.log(data);

    Swal.fire({
      title: 'Do you want to save changes?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.apiService.modifyDoctor(data).subscribe(
          (data: any) => {
            // console.log(data);

            if (data) {
              Swal.fire({
                text: 'Changes saved!',
                icon: 'success',
                toast: true,
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                position: 'bottom'
              });
    
              setTimeout(() => {
                this.router.navigate(['/doctors']);
              }, 3000);   
              
            } else {
              Swal.fire({
                title: 'Error',
                text: 'Error deleting doctor. Please try again.',
                icon: 'error',
              });
            }
          },
          (error) => {
            console.error('Error deleting doctor:', error);

            Swal.fire({
              title: 'Error',
              text: 'Error deleting doctor. Please try again.',
              icon: 'error',
            });
          }
        );
      }
    });
  }

  deleteDoctor(): void {
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

        const data = {
          token: localStorage.getItem('token'),
          dni: this.modifyDoctorForm.value.doctorDNI!
        }

        this.apiService.deleteDoctor(data).subscribe(
          (data: any) => {
            // console.log(data);

            if (data) {
              Swal.fire({
                icon: 'success',
                text: data.msn,
                toast: true,
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                position: 'bottom'
              });

              setTimeout(() => {
                this.router.navigate(['/doctors']);
              }, 3000);    
              
            } else {
              Swal.fire({
                title: 'Error',
                text: 'Error deleting doctor. Please try again.',
                icon: 'error',
              });
            }
          },
          (error) => {
            console.error('Error deleting doctor:', error);

            Swal.fire({
              title: 'Error',
              text: 'Error deleting doctor. Please try again.',
              icon: 'error',
            });
          }
        );
      }
    });
  }
}
