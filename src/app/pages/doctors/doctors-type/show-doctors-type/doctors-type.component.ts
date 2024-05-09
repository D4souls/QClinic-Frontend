import { Component, HostListener, OnInit } from '@angular/core';
import { InstanceOptions, Modal, ModalOptions } from 'flowbite';
import { Router, RouterOutlet } from '@angular/router';
import Swal from 'sweetalert2';
import { ApiService } from '../../../../core/services/api.service';
import { CreateDoctorTypeComponent } from '../create-doctor-type/create-doctor-type.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-doctors-type',
  standalone: true,
  imports: [CreateDoctorTypeComponent, CreateDoctorTypeComponent, RouterOutlet, CommonModule],
  templateUrl: './doctors-type.component.html',
  styleUrl: './doctors-type.component.css'
})
export class DoctorsTypeComponent implements OnInit{

  ngOnInit(): void {
    this.getSpecializations();
    this.countSpecializations();
  }

  constructor(
    private router: Router,
    private _apiService: ApiService
  ) {}
  
  dataSpecializations: any = [];

  token = localStorage.getItem('token');

  offset: number = 0;
  limit: number = 11;
  maxSpecializations: number = 0;
  maxPages: number = 0;
  currentPage: number = 1;

  filter: any = undefined;

  // GET SPECIALZIATIONS
  getSpecializations(): void {

    try {

      const data = {
        token: this.token,
        limit: this.limit,
        offset: this.offset,
        textFilter: this.filter,

      }

      this._apiService.getDoctorsType(data).subscribe((getSpecializationsRes: any) => {
        
        // console.log(getSpecializationsRes)

        if (getSpecializationsRes.status == 200) {
          this.dataSpecializations = getSpecializationsRes.res;
        } else {
          Swal.fire({
            text: "We didn't find specialziations",
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
      console.log('Error while getting specializations: ',error);
    }

  }


  // COUNT SPECIALZIATIONS
  countSpecializations() {
    const data = {
      token: localStorage.getItem('token')!,
      textFilter: this.filter,
    };

    this._apiService.countDoctorsType(data).subscribe((countRes: any) => {
      // console.log(countRes);
      this.maxSpecializations = countRes.res;
    });

  }

  // PAGINATION FUNCTIONS
  nextPage(): void{
    const currentOffset = this.offset + this.limit;
    this.offset = currentOffset;
    this.currentPage = ++this.currentPage;
    this.getSpecializations();
  }

  previousPage(): void{
    const currentOffset = this.offset - this.limit;
    this.offset = currentOffset;
    this.currentPage = --this.currentPage;
    this.getSpecializations();
  }

  totalPages(): number {
    this.maxPages = Math.ceil(this.maxSpecializations / this.limit);
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
    this.getSpecializations();
  }


  // FILTER SPECIALIZATIONS
  filterSpecializations(dataToSearch: string): void {
    if (dataToSearch === "") {
      
      this.filter = undefined;
      
      this.getSpecializations();
      this.countSpecializations();
      this.generatePageNumbers();
      
    } else {
  
      this.filter = dataToSearch;
  
      this.getSpecializations();
      this.countSpecializations();
      this.generatePageNumbers();
  
    }
  }

  // SUBMIT ACTIONS
  onSubmit(event: Event): void {
    event.preventDefault();
  }

  // NEW SPECIALIZATION
  newSpecialization(): void {
    const $targetEl = document.getElementById('modal-create-specializations');
    // Modal Options
    const options: ModalOptions = {
      placement: 'bottom-right',
      backdrop: 'dynamic',
      backdropClasses: 'bg-gray-900/50 fixed inset-0 z-40',
      closable: true,
    };
    
    // Modal instance options
    const instanceOptions: InstanceOptions = {
      id: 'modal-create-specializations',
      override: true
    };

    const modal: Modal = new Modal($targetEl, options, instanceOptions);

    
    modal.show();
  }

  // MODIFY SPECIALIZATION
  modifySpecialziation(id: number): void {

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

    this.router.navigate(['/doctors/specializations/modify-specialization', id]);
  }

  returnBack(modalName: string){
    
    const $targetEl = document.getElementById(modalName);
    // Modal Options
    const options: ModalOptions = {
      placement: 'bottom-right',
      backdrop: 'dynamic',
      backdropClasses: 'bg-gray-900/50 fixed inset-0 z-40',
      closable: false,
    };
    
    // Modal instance options
    const instanceOptions: InstanceOptions = {
      id: modalName,
      override: true
    };

    const modal: Modal = new Modal($targetEl, options, instanceOptions);

    
    modal.hide();

    this.router.navigate(["/doctors/specializations"]);

  }

}
