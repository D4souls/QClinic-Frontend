import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../../core/services/api.service';
import Swal from 'sweetalert2';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { phoneNumberValidator } from '../../../../shared/validators/phone.validator';
import { dniValidator } from '../../../../shared/validators/dni.validator';

import { FormatFormsInputsService } from '../../../../shared/services/format-forms-inputs.service';
import { textValidator } from '../../../../shared/validators/text.validator';
import { InstanceOptions, Modal, ModalOptions } from 'flowbite';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modify-doctor',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './modify-doctor.component.html',
  styleUrl: './modify-doctor.component.css',
})
export class ModifyDoctorComponent implements OnInit {

  datadoctor: any = [];

  dnidoctor: string = '';

  doctors: any = [];

  dataDoctor: any = [];

  appointmentsdoctor: any = [];

  token = localStorage.getItem('token');

  previewAvatar: any;

  actualStatus = signal<boolean>(false);

  assignedPatients = signal<any[]>([]);

  offset: number = 0;
  limit: number = 4;
  maxAppointments: number = 0;
  maxPages: number = 0;
  currentPage: number = 1;
  filterActive: boolean = false;
  filterText: any = undefined;

  constructor(
    private router: Router,
    private apiService: ApiService,
    private activatedRouter: ActivatedRoute,
    private formatForm: FormatFormsInputsService,
  ) {}

  ngOnInit(): void {

    this.activatedRouter.params.subscribe(req => {

      this.dnidoctor = req['dniDoctor'];

      this.getDataDoctor(this.dnidoctor);
      this.getDoctorsType();
      this.getDoctorSchedule();
      this.getPatients();
      this.countAssignedPatient();
      this.assignedPatients();
      this.modifydoctor(this.dnidoctor);
    })
  }

  nextPage(): void{
    const currentOffset = this.offset + this.limit;
    this.offset = currentOffset;
    this.currentPage = ++this.currentPage;
    if (!this.filterActive) {
      this.getPatients();
    } else {

      if(this.currentPage == 1){
        this.assignedPatients().slice(0, this.limit + 1);
      } else {

        const startIndex = (this.currentPage - 1) * this.limit;
        const endIndex = startIndex + this.limit;

        this.assignedPatients().slice(startIndex, endIndex);
      }


    }
  }

  previousPage(): void{
    const currentOffset = this.offset - this.limit;
    this.offset = currentOffset;
    this.currentPage = --this.currentPage;
    if (!this.filterActive) this.getPatients();
  }

  totalPages(): number {
    this.maxPages = Math.ceil(this.maxAppointments / this.limit);
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
    
    if (!this.filterActive){
      this.getPatients();
    } else {

    }
    
  }

  modifyDoctorForm = new FormGroup({
    doctorDNI: new FormControl('', [
      Validators.required,
      dniValidator
    ]),
    doctorName: new FormControl('', [
      Validators.required,
      textValidator
    ]),
    doctorLastname: new FormControl('', [
      Validators.required, textValidator
    ]),
    doctorPhone: new FormControl('', [
      Validators.required,
      phoneNumberValidator
    ]),
    doctorGender: new FormControl('', Validators.required),
    doctorEmail: new FormControl('', Validators.email),
    doctorCity: new FormControl('', [Validators.nullValidator, textValidator]),
    doctorType: new FormControl('', Validators.required),
    doctorSchedule: new FormControl('', Validators.required),
  });

