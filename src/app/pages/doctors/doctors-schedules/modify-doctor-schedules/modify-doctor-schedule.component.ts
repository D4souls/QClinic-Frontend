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
      id: idToFind
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
    this.router.navigate(['/doctors/schedules']);
  }

  checkTimesDiferences(startTime: string, endTime: string) {
    const start = new Date(`2004-10-11T${startTime}`);
    const end = new Date(`2004-10-11T${endTime}`);

    const diffMs = end.getTime() - start.getTime();

    const diffH = diffMs / (1000 * 60 * 60);

    return diffH == 8 ? true : false;
  }

  formatScheduleHours(time: string){
    const splitHours = time.split(':');

    const hours = parseInt(splitHours[0], 10);
    const minutes = parseInt(splitHours[1], 10);

    var now = new Date();
    now.setHours(hours);
    now.setMinutes(minutes);
    now.setSeconds(0);

    const hoursStr = now.getHours().toString().padStart(2, '0');
    const minutesStr = now.getMinutes().toString().padStart(2, '0');

    const res = `${hoursStr}:${minutesStr}:00`;

    console.log(res);
    return res;

  }

  saveChanges(): void {

    // Format scheduleStart
    const formattedScheduleStart = this.formatScheduleHours(this.modifyScheduleForm.value.scheduleStart!);

    // Format scheduleEnd
    const formattedScheduleEnd = this.formatScheduleHours(this.modifyScheduleForm.value.scheduleEnd!);
    
    const data = {
      token: localStorage.getItem('token'),
      doctorScheduleData: {
        Id: this.modifyScheduleForm.value.scheduleId,
        Name: this.modifyScheduleForm.value.scheduleName,
        ScheduleStart: formattedScheduleStart,
        ScheduleEnd: formattedScheduleEnd
      }
    }
    
    // console.log(data.doctorScheduleData);

    const checkdiference = this.checkTimesDiferences(this.modifyScheduleForm.value.scheduleStart!, this.modifyScheduleForm.value.scheduleEnd!);


    if (checkdiference){

      Swal.fire({
        title: 'Do you want to save changes?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes!',
      }).then((result) => {
        if (result.isConfirmed) {
          this.apiService.modifyDoctorSchedule(data).subscribe(
            (data: any) => {
              console.log(data);
  
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
                  this.router.navigate(['/doctors/schedules']);
                }, 3000);   
                
              } else {
                Swal.fire({
                  title: 'Error',
                  text: 'Error saving schedule. Please try again.',
                  icon: 'error',
                });
              }
            },
            (error) => {
              console.error('Error saving schedule:', error);
  
              Swal.fire({
                title: 'Error',
                text: 'Error saving schedule. Please try again.',
                icon: 'error',
              });
            }
          );
        }
      });
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
          id: this.modifyScheduleForm.value.scheduleId
        }

        this.apiService.deleteDoctorSchedule(data).subscribe(
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
                this.router.navigate(['/doctors/schedules']);
              }, 3000);    
              
            } else {
              Swal.fire({
                title: 'Error',
                text: 'Error deleting schedule. Please try again.',
                icon: 'error',
              });
            }
          },
          (error) => {
            console.error('Error deleting schedule:', error);

            Swal.fire({
              title: 'Error',
              text: 'Error deleting schedule. Please try again.',
              icon: 'error',
            });
          }
        );
      }
    });
  }
}
