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
import { dateTimeValidator } from '../../../../shared/validators/dateTime.validator';
import { Time } from '@angular/common';

@Component({
  selector: 'app-create-doctor-schedule',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './create-doctor-schedules.component.html',
  styleUrl: './create-doctor-schedules.component.css',
})
export class CreateDoctorSchedulesComponent implements OnInit {
  constructor(
    private router: Router,
    private apidoctor: ApiService,
    private formatForm: FormatFormsInputsService
  ) {}

  ngOnInit(): void {}

  @Input() modalId?: string;

  createScheduleForm = new FormGroup({
    scheduleName: new FormControl('', [Validators.required, textValidator]),
    scheduleStart: new FormControl('', [
      Validators.required,
      dateTimeValidator,
    ]),
    scheduleEnd: new FormControl('', [Validators.required, dateTimeValidator]),
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

  checkTimesDiferences(startTime: string, endTime: string) {
    const start = new Date(`2004-10-11T${startTime}`);
    const end = new Date(`2004-10-11T${endTime}`);

    const diffMs = end.getTime() - start.getTime();

    const diffH = diffMs / (1000 * 60 * 60);

    return diffH == 8 ? true : false;
  }

  createDoctor() {
    // FORMAT DATA doctor
    // const formattedDNI = this.formatForm.formatDNI(
    //   this.createScheduleForm.value.doctorDNI!
    // );
    // const formattedName = this.formatForm.formatTextToUpper(
    //   this.createScheduleForm.value.doctorName!
    // );
    // const formattedLastName = this.formatForm.formatTextToUpper(
    //   this.createScheduleForm.value.doctorLastname!
    // );

    const data = {
      token: localStorage.getItem('token'),
      scheduleData: {
        name: this.createScheduleForm.value.scheduleName,
        scheduleStart: this.createScheduleForm.value.scheduleStart + ':00',
        scheduleEnd: this.createScheduleForm.value.scheduleEnd + ':00',
      },
    };

    if (
      this.checkTimesDiferences(
        data.scheduleData.scheduleStart,
        data.scheduleData.scheduleEnd
      )
    ) {
      // console.log(data.scheduleData);
      this.apidoctor.createDoctorSchedule(data).subscribe(
        (response: any) => {
          if (response) {
            Swal.fire({
              text: 'Schedule created!',
              icon: 'success',
              toast: true,
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
              position: 'bottom',
            });

            setTimeout(() => {
              window.location.reload();
              this.returnBack();
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
    } else {
      Swal.fire({
        text: 'Workers can work only 8h',
        icon: 'error',
        toast: true,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        position: 'bottom',
      });
    }
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
