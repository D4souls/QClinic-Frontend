import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../../core/services/api.service';
import Swal from 'sweetalert2';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { FormatFormsInputsService } from '../../../../shared/services/format-forms-inputs.service';
import { textValidator } from '../../../../shared/validators/text.validator';

import { InstanceOptions, Modal, ModalOptions } from 'flowbite';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modify-doctor-type',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './modify-doctor.component.html',
  styleUrl: './modify-doctor.component.css',
})
export class ModifyDoctorTypeComponent implements OnInit {

  dataSpecialization: any = [];

  idType: string = '';

  token = localStorage.getItem('token');

  allDoctors: any = [];

  offset: number = 0;
  limit: number = 11;
  maxDoctors: number = 0;
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

      this.idType = req['idType'];

      this.getDataDoctorType(this.idType);

      this.getDoctors();
      this.countDoctors();
      this.showModal();

    })
  }

  modifyDoctorTypeForm = new FormGroup({
    id: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required, textValidator]),
    description: new FormControl('', [Validators.required, textValidator]),
    salary: new FormControl('', [Validators.required])
  });

  getDataDoctorType(dniToFind: string){

    let doctorData = {
      token: localStorage.getItem('token'),
      id: dniToFind
    }
  
    this.apiService.getDoctorTypeById(doctorData).subscribe((doctorResponse: any) => {
      if(doctorResponse){
        this.dataSpecialization = doctorResponse;
  
        this.modifyDoctorTypeForm.patchValue({
          id: this.dataSpecialization.id,
          name: this.dataSpecialization.name,
          description: this.dataSpecialization.description,
          salary: this.dataSpecialization.salary,
        }); 
      }
    });
  }


  returnBack(){
    
    const $targetEl = document.getElementById('modal-edit-specializations');
    // Modal Options
    const options: ModalOptions = {
      placement: 'bottom-right',
      backdrop: 'dynamic',
      backdropClasses: 'bg-gray-900/50 fixed inset-0 z-40',
      closable: false,
    };
    
    // Modal instance options
    const instanceOptions: InstanceOptions = {
      id: 'modal-edit-specializations',
      override: true
    };

    const modal: Modal = new Modal($targetEl, options, instanceOptions);

    
    modal.hide();

    this.router.navigate(['/doctors/specializations']);
  }

  showModal(){
    
    const $targetEl = document.getElementById('modal-edit-specializations');
    // Modal Options
    const options: ModalOptions = {
      placement: 'bottom-right',
      backdrop: 'dynamic',
      backdropClasses: 'bg-gray-900/50 fixed inset-0 z-40',
      closable: false,
    };
    
    // Modal instance options
    const instanceOptions: InstanceOptions = {
      id: 'modal-edit-specializations',
      override: true
    };

    const modal: Modal = new Modal($targetEl, options, instanceOptions);

    
    modal.show();
  }

  saveChanges(): void {

    const data = {
      token: localStorage.getItem('token'),
      doctorTypeData: {
        id: this.modifyDoctorTypeForm.value.id,
        name: this.modifyDoctorTypeForm.value.name,
        description: this.modifyDoctorTypeForm.value.description,
        salary: this.modifyDoctorTypeForm.value.salary,
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
        this.apiService.modifyDoctorType(data).subscribe(
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
              }, 3000);   
              
            } else {
              Swal.fire({
                title: 'Error',
                text: 'Error deleting specialization. Please try again.',
                icon: 'error',
              });
            }
          },
          (error: any) => {
            console.error('Error deleting specialization:', error);

            Swal.fire({
              title: 'Error',
              text: 'Error deleting specialization. Please try again.',
              icon: 'error',
            });
          }
        );
      }
    });
  }

  deleteDoctorType(): void {
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
          id: this.modifyDoctorTypeForm.value.id
        }

        this.apiService.deleteDoctorType(data).subscribe(
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
              }, 3000);    
              
            } else {
              Swal.fire({
                title: 'Error',
                text: 'Error deleting specialization. Please try again.',
                icon: 'error',
              });
            }
          },
          (error: any) => {
            console.error('Error deleting specialization:', error);

            Swal.fire({
              title: 'Error',
              text: 'Error deleting specialization. Please try again.',
              icon: 'error',
            });
          }
        );
      }
    });
  }

  // GET DOCTORS
  getDoctors(): void {

    try {

      const data = {
        token: this.token,
        limit: this.limit,
        offset: this.offset,
        textFilter: this.filter,
        id: this.idType
      }

      this.apiService.getDoctorsByType(data).subscribe((getDoctorsRes: any) => {
        
        // console.log(getSpecialgetDoctorsResizationsRes)

        if (getDoctorsRes.status == 200) {
          this.allDoctors = getDoctorsRes.res;
        } else {
          Swal.fire({
            text: "We didn't find doctors",
            icon: 'error',
            toast: true,
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            position: 'bottom'
          });
        }

      });
    } catch (error) {
      console.log('Error while getting doctors: ',error);
    }

  }

  // COUNT DOCTORS
  countDoctors() {
    const data = {
      token: localStorage.getItem('token')!,
      textFilter: this.filter,
      id: this.idType
    };

    this.apiService.countDoctorsByType(data).subscribe((countRes: any) => {
      // console.log(countRes);
      this.maxDoctors = countRes.res;
    });

  }

  
  // PAGINATION FUNCTIONS
  nextPage(): void{
    const currentOffset = this.offset + this.limit;
    this.offset = currentOffset;
    this.currentPage = ++this.currentPage;
    this.getDoctors();
  }

  previousPage(): void{
    const currentOffset = this.offset - this.limit;
    this.offset = currentOffset;
    this.currentPage = --this.currentPage;
    this.getDoctors();
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


  // FILTER DOCTORS
  filterDoctors(dataToSearch: string): void {
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

  // SUBMIT ACTIONS
  onSubmit(event: Event): void {
    event.preventDefault();
  }

  // REDIRECT TO DOCTOR
  redirectToDoctor(dni: string){
    this.returnBack();
    this.router.navigate(["/doctors/modify-doctor", dni]);
  }
}
