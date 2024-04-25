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
  selector: 'app-create-doctor',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './create-doctor.component.html',
  styleUrl: './create-doctor.component.css',
})
export class CreateDoctorComponent implements OnInit {
  constructor(
    private router: Router,
    private apidoctor: ApiService,
    private formatForm: FormatFormsInputsService
  ) {}

  ngOnInit(): void {
    this.getDoctors();
  }

  @Input() modalId?: string;

  createDoctorForm = new FormGroup({
    doctorDNI: new FormControl('', [Validators.required, dniValidator]),
    doctorName: new FormControl('', [Validators.required, textValidator]),
    doctorLastname: new FormControl('', [Validators.required, textValidator]),
    doctorPhone: new FormControl('', [
      Validators.required,
      phoneNumberValidator,
    ]),
    doctorGender: new FormControl('', Validators.required),
    doctorDoctor: new FormControl('', Validators.required),
    doctorEmail: new FormControl('', Validators.email),
    doctorCity: new FormControl('', Validators.nullValidator),
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

  createDoctor() {
    // FORMAT DATA doctor
    const formattedDNI = this.formatForm.formatDNI(
      this.createDoctorForm.value.doctorDNI!
    );
    const formattedName = this.formatForm.formatTextToUpper(
      this.createDoctorForm.value.doctorName!
    );
    const formattedLastName = this.formatForm.formatTextToUpper(
      this.createDoctorForm.value.doctorLastname!
    );

    const data = {
      token: localStorage.getItem('token'),
      doctorData: {
        dni: formattedDNI,
        firstname: formattedName,
        lastname: formattedLastName,
        gender: this.createDoctorForm.value.doctorGender,
        city: this.createDoctorForm.value.doctorCity,
        email: this.createDoctorForm.value.doctorEmail,
        phone: this.createDoctorForm.value.doctorPhone,
        assignedDoctor: this.createDoctorForm.value.doctorDoctor,
      }
    };

    if (data.doctorData.email === '') data.doctorData.email = null;
    if (data.doctorData.city === '') data.doctorData.city = null;

    // console.log(data.doctorData);

    this.apidoctor.createDoctor(data.token!).subscribe(
      (response: any) => {
        if (response) {
          Swal.fire({
            text: 'doctor created!',
            icon: 'success',
            toast: true,
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            position: 'bottom'
          });

          setTimeout(() => {
            this.returnBack();
            window.location.reload();
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

    this.apidoctor.getDoctors(token).subscribe((data: any) => {
      if (data) {
        this.doctors = data;
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
