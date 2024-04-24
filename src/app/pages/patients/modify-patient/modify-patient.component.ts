import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import Swal from 'sweetalert2';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { phoneNumberValidator } from '../../../shared/validators/phone.validator';
import { dniValidator } from '../../../shared/validators/dni.validator';

import { FormatFormsInputsService } from '../../../shared/services/format-forms-inputs.service';
import { textValidator } from '../../../shared/validators/text.validator';
import { patientsInterfaces } from '../../../core/interfaces/patients/patients-interfaces';

@Component({
  selector: 'app-modify-patient',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './modify-patient.component.html',
  styleUrl: './modify-patient.component.css',
})
export class ModifyPatientComponent implements OnInit {

  dataPatient: any = [];

  dniPatient: string = '';

  doctors: any = [];

  dataDoctor: any = [];

  appointmentsPatient: any = [];

  token = localStorage.getItem('token');

  constructor(
    private router: Router,
    private apiService: ApiService,
    private activatedRouter: ActivatedRoute,
    private formatForm: FormatFormsInputsService,
  ) {}

  ngOnInit(): void {

    this.activatedRouter.params.subscribe(req => {

      this.dniPatient = req['dniPatient'];

      this.getDataPatient(this.dniPatient);
      this.getPatientAppointments(this.dniPatient);
      this.getDoctors();
    })
  }

  modifyPatientForm = new FormGroup({
    patientDNI: new FormControl('', [
      Validators.required,
      dniValidator
    ]),
    patientName: new FormControl('', [
      Validators.required,
      textValidator
    ]),
    patientLastname: new FormControl('', [
      Validators.required, textValidator
    ]),
    patientPhone: new FormControl('', [
      Validators.required,
      phoneNumberValidator
    ]),
    patientGender: new FormControl('', Validators.required),
    patientDoctor: new FormControl('', Validators.required),
    patientEmail: new FormControl('', Validators.email),
    patientCity: new FormControl('', [Validators.nullValidator, textValidator]),
  });

  getDataPatient(dniToFind: string){

    let patientData = {
      token: localStorage.getItem('token'),
      dni: dniToFind
    }
  
    this.apiService.getPatientData(patientData).subscribe((patientResponse: any) => {
      if(patientResponse){
        this.dataPatient = patientResponse;
  
        this.modifyPatientForm.patchValue({
          patientDNI: this.dataPatient.dni,
          patientName: this.dataPatient.firstname,
          patientLastname: this.dataPatient.lastname,
          patientCity: this.dataPatient.city,
          patientPhone: this.dataPatient.phone,
          patientEmail: this.dataPatient.email,
          patientGender: this.dataPatient.gender,
          patientDoctor: this.dataPatient.assigneddoctor != null ? this.dataPatient.assigneddoctor : null,
        });
        
        if (this.dataPatient.assigneddoctor){
          let doctorData = {
            dni: this.dataPatient.assigneddoctor,
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

  getPatientAppointments(dni: string) {

    const data = {
      token: localStorage.getItem('token'),
      dni: dni
    }

    this.apiService.getUserAppointments(data).subscribe((data: any) => {
      this.appointmentsPatient = data.data;
      console.log(this.appointmentsPatient);
    })
  }


  returnBack(){
    this.router.navigate(['/patients']);
  }

  saveChanges(): void {

    // FORMAT DATA PATIENT
    const formattedName = this.formatForm.formatTextToUpper(this.modifyPatientForm.value.patientName!);
    const formattedLastName = this.formatForm.formatTextToUpper(this.modifyPatientForm.value.patientLastname!);
    const formattedCity = this.modifyPatientForm.value.patientCity ? this.formatForm.formatTextToUpper(this.modifyPatientForm.value.patientCity!) : this.modifyPatientForm.value.patientCity;


    const data = {
      token: localStorage.getItem('token'),
      patientData: {
        dni: this.modifyPatientForm.value.patientDNI,
        firstname: formattedName,
        lastname: formattedLastName,
        gender: this.modifyPatientForm.value.patientGender,
        city: formattedCity,
        email: this.modifyPatientForm.value.patientEmail,
        phone: this.modifyPatientForm.value.patientPhone,
        assigneddoctor: this.modifyPatientForm.value.patientDoctor,
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
        this.apiService.modifyPatient(data).subscribe(
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
                this.router.navigate(['/patients']);
              }, 3000);   
              
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

  deletePatient(): void {
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
          dni: this.modifyPatientForm.value.patientDNI!
        }

        this.apiService.deletePatient(data).subscribe(
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
                this.router.navigate(['/patients']);
              }, 3000);    
              
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
