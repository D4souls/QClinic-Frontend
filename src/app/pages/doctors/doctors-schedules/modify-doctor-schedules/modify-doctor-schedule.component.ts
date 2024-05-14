import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../../core/services/api.service';
import Swal from 'sweetalert2';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { FormatFormsInputsService } from '../../../../shared/services/format-forms-inputs.service';
import { textValidator } from '../../../../shared/validators/text.validator';
import { dateTimeValidator } from '../../../../shared/validators/dateTime.validator';

import { InstanceOptions, Modal, ModalOptions } from 'flowbite';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modify-doctor-schedule',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './modify-doctor-schedule.component.html',
  styleUrl: './modify-doctor-schedule.component.css',
})
export class ModifyDoctorScheduleComponent implements OnInit {

  datadoctor: any = [];
  doctorsSchedules: any = [];

  idSchedule: string = '';

  doctors: any = [];

  dataDoctor: any = [];

  appointmentsdoctor: any = [];

  token = localStorage.getItem('token');

  offset: number = 0;
  limit: number = 11;
  maxSchedules: number = 0;
  maxPages: number = 0;
  currentPage: number = 1;

  filter: any = undefined;

  constructor(
    private router: Router,
    private apiService: ApiService,
    private activatedRouter: ActivatedRoute,
    private formatForm: FormatFormsInputsService,
  ) {}

  ngOnInit(): void {

    this.activatedRouter.params.subscribe(req => {

      this.idSchedule = req['idSchedule'];

      this.getDataSchedule();
      this.getDoctorsSchedule();
      this.countDoctorsSchedule();
      this.showModal();
    })
  }

  onSubmit(event: Event): void {
    event.preventDefault();
  }

  modifyScheduleForm = new FormGroup({
    scheduleId: new FormControl('', [ Validators.required ]),
    scheduleName: new FormControl('', [ Validators.required, textValidator ]),
    scheduleStart: new FormControl('', [ Validators.required, dateTimeValidator ]),
    scheduleEnd: new FormControl('', [ Validators.required, dateTimeValidator ]),
  });

  getDataSchedule(){

    let doctorScheduleData = {
      token: localStorage.getItem('token'),
      id: this.idSchedule
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

    const $targetEl = document.getElementById('modal-edit-schedule');
    // Modal Options
    const options: ModalOptions = {
      placement: 'bottom-right',
      backdrop: 'dynamic',
      backdropClasses: 'bg-gray-900/50 fixed inset-0 z-40',
      closable: false,
    };
    
    // Modal instance options
    const instanceOptions: InstanceOptions = {
      id: 'modal-edit-schedule',
      override: true
    };

    const modal: Modal = new Modal($targetEl, options, instanceOptions);

    
    modal.hide();

    this.router.navigate(['/doctors/schedules']);
  }

  showModal(){

    const $targetEl = document.getElementById('modal-edit-schedule');
    // Modal Options
    const options: ModalOptions = {
      placement: 'bottom-right',
      backdrop: 'dynamic',
      backdropClasses: 'bg-gray-900/50 fixed inset-0 z-40',
      closable: false,
    };
    
    // Modal instance options
    const instanceOptions: InstanceOptions = {
      id: 'modal-edit-schedule',
      override: true
    };

    const modal: Modal = new Modal($targetEl, options, instanceOptions);

    
    modal.show();
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
                  this.returnBack();
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
                this.returnBack();
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

  getDoctorsSchedule(){

    const data = {
      token: localStorage.getItem('token'),
      id: this.idSchedule,
      limit: this.limit,
      offset: this.offset,
      textFilter: this.filter
    }
  
    this.apiService.getDoctorsBySchedule(data).subscribe((doctorsScheduleRes: any) => {
      if(doctorsScheduleRes.status == 200){
        this.doctorsSchedules = doctorsScheduleRes.res;
      } else {

        Swal.fire({
          text: "We can't find doctors",
          icon: 'error',
          toast: true,
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          position: 'bottom'
        });

      }
    });
  }

  countDoctorsSchedule() {
    const data = {
      token: localStorage.getItem('token'),
      id: this.idSchedule,
      textFilter: this.filter
    }

    this.apiService.countDoctorsBySchedule(data).subscribe((countDoctorsRes: any) => {
      this.maxSchedules = countDoctorsRes.res;
    });

  }

  // FUNCTIONS TO PAGINATION

  filterSchedules(dataToSearch: string): void {
    if (dataToSearch === "") {
      
      this.filter = undefined;
      
      this.getDoctorsSchedule();
      this.countDoctorsSchedule();
      this.generatePageNumbers();
      
    } else {
  
      this.filter = dataToSearch;
  
      this.getDoctorsSchedule();
      this.countDoctorsSchedule();
      this.generatePageNumbers();
  
    }
  }

  nextPage(): void{
    const currentOffset = this.offset + this.limit;
    this.offset = currentOffset;
    this.currentPage = ++this.currentPage;
    this.getDoctorsSchedule();
  }

  previousPage(): void{
    const currentOffset = this.offset - this.limit;
    this.offset = currentOffset;
    this.currentPage = --this.currentPage;
    this.getDoctorsSchedule();
  }

  totalPages(): number {
    this.maxPages = Math.ceil(this.maxSchedules / this.limit);
    return this.maxPages;
  }

  generatePageNumbers(): number[] {
    const pagesArray = [];
    const totalPages = this.totalPages();
    if (totalPages < 1) pagesArray.push(1);
    for (let i = 1; i <= totalPages; i++) {
      pagesArray.push(i);
    }

    return pagesArray;
  }

  goToPage(page: number){
    this.offset = ( page - 1 ) * this.limit;
    this.currentPage = page;
    this.getDataSchedule();
  }

  // END FUNCTIONS TO PAGINATION

  redirectToDoctor(dni: string){
    this.returnBack();
    this.router.navigate(["/doctors/modify-doctor", dni]);
  }
}
