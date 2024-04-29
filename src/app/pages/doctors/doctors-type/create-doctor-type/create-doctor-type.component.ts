import { Component, Input, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { Router } from '@angular/router';

import Swal from 'sweetalert2';
import { ApiService } from '../../../../core/services/api.service';

import { phoneNumberValidator } from '../../../../shared/validators/phone.validator';
import { dniValidator } from '../../../../shared/validators/dni.validator';
import { textValidator } from '../../../../shared/validators/text.validator';

import { FormatFormsInputsService } from '../../../../shared/services/format-forms-inputs.service';

import { InstanceOptions, Modal, ModalOptions } from 'flowbite';

@Component({
  selector: 'app-create-doctor-type',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './create-doctor-type.component.html',
  styleUrl: './create-doctor-type.component.css',
})
export class CreateDoctorTypeComponent implements OnInit {
  constructor(
    private router: Router,
    private apidoctor: ApiService,
    private formatForm: FormatFormsInputsService
  ) {}

  ngOnInit(): void {
    this.getDoctors();
  }

  @Input() modalId?: string;

  createDoctorTypeForm = new FormGroup({
    typeName: new FormControl('', [Validators.required]),
    typeDescription: new FormControl('', [Validators.required, textValidator]),
    typeSalary: new FormControl('', [Validators.required])
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

  createDoctorType() {

    const data = {
      token: localStorage.getItem('token'),
      doctorTypeData: {
        name: this.createDoctorTypeForm.value.typeName,
        description: this.createDoctorTypeForm.value.typeDescription,
        salary: this.createDoctorTypeForm.value.typeSalary,
      }
    };

    // console.log(data.doctorData);

    this.apidoctor.createDoctorType(data).subscribe(
      (response: any) => {
        if (response) {
          Swal.fire({
            text: 'Specialization created!',
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
