import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { dniValidator } from '../../../shared/validators/dni.validator';
import { phoneNumberValidator } from '../../../shared/validators/phone.validator';
import { textValidator } from '../../../shared/validators/text.validator';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { FormatFormsInputsService } from '../../../shared/services/format-forms-inputs.service';

@Component({
  selector: 'app-create-appointment',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './create-appointment.component.html',
  styleUrl: './create-appointment.component.css'
})
export class CreateAppointmentComponent implements OnInit{

  constructor(
    private router: Router,
    private apiService: ApiService,
    private formatForm: FormatFormsInputsService,
  ) {}

  ngOnInit(): void {
    this.getDoctors()
  }

  createAppointmentForm = new FormGroup({
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

  createAppointment(): void {

    // FORMAT DATA PATIENT
    const formattedName = this.formatForm.formatTextToUpper(this.createAppointmentForm.value.patientName!);
    const formattedLastName = this.formatForm.formatTextToUpper(this.createAppointmentForm.value.patientLastname!);
    const formattedCity = this.createAppointmentForm.value.patientCity ? this.formatForm.formatTextToUpper(this.createAppointmentForm.value.patientCity!) : this.createAppointmentForm.value.patientCity;

    const dataPatient = {
      dni: this.createAppointmentForm.value.patientDNI,
      firstname: formattedName,
      lastname: formattedLastName,
      gender: this.createAppointmentForm.value.patientGender,
      city: formattedCity,
      email: this.createAppointmentForm.value.patientEmail,
      assignedDoctor: this.createAppointmentForm.value.patientDoctor,
      phone: this.createAppointmentForm.value.patientPhone,
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

  doctors: any = [];

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

}