  getDataDoctor(dniToFind: string){

    let doctorData = {
      token: localStorage.getItem('token'),
      dni: dniToFind
    }
  
    this.apiService.getDoctorByDNI(doctorData).subscribe((doctorResponse: any) => {
      if(doctorResponse){
        this.dataDoctor = doctorResponse;
  
        this.modifyDoctorForm.patchValue({
          doctorDNI: this.dataDoctor.dni,
          doctorName: this.dataDoctor.firstname,
          doctorLastname: this.dataDoctor.lastname,
          doctorCity: this.dataDoctor.city,
          doctorPhone: this.dataDoctor.phone,
          doctorEmail: this.dataDoctor.email,
          doctorGender: this.dataDoctor.gender,
        });

        this.actualStatus.set(this.dataDoctor.isActive);

        if (this.dataDoctor.doctorType != null){
          this.modifyDoctorForm.patchValue({
            doctorType: this.dataDoctor.doctorType
          });
        }

        if (this.dataDoctor.doctorSchedule != null){
          this.modifyDoctorForm.patchValue({
            doctorSchedule: this.dataDoctor.doctorSchedule
          });
        }

        // console.log(this.modifyDoctorForm.value.doctorSchedule);
        
        if (doctorResponse.doctorType != null){
          let doctorTypeData = {
            id: doctorResponse.doctorType,
            token: this.token
          }
    
          this.apiService.getDoctorTypeById(doctorTypeData).subscribe((doctorTypeResponse: any) => {
            if(doctorTypeResponse) {
              // console.log(doctorResponse);
    
              const doctorTypeInfo = {
                doctorTypeName: doctorTypeResponse.name,
              };
    
              this.dataDoctor = doctorTypeInfo;
              // console.log(this.dataDoctor);
            }
          });

          
        }

        if (doctorResponse.doctorSchedule != null){
          let doctorScheduleData = {
            id: doctorResponse.doctorSchedule,
            token: this.token
          }
  
          this.apiService.getDoctorScheduleById(doctorScheduleData).subscribe((doctorScheduleResponse: any) => {
            if(doctorScheduleResponse) {
              // console.log(doctorResponse);
    
              const doctorScheduleInfo = {
                doctorScheduleName: doctorScheduleResponse.name,
                doctorScheduleStart: doctorScheduleResponse.scheduleStart,
                doctorScheduleEnd: doctorScheduleResponse.scheduleEnd,
              };
    
              this.dataDoctor = doctorScheduleInfo;
              // console.log(this.dataDoctor);
            }
          });
        }

        if (doctorResponse.doctorTye != null){
          let dataDoctorType = {
            id: doctorResponse.doctorTye,
            token: this.token
          }
  
          this.apiService.getDoctorTypeById(dataDoctorType).subscribe((doctorTypeResponse: any) => {
            if(doctorTypeResponse) {
              // console.log(doctorResponse);
    
              const doctorTypeInfo = {
                doctorScheduleName: doctorTypeResponse.name,
                doctorScheduleStart: doctorTypeResponse.description,
              };
    
              this.dataDoctor = doctorTypeInfo;
              // console.log(this.dataDoctor);
            }
          });
        }

  
      }
    });
  }

  getPatients(): void{

    const data = {
      token: this.token,
      dni: this.dnidoctor,
      offset: this.offset,
      limit: this.limit,
      filterText: this.filterText
    }

    this.apiService.getPatientsByDniDoctor(data).subscribe((patientsByDoctorDniRes: any) => {

      if (patientsByDoctorDniRes.status != 200){
        Swal.fire({
          text: "We didn't found any patien",
          icon: 'error',
          toast: true,
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          position: 'bottom'
      });
      } else {
        this.assignedPatients.set(patientsByDoctorDniRes.res);
      }

    });

  }

  doctorType: any = [];

  getDoctorsType() {

    const token = localStorage.getItem('token')!;

    this.apiService.getDoctorsType(token).subscribe((data: any) => {
      if (data) {
        this.doctorType = data;
        // console.log(this.doctors);
      } else {
        console.log(data);
      }
    });
  }

  doctorSchedule: any = [];

  getDoctorSchedule() {

    const token = localStorage.getItem('token')!;

    this.apiService.getDoctorsSchedule(token).subscribe((data: any) => {
      if (data) {
        this.doctorSchedule = data;
        // console.log(this.doctors);
      } else {
        console.log(data);
      }
    });
  }


  returnBack(){
    const $targetEl = document.getElementById('modal-edit-doctor');
    // Modal Options
    const options: ModalOptions = {
      placement: 'bottom-right',
      backdrop: 'dynamic',
      backdropClasses: 'bg-gray-900/50 fixed inset-0 z-40',
      closable: false,
    };
    
    // Modal instance options
    const instanceOptions: InstanceOptions = {
      id: 'modal-edit-doctor',
      override: true
    };

    const modal: Modal = new Modal($targetEl, options, instanceOptions);

    
    modal.hide();

    this.router.navigate(["/doctors"]);
  }

  redirectToPatient(dni: string){
    this.returnBack();
    this.router.navigate(["/patients/modify-patient", dni]);
  }

  modifydoctor(dni: string): void {

    const appModify = document.getElementById('app-modify-doctor');
    appModify?.setAttribute('dni', dni);

    const $targetEl = document.getElementById('modal-edit-doctor');

    // Modal Options
    const options: ModalOptions = {
      placement: 'bottom-right',
      backdrop: 'dynamic',
      backdropClasses: 'bg-gray-900/50 fixed inset-0 z-40',
      closable: false,
    };
    
    // Modal instance options
    const instanceOptions: InstanceOptions = {
      id: 'modal-edit-doctor',
      override: true,
    };

    const modal: Modal = new Modal($targetEl, options, instanceOptions);

    
    modal.show();
  }
  
