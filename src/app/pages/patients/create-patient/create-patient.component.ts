import { Component, Input, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { Router } from '@angular/router';

import Swal from 'sweetalert2';
import { ApiService } from '../../../core/services/api.service';

import { phoneNumberValidator } from '../../../shared/validators/phone.validator';
import { dniValidator } from '../../../shared/validators/dni.validator';
import { textValidator } from '../../../shared/validators/text.validator';

import { FormatFormsInputsService } from '../../../shared/services/format-forms-inputs.service';

import { InstanceOptions, Modal, ModalOptions } from 'flowbite';

@Component({
  selector: 'app-create-patient',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './create-patient.component.html',
  styleUrl: './create-patient.component.css',
})
export class CreatePatientComponent implements OnInit {
  constructor(
    private router: Router,
    private apiPatient: ApiService,
    private formatForm: FormatFormsInputsService
  ) {}

  ngOnInit(): void {
    this.getDoctors();
  }

  @Input() modalId?: string;

  createPatientForm = new FormGroup({
    patientDNI: new FormControl('', [Validators.required, dniValidator]),
    patientName: new FormControl('', [Validators.required, textValidator]),
    patientLastname: new FormControl('', [Validators.required, textValidator]),
    patientPhone: new FormControl('', [
      Validators.required,
      phoneNumberValidator,
    ]),
    patientGender: new FormControl('', Validators.required),
    patientDoctor: new FormControl('', Validators.required),
    patientEmail: new FormControl('', Validators.email),
    patientCity: new FormControl('', Validators.nullValidator),
  });

  returnBack(): void {
    const modalElement = document.getElementById(this.modalId!);

    if (modalElement) {
      const options: ModalOptions = {
        placement: 'bottom-right',
        backdrop: 'dynamic',
        backdropClasses:
          'bg-gray-900/50 dark:bg-gray-900/80 fixed inset-0 z-40',
        closable: true,
      };

      const instanceOptions: InstanceOptions = {
        id: this.modalId,
        override: true,
      };

      const modal: Modal = new Modal(modalElement, options, instanceOptions);

      modal.hide();
    } else {
      console.error('We did not found ID:', this.modalId);
    }
  }

  createPatient() {
    // FORMAT DATA PATIENT
    const formattedDNI = this.formatForm.formatDNI(
      this.createPatientForm.value.patientDNI!
    );
    const formattedName = this.formatForm.formatTextToUpper(
      this.createPatientForm.value.patientName!
    );
    const formattedLastName = this.formatForm.formatTextToUpper(
      this.createPatientForm.value.patientLastname!
    );

    const data = {
      token: localStorage.getItem('token'),
      patientData: {
        dni: formattedDNI,
        firstname: formattedName,
        lastname: formattedLastName,
        gender: this.createPatientForm.value.patientGender,
        city: this.createPatientForm.value.patientCity,
        email: this.createPatientForm.value.patientEmail,
        phone: this.createPatientForm.value.patientPhone,
        assignedDoctor: this.createPatientForm.value.patientDoctor,
      }
    };

    this.apiPatient.createPatient(data).subscribe(
      (response: any) => {
        if (response.message) {
          Swal.fire({
            text: 'Patient created!',
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

  getDoctors() {

    const token = localStorage.getItem('token')!;

    this.apiPatient.getDoctors(token).subscribe((data: any) => {
      if (data.success) {
        this.doctors = data.data;
        // console.log(this.doctors);
      } else {
        console.log(data);
      }
    });
  }

  previewAvatar: any;

  filePreview(e: any) {
    if (e.target.files[0] != null) {
      var reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewAvatar = e.target.result;
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  }
}
