import { Component, Input, OnInit, signal } from '@angular/core';
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
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-doctor',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create-doctor.component.html',
  styleUrl: './create-doctor.component.css',
})
export class CreateDoctorComponent implements OnInit {
  
  token: string = localStorage.getItem('token')!;

  // To upload avatar functions
  avatar = signal<any>(null);
  previewAvatar: any;

  actualStatus = signal<boolean>(false);

  constructor(
    private router: Router,
    private apidoctor: ApiService,
    private formatForm: FormatFormsInputsService
  ) {}

  ngOnInit(): void {
    this.getDoctorsType();
    this.getDoctorsSchedule();
    this.countDoctorsTypes();
    this.countDoctorsSchedule();
  }

  onSubmit(event: Event): void {
    event.preventDefault();
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
    doctorEmail: new FormControl('', Validators.email),
    doctorCity: new FormControl('', Validators.nullValidator),
    doctorType: new FormControl('', Validators.required),
    doctorSchedule: new FormControl('', Validators.required),
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
        isActive: true,
        doctorType: this.createDoctorForm.value.doctorType,
        doctorSchedule: this.createDoctorForm.value.doctorSchedule
      }
    };

    if (data.doctorData.email === '') data.doctorData.email = null;
    if (data.doctorData.city === '') data.doctorData.city = null;

    // console.log(data.doctorData);

    this.apidoctor.createDoctor(data).subscribe(
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

          this.uploadFile(this.avatar());
          
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

        const renamedFile = new File([file], `${this.createDoctorForm.value.doctorDNI}.jpg`, { type: file.type });

        
        const reader = new FileReader();
        reader.onload = (e: any) => {
            this.previewAvatar = e.target.result;
        };
        reader.readAsDataURL(renamedFile);

        const newAvatar = document.getElementById('newAvatar');
        const oldAvatar = document.getElementById('oldAvatar');

        newAvatar!.style.display = 'block';
        oldAvatar!.style.display = 'none';

        this.avatar.set(renamedFile);

        event.target.value = this.avatar().name;
    }
  }

  uploadFile(file: File): void {
    const formData = new FormData();
    formData.append('file', file);

    this.apidoctor.uploadDoctorAvatar({img: formData, token: this.token}).subscribe((uploadRes: any) => {
      
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
  
  // SEARCH DOCTOR TYPE
  filteredDoctorType: any = [];
  offsetDoctorType: number = 0;
  limitDoctorType: number = 11;
  maxDoctorsType: number = 0;
  maxPagesDoctorsType: number = 0;
  currentPageDoctorType: number = 1;

  filterDoctorType: any = undefined;

  idSelectedDoctorType = signal<any>("");

  countDoctorsTypes() {
    const token = localStorage.getItem('token')!;

    this.apidoctor.countDoctors(token).subscribe((countRes: any) => {
      // console.log(countRes)
      this.maxPagesDoctorsType = countRes;
    });

  }

  nextPageDoctorType(): void{
    const currentOffset = this.offsetDoctorType + this.limitDoctorType;
    this.offsetDoctorType = currentOffset;
    this.currentPageDoctorType = ++this.currentPageDoctorType;
    this.getDoctorsType();
    this.countDoctorsTypes();
  }

  previousPageDoctorType(): void{
    const currentOffset = this.offsetDoctorType - this.limitDoctorType;
    this.offsetDoctorType = currentOffset;
    this.currentPageDoctorType = --this.currentPageDoctorType;
    this.getDoctorsType();
  }

  totalPagesDoctorsType(): number {
    this.maxPagesDoctorsType = Math.ceil(this.maxDoctorsType / this.limitDoctorType);
    return this.maxPagesDoctorsType;
  }

  generatePageDoctorTypeNumbers(): number[] {
    const pagesArray = [];
    const totalPages = this.totalPagesDoctorsType();
    if (totalPages < 1) pagesArray.push(1);
    
    for (let i = 1; i <= totalPages; i++) {
      pagesArray.push(i);
    }
    return pagesArray;
  }

  goToPageDoctorType(page: number){
    this.offsetDoctorType = ( page - 1 ) * this.limitDoctorType;
    this.currentPageDoctorType = page;
    this.getDoctorsType();
  }

  getDoctorsType(): void {

    const data = {
      limit: this.limitDoctorType, 
      offset: this.offsetDoctorType, 
      token: this.token,
      textFilter: this.filterDoctorType,
    }

    try {

      this.apidoctor.getDoctorsType(data).subscribe((data: any) => {

        if (data.status != 200) {

          console.log(data);

          Swal.fire({
            text: "We can't find any specialization",
            icon: 'info',
            toast: true,
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            position: 'bottom'
          });
          
        } else {
          this.filteredDoctorType = data.res;
        }
      });
    } catch (error) {
      console.log('Error while getting users: ',error);
    }

  }

  redirectToDoctorType(id: string): void {
    this.returnBack();
    this.router.navigate(['/doctors/specializations/modify-specialization', id]);
  }

  filterDoctorsType(dataToSearch: string): void {

    if (dataToSearch === "") {
      
      this.filterDoctorType = undefined;
      
      this.getDoctorsType();
      this.countDoctorsTypes();
      this.generatePageDoctorTypeNumbers();
      
    } else {
  
      this.filterDoctorType = dataToSearch;
  
      this.getDoctorsType();
      this.countDoctorsTypes();
      this.generatePageDoctorTypeNumbers();
  
    }
    
  }

  unMarkDoctorType(){
    this.idSelectedDoctorType.set(null);
    this.createDoctorForm.get('doctorType')?.setValue(null);
  }

  markDoctorType(id: string){
    this.idSelectedDoctorType.set(id);
    this.createDoctorForm.get('doctorType')?.setValue(id);
  }

  
  // DOCTOR SCHEDULE
  filteredDoctorSchedule: any = [];
  offsetDoctorSchedule: number = 0;
  limitDoctorSchedule: number = 11;
  maxDoctorsSchedule: number = 0;
  maxPagesDoctorsSchedule: number = 0;
  currentPageDoctorSchedule: number = 1;

  filterDoctorSchedule: any = undefined;

  idSelectedDoctorSchedule = signal<any>("");

  countDoctorsSchedule() {
    const token = localStorage.getItem('token')!;

    this.apidoctor.countDoctors(token).subscribe((countRes: any) => {
      // console.log(countRes)
      this.maxPagesDoctorsSchedule = countRes;
    });

  }

  nextPageDoctorSchedule(): void{
    const currentOffset = this.offsetDoctorSchedule + this.limitDoctorSchedule;
    this.offsetDoctorSchedule = currentOffset;
    this.currentPageDoctorSchedule = ++this.currentPageDoctorSchedule;
    this.getDoctorsType();
    this.countDoctorsTypes();
  }

  previousPageDoctorSchedule(): void{
    const currentOffset = this.offsetDoctorSchedule - this.limitDoctorSchedule;
    this.offsetDoctorSchedule = currentOffset;
    this.currentPageDoctorSchedule = --this.currentPageDoctorSchedule;
    this.getDoctorsType();
  }

  totalPagesDoctorsSchedule(): number {
    this.maxPagesDoctorsType = Math.ceil(this.maxDoctorsType / this.limitDoctorSchedule);
    return this.maxPagesDoctorsType;
  }

  generatePageDoctorScheduleNumbers(): number[] {
    const pagesArray = [];
    const totalPages = this.totalPagesDoctorsType();
    if (totalPages < 1) pagesArray.push(1);
    
    for (let i = 1; i <= totalPages; i++) {
      pagesArray.push(i);
    }
    return pagesArray;
  }

  goToPageDoctorSchedule(page: number){
    this.offsetDoctorSchedule = ( page - 1 ) * this.limitDoctorSchedule;
    this.currentPageDoctorSchedule = page;
    this.getDoctorsType();
  }

  getDoctorsSchedule(): void {

    const data = {
      limit: this.limitDoctorSchedule, 
      offset: this.offsetDoctorSchedule, 
      token: this.token,
      textFilter: this.filterDoctorSchedule,
    }

    try {

      this.apidoctor.getDoctorsSchedule(data).subscribe((data: any) => {

        if (data.status != 200) {

          console.log(data);

          Swal.fire({
            text: "We can't find any schedule",
            icon: 'info',
            toast: true,
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            position: 'bottom'
          });
          
        } else {
          this.filteredDoctorSchedule = data.res;
        }
      });
    } catch (error) {
      console.log('Error while getting users: ',error);
    }

  }

  redirectToDoctorSchedule(id: string): void {
    this.returnBack();
    this.router.navigate(['/doctors/schedules/modify-schedule', id]);
  }

  filterDoctorsSchedule(dataToSearch: any): void {

    // console.log(dataToSearch)

    if (dataToSearch === "") {
      
      this.filterDoctorSchedule = undefined;
      
      this.getDoctorsSchedule();
      this.countDoctorsSchedule();
      this.generatePageDoctorScheduleNumbers();
      
    } else {
  
      this.filterDoctorSchedule = dataToSearch;
  
      this.getDoctorsSchedule();
      this.countDoctorsSchedule();
      this.generatePageDoctorScheduleNumbers();
  
    }
    
  }

  unMarkDoctorSchedule(){
    this.idSelectedDoctorSchedule.set(null);
    this.createDoctorForm.get('doctorSchedule')?.setValue(null);
  }

  markDoctorSchedule(id: string){
    this.idSelectedDoctorSchedule.set(id);
    this.createDoctorForm.get('doctorSchedule')?.setValue(id);
  }

}