  onSubmit(event: Event): void {
    event.preventDefault();
  }

  filterPatients(dataToSearch: string): void {

    if (dataToSearch === "") {
      
      this.filterText = undefined;
      
      this.getPatients();
      this.countAssignedPatient();
      this.generatePageNumbers();
      
    } else {
  
      this.filterText = dataToSearch;
  
      this.getPatients();
      this.countAssignedPatient();
      this.generatePageNumbers();
  
    }
  
  }

  countAssignedPatient(): void {
    this.apiService.countPatientsByDniDoctor({token: this.token, dni: this.dnidoctor, textFilter: this.filterText}).subscribe((countRes: any) => {
      // console.log(countRes);
      this.maxAppointments = countRes.res;
    });
  }

  saveChanges(): void {

    // FORMAT DATA doctor
    const formattedName = this.formatForm.formatTextToUpper(this.modifyDoctorForm.value.doctorName!);
    const formattedLastName = this.formatForm.formatTextToUpper(this.modifyDoctorForm.value.doctorLastname!);
    const formattedCity = this.modifyDoctorForm.value.doctorCity ? this.formatForm.formatTextToUpper(this.modifyDoctorForm.value.doctorCity!) : this.modifyDoctorForm.value.doctorCity;


    const data = {
      token: localStorage.getItem('token'),
      doctorData: {
        dni: this.modifyDoctorForm.value.doctorDNI,
        firstname: formattedName,
        lastname: formattedLastName,
        gender: this.modifyDoctorForm.value.doctorGender,
        city: formattedCity,
        email: this.modifyDoctorForm.value.doctorEmail,
        phone: this.modifyDoctorForm.value.doctorPhone,
        doctorType: this.modifyDoctorForm.value.doctorType,
        doctorSchedule: this.modifyDoctorForm.value.doctorSchedule
      }
    }

    // console.log(data.doctorData);

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
          dni: this.modifyDoctorForm.value.doctorDNI!
        }

        console.log(data);
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

  filePreview(e: any) {
    if (e.target.files[0] != null) {
      var reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewAvatar = e.target.result;
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  }

  onFileSelected(event: any): void {
    const files: FileList | null = event.target.files;
    
    if (files && files.length > 0) {
        const file = files[0];
        const fileExtension = file.name.split('.').pop()?.toLowerCase();

        if (fileExtension !== 'jpg') {
            Swal.fire({
                text: 'Only jpg images can be uploaded',
                icon: 'error',
                toast: true,
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                position: 'bottom'
            });

            event.target.value = '';
            return;
        }

        const renamedFile = new File([file], `${this.dnidoctor}.jpg`, { type: file.type });

        
        const reader = new FileReader();
        reader.onload = (e: any) => {
            this.previewAvatar = e.target.result;
        };
        reader.readAsDataURL(renamedFile);

        const newAvatar = document.getElementById('newAvatar');
        const oldAvatar = document.getElementById('oldAvatar');

        newAvatar!.style.display = 'block';
        oldAvatar!.style.display = 'none';

        this.uploadFile(renamedFile);

        event.target.value = '';
    }
}

  uploadFile(file: File): void {
    const formData = new FormData();
    formData.append('file', file);

    this.apiService.uploadImg({img: formData, token: this.token}).subscribe((uploadRes: any) => {
      
      if (uploadRes.status != 200){
        Swal.fire({
          text: 'Error uploading avatar',
          icon: 'error',
          toast: true,
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          position: 'bottom'
        });

      }

      Swal.fire({
        text: 'Avatar uploaded',
        icon: 'success',
        toast: true,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        position: 'bottom'
      });


    })
  }

  changeStatusDoctor(): void {

    const data = {dni: this.dnidoctor , token: this.token};

    this.apiService.changeStatusDoctor(data).subscribe((changeSatusRes: any) => {

    // console.log(changeSatusRes);

    if (changeSatusRes.status == 200){

      this.getDataDoctor(this.dnidoctor);

      Swal.fire({
        icon: 'success',
        text: "Patient status changed!",
        toast: true,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        position: 'bottom'
      });

    } else {
      Swal.fire({
        icon: 'error',
        text: changeSatusRes.msn,
        toast: true,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        position: 'bottom'
      });
    }

    }, err => {
      Swal.fire({
        icon: 'error',
        text: err.message,
        toast: true,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        position: 'bottom'
      });
    });

  }

}
