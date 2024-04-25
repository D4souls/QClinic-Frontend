import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../../core/services/api.service';
import Swal from 'sweetalert2';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { phoneNumberValidator } from '../../../../shared/validators/phone.validator';
import { dniValidator } from '../../../../shared/validators/dni.validator';

import { FormatFormsInputsService } from '../../../../shared/services/format-forms-inputs.service';
import { textValidator } from '../../../../shared/validators/text.validator';
import { dateTimeValidator } from '../../../../shared/validators/dateTime.validator';

@Component({
  selector: 'app-modify-doctor-schedule',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './modify-doctor-schedule.component.html',
  styleUrl: './modify-doctor-schedule.component.css',
})
export class ModifyDoctorScheduleComponent implements OnInit {

  datadoctor: any = [];

  idSchedule: string = '';

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

      this.idSchedule = req['idSchedule'];

      this.getDataSchedule(this.idSchedule);
    })
  }

  modifyScheduleForm = new FormGroup({
    scheduleId: new FormControl('', [ Validators.required ]),
    scheduleName: new FormControl('', [ Validators.required, textValidator ]),
    scheduleStart: new FormControl('', [ Validators.required, dateTimeValidator ]),
    scheduleEnd: new FormControl('', [ Validators.required, dateTimeValidator ]),
  });

  getDataSchedule(idToFind: string){

    let doctorScheduleData = {
      token: localStorage.getItem('token'),
      dni: idToFind
    }
  
    this.apiService.getDoctorScheduleById(doctorScheduleData).subscribe((doctorScheduleResponse: any) => {
      if(doctorScheduleResponse){
        this.dataDoctor = doctorScheduleResponse;
  
        this.modifyScheduleForm.patchValue({
          scheduleId: doctorScheduleResponse.id,
          scheduleName: doctorScheduleResponse.name,
          scheduleStart: doctorScheduleResponse.scheduleStart,
          scheduleEnd: doctorScheduleResponse.scheduleEnd
        });
        
      }
    });
  }


  returnBack(){
    this.router.navigate(['/schedules']);
  }

  saveChanges(): void {

    // FORMAT DATA doctor
    // const formattedName = this.formatForm.formatTextToUpper(this.modifyScheduleForm.value.doctorName!);
    // const formattedLastName = this.formatForm.formatTextToUpper(this.modifyScheduleForm.value.doctorLastname!);
    // const formattedCity = this.modifyScheduleForm.value.doctorCity ? this.formatForm.formatTextToUpper(this.modifyScheduleForm.value.doctorCity!) : this.modifyScheduleForm.value.doctorCity;


    const data = {
      token: localStorage.getItem('token'),
      doctorScheduleData: {
        id: this.modifyScheduleForm.value.scheduleId,
        name: this.modifyScheduleForm.value.scheduleName,
        schaduleStart: this.modifyScheduleForm.value.scheduleStart + ':00',
        schaduleEnd: this.modifyScheduleForm.value.scheduleEnd + ':00'
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
          dni: this.modifyScheduleForm.value.scheduleId
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
