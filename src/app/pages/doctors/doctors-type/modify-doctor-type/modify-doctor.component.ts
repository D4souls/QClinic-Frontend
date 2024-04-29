import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../../core/services/api.service';
import Swal from 'sweetalert2';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { phoneNumberValidator } from '../../../../shared/validators/phone.validator';
import { dniValidator } from '../../../../shared/validators/dni.validator';

import { FormatFormsInputsService } from '../../../../shared/services/format-forms-inputs.service';
import { textValidator } from '../../../../shared/validators/text.validator';

@Component({
  selector: 'app-modify-doctor-type',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './modify-doctor.component.html',
  styleUrl: './modify-doctor.component.css',
})
export class ModifyDoctorTypeComponent implements OnInit {

  dataDoctor: any = [];

  idType: string = '';

  token = localStorage.getItem('token');

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
        this.dataDoctor = doctorResponse;
  
        this.modifyDoctorTypeForm.patchValue({
          id: this.dataDoctor.id,
          name: this.dataDoctor.name,
          description: this.dataDoctor.description,
          salary: this.dataDoctor.salary,
        }); 
      }
    });
  }


  returnBack(){
    this.router.navigate(['/doctors/specializations']);
  }

  saveChanges(): void {

    const data = {
      token: localStorage.getItem('token'),
      doctorTypeData: {
        id: this.modifyDoctorTypeForm.value.id,
        name: this.modifyDoctorTypeForm.value.name,
        desciption: this.modifyDoctorTypeForm.value.description,
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
}
