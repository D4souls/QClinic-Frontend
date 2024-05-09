import { Component, Input, OnInit, signal } from '@angular/core';
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
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-patient',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create-patient.component.html',
  styleUrl: './create-patient.component.css',
})
export class CreatePatientComponent implements OnInit {
  constructor(
    private router: Router,
    private apiPatient: ApiService,
    private formatForm: FormatFormsInputsService
  ) {}

  token = localStorage.getItem('token');

  dataDoctor: any = [];
  offset: number = 0;
  limit: number = 11;
  maxDoctors: number = 0;
  maxPages: number = 0;
  currentPage: number = 1;

  filter: any = undefined;

  actualStatus = signal<boolean>(false);

  dniSelectedDoctor = signal<any>(null);

  avatar = signal<any>(null);

  previewAvatar: any;

  onSubmit(event: Event): void {
    event.preventDefault();
  }

  ngOnInit(): void {
    this.getDoctors();
    this.countDoctors();
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

        const renamedFile = new File([file], `${this.createPatientForm.value.patientDNI}.jpg`, { type: file.type });

        
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

    this.apiPatient.uploadPatientAvatar({img: formData, token: this.token}).subscribe((uploadRes: any) => {
      
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

    if (data.patientData.email === '') data.patientData.email = null;
    if (data.patientData.city === '') data.patientData.city = null;

    // console.log(data.patientData);

    this.apiPatient.createPatient(data).subscribe(
      (response: any) => {
        if (response) {

          this.uploadFile(this.avatar());

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

  getDoctors(): void {

    const data = {
      limit: this.limit, 
      offset: this.offset, 
      token: this.token,
      textFilter: this.filter,
    }

    try {

      this.apiPatient.getDoctors(data).subscribe((data: any) => {

        if (data.status != 200) {

          Swal.fire({
            text: "We can't find any doctor",
            icon: 'info',
            toast: true,
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            position: 'bottom'
          });
          
        } else {
          this.dataDoctor = data.res;
        }
      });
    } catch (error) {
      console.log('Error while getting users: ',error);
    }

  }

  countDoctors() {
    const token = localStorage.getItem('token')!;

    this.apiPatient.countDoctors(token).subscribe((countRes: any) => {
      // console.log(countRes)
      this.maxPages = countRes;
    });

  }
  filterdoctors(dataToSearch: string): void {

    if (dataToSearch === "") {
      
      this.filter = undefined;
      
      this.getDoctors();
      this.countDoctors();
      this.generatePageNumbers();
      
    } else {
  
      this.filter = dataToSearch;
  
      this.getDoctors();
      this.countDoctors();
      this.generatePageNumbers();
  
    }
    
  }

  unMarkDoctor(){
    this.dniSelectedDoctor.set(null);
    this.createPatientForm.get('patientDoctor')?.setValue(null);
  }

  markDoctor(dni: string){
    this.dniSelectedDoctor.set(dni);
    this.createPatientForm.get('patientDoctor')?.setValue(dni);
  }

  totalPages(): number {
    this.maxPages = Math.ceil(this.maxDoctors / this.limit);
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
    this.getDoctors();
  }

  nextPage(): void{
    const currentOffset = this.offset + this.limit;
    this.offset = currentOffset;
    this.currentPage = ++this.currentPage;
    this.getDoctors();
    this.countDoctors();
  }

  previousPage(): void{
    const currentOffset = this.offset - this.limit;
    this.offset = currentOffset;
    this.currentPage = --this.currentPage;
    this.getDoctors();
  }

  redirectToDoctor(dni: string): void {
    this.returnBack();
    this.router.navigate(['/doctors/modify-doctor', dni]);
  }


}
