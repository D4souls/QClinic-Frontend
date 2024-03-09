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

  appointmentsPatient: any = [];

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
    patientCity: new FormControl('', textValidator),
  });

  getDataPatient(dniToFind: string){

    const data = {
      token: localStorage.getItem('token'),
      dni: dniToFind
    }

    this.apiService.getPatientData(data).subscribe((data: patientsInterfaces[]) => {

      if(data && data.length > 0){
        this.dataPatient = data;

        this.modifyPatientForm.patchValue({
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

  getDoctors(){

    const token = localStorage.getItem('token')!;

    this.apiService.getDoctors(token).subscribe((data: any) => {

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
        assignedDoctor: this.modifyPatientForm.value.patientDoctor,
        phone: this.modifyPatientForm.value.patientPhone,
      }
    }

    const dataPatient = {
    };

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
