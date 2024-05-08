import { Component, Input, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import Swal from 'sweetalert2';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { phoneNumberValidator } from '../../../shared/validators/phone.validator';
import { dniValidator } from '../../../shared/validators/dni.validator';

import { FormatFormsInputsService } from '../../../shared/services/format-forms-inputs.service';
import { textValidator } from '../../../shared/validators/text.validator';
import { CommonModule } from '@angular/common';

import { InstanceOptions, Modal, ModalOptions } from 'flowbite';
import { catchError, single, throwError, timeout } from 'rxjs';

@Component({
  selector: 'app-modify-patient',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './modify-patient.component.html',
  styleUrl: './modify-patient.component.css',
})
export class ModifyPatientComponent implements OnInit {

  dataPatient: any = [];
  filterAppointmentsPatient = signal<any[]>([]);

  copyFilterAppointmentsPatient = signal<any[]>([]);

  typeOrder: string = 'DESC';

  actualStatus = signal<boolean>(false);

  dniPatient: string = '';

  doctors: any = [];

  dataDoctor: any = [];

  appointmentsPatient: any = [];

  token = localStorage.getItem('token');

  offset: number = 0;
  limit: number = 4;
  maxAppointments: number = 0;
  maxPages: number = 0;
  currentPage: number = 1;
  filterActive: boolean = false;
  loading = signal<boolean>(true);
  error = signal<boolean>(true);
  
  filterText: any = undefined;

  constructor(
    private router: Router,
    private apiService: ApiService,
    private activatedRouter: ActivatedRoute,
    private formatForm: FormatFormsInputsService,
  ) {}

  ngOnInit(): void {
    this.activatedRouter.params.subscribe(req => {

      this.dniPatient = req['dniPatient'];
      this.getDataPatient(this.dniPatient);
      this.getPatientAppointments(this.dniPatient);
      this.countAppointments();
      this.getDoctors();
      this.countDoctors();
      this.modifyPatient(this.dniPatient);

    })
  }

  modifyPatient(dni: string): void {

    const appModify = document.getElementById('app-modify-patient');
    appModify?.setAttribute('dni', dni);

    const $targetEl = document.getElementById('modal-edit-patient');

    // Modal Options
    const options: ModalOptions = {
      placement: 'bottom-right',
      backdrop: 'dynamic',
      backdropClasses: 'bg-gray-900/50 fixed inset-0 z-40',
      closable: false,
    };
    
    // Modal instance options
    const instanceOptions: InstanceOptions = {
      id: 'modal-edit-patient',
      override: true,
    };

    const modal: Modal = new Modal($targetEl, options, instanceOptions);

    
    modal.show();

  }

  nextPage(): void{
    const currentOffset = this.offset + this.limit;
    this.offset = currentOffset;
    this.currentPage = ++this.currentPage;
    this.getPatientAppointments(this.dniPatient);
  }

  previousPage(): void{
    const currentOffset = this.offset - this.limit;
    this.offset = currentOffset;
    this.currentPage = --this.currentPage;
    if (!this.filterActive) this.getPatientAppointments(this.dniPatient);
  }

  countAppointments() {

    if (!this.filterActive){
      
      const data = {
        token: localStorage.getItem('token'),
        dni: this.dniPatient,
        textFilter: this.filterText,
      }
  
      this.apiService.countAppointmentsWithFilter(data).subscribe((countRes: any) => {
        this.maxAppointments = countRes.res;
      });
      
    } else {
      this.maxAppointments = this.filterAppointmentsPatient().length;
    }


  }

  totalPages(): number {
    this.maxPages = Math.ceil(this.maxAppointments / this.limit);
    return this.maxPages;
  }

  generatePageNumbers(): number[] {
    const pagesArray = [];
    const totalPages = this.totalPages();
    for (let i = 1; i <= totalPages; i++) {
      pagesArray.push(i);
    }
    return pagesArray;
  }

  goToPage(page: number){
    this.offset = ( page - 1 ) * this.limit;
    this.currentPage = page;
    
    if (!this.filterActive){
      this.getPatientAppointments(this.dniPatient);
    } else {

    }
    
  }

  getDNIValue(): any {
    const dniValue = document.getElementById('app-modify-patient')!.getAttribute('dni');
    return dniValue;
  }

  modifyPatientForm = new FormGroup({
    patientDNI: new FormControl('', [
      Validators.required,
      dniValidator
    ]),
    patientName: new FormControl('', [
      Validators.required,
      textValidator
    ]),
    patientLastname: new FormControl('', [
      Validators.required, textValidator
    ]),
    patientPhone: new FormControl('', [
      Validators.required,
      phoneNumberValidator
    ]),
    patientGender: new FormControl('', Validators.required),
    patientDoctor: new FormControl('', Validators.required),
    patientEmail: new FormControl('', Validators.email),
    patientCity: new FormControl('', [Validators.nullValidator]),
  });

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

        const renamedFile = new File([file], `${this.dniPatient}.jpg`, { type: file.type });

        
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

  getDataPatient(dniToFind: string){

    let patientData = {
      token: localStorage.getItem('token'),
      dni: dniToFind
    }
  
    this.apiService.getPatientData(patientData).subscribe((patientResponse: any) => {
      if(patientResponse){
        this.dataPatient = patientResponse;

        this.actualStatus.set(patientResponse.isActive);
  
        this.modifyPatientForm.patchValue({
          patientDNI: patientResponse.dni,
          patientName: patientResponse.firstname,
          patientLastname: patientResponse.lastname,
          patientCity: patientResponse.city,
          patientPhone: patientResponse.phone,
          patientEmail: patientResponse.email,
          patientGender: patientResponse.gender,
          patientDoctor: patientResponse.assigneddoctor != null ? patientResponse.assigneddoctor : null,
        });
        
        if (patientResponse.assigneddoctor != '' && patientResponse.assigneddoctor != null) this.dniSelectedDoctor.set(patientResponse.assigneddoctor);

  
      }
    });
  }


  getPatientAppointments(dni: string) {

    const data = {
      token: localStorage.getItem('token'),
      dni: dni,
      limit: this.limit,
      offset: this.offset,
      order: this.typeOrder,
      filterText: this.filterText,
    }

    this.apiService.getUserAppointments(data).subscribe((data: any) => {
      
      if (data.status != 200) {
        Swal.fire({
          text: "We dind't found any appointment",
          icon: 'question',
          toast: true,
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          position: 'bottom'
        });
      } else {
        this.appointmentsPatient = data.res;
        this.filterAppointmentsPatient.set(data.res)

        // Get doctors info
        this.appointmentsPatient.forEach((appointment: any) => {
          const assigneddoctorDNI = appointment.assignedDoctor;

          this.apiService.getDoctorByDNI({token: localStorage.getItem('token'), dni: assigneddoctorDNI}).subscribe((doctorInfo: any) => {

            const splitLastname = doctorInfo.lastname.split(' ');

            if (splitLastname.length == 1) {
              const lastNameAcron = splitLastname[0].slice(0, 3);
              appointment.doctor = `${doctorInfo.firstname} ${lastNameAcron}.`;
            } else {
              const lastNameAcron = `${splitLastname[0].slice(0, 3)}.${splitLastname[1][0]}`
              appointment.doctor = `${doctorInfo.firstname} ${lastNameAcron}.`;
            }


          }, err => {
            console.error(err);
          });

          if (appointment.appointmentEnd != null && appointment.appointmentStart != null) {
            const startDate = new Date(appointment.appointmentStart);
            const endDate = new Date(appointment.appointmentEnd);
            const hoursDiff = this.calculateHourDifference(startDate, endDate);
            appointment.hoursDifference = hoursDiff;
          } else {
            appointment.hoursDifference = null;
          }


        });

      }
    })
  }

  countPatientAppointmentWithFilter(): void {
    
    this.apiService.countAppointmentWithFilter({token: this.token, filterText: this.filterText, dni: this.dniPatient}).subscribe((countWithFilterRes: any) => {
      this.maxAppointments = countWithFilterRes;

    });
  }

  filterAppoinments(dataToSearch: string): void {

    if (dataToSearch === "") {
      
      this.filterText = undefined;
      
      this.getPatientAppointments(this.dniPatient);
      this.countPatientAppointmentWithFilter();
      this.generatePageNumbers();
      
    } else {
  
      this.filterText = dataToSearch;
  
      this.getPatientAppointments(this.dniPatient);
      this.countPatientAppointmentWithFilter();
      this.generatePageNumbers();
  
    }
  
  }

  calculateHourDifference(startDate: Date, endDate: Date): string {
    const startHours = startDate.getHours();
    const startMinutes = startDate.getMinutes();
    const endHours = endDate.getHours();
    const endMinutes = endDate.getMinutes();

    const totalStartMinutes = (startHours * 60) + startMinutes;
    const totalEndMinutes = (endHours * 60) + endMinutes;

    const differenceInMinutes = totalEndMinutes - totalStartMinutes;
    const hours = Math.floor(differenceInMinutes / 60);
    const minutes = differenceInMinutes % 60;

    return `${hours}.${minutes}h`;
}

  changeSVGIcon(){

    // Get 2 svg id
    const svgDSC = document.getElementById('svgFilterDSC');
    const svgASC = document.getElementById('svgFilterASC');

    if (svgDSC?.style.display == 'block') {

      this.typeOrder = 'ASC';
      this.getPatientAppointments(this.dniPatient);

      svgDSC!.style.display = 'none';
      svgASC!.style.display = 'block';

    } else {
      this.typeOrder = 'DESC';
      this.getPatientAppointments(this.dniPatient);

      svgASC!.style.display = 'none';
      svgDSC!.style.display = 'block';

    }
  }

  shortByDate(): void {

    if (this.typeOrder == 'ASC') {
     
      // Change order to DESC
      const originalData = this.filterAppointmentsPatient();
      const orderASC= originalData.sort((a: any, b: any) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime());
      this.filterAppointmentsPatient.set(orderASC);

    } else {

      // Change order to DESC
      const originalData = this.filterAppointmentsPatient();
      const orderDSC= originalData.sort((a: any, b: any) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime());
      this.filterAppointmentsPatient.set(orderDSC);

    }


  }

  updateSatusPaymentSignal(id: number): void {
    
    const currentAppointmetns = this.filterAppointmentsPatient();

    const appoinmentToUpdate = currentAppointmetns.find((a: any) => a.id == id);

    if (appoinmentToUpdate) appoinmentToUpdate['payed'] = true;
  }

  updateStatusPayment(id: number){
    
    this.apiService.updatePaymentStatus({id: id, token: localStorage.getItem('token')}).subscribe((updatePayStatusRes: any) => {

      if (updatePayStatusRes.status == 200) {

        this.updateSatusPaymentSignal(id);

        Swal.fire({
          text: 'Now appoinment is payed',
          icon: 'success',
          toast: true,
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          position: 'bottom'
        });

      } else {
        Swal.fire({
          text: updatePayStatusRes.msn,
          icon: 'error',
          toast: true,
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          position: 'bottom'
        });
      }

    })
  }

  onSubmit(event: Event): void {
    event.preventDefault();
  }

  returnBack(){
    
    const $targetEl = document.getElementById('modal-edit-patient');
    // Modal Options
    const options: ModalOptions = {
      placement: 'bottom-right',
      backdrop: 'dynamic',
      backdropClasses: 'bg-gray-900/50 fixed inset-0 z-40',
      closable: false,
    };
    
    // Modal instance options
    const instanceOptions: InstanceOptions = {
      id: 'modal-edit-patient',
      override: true
    };

    const modal: Modal = new Modal($targetEl, options, instanceOptions);

    
    modal.hide();

    this.router.navigate(["/patients"]);

  }

  saveChanges(): void {

    // FORMAT DATA PATIENT
    const formattedName = this.formatForm.formatTextToUpper(this.modifyPatientForm.value.patientName!);
    const formattedLastName = this.formatForm.formatTextToUpper(this.modifyPatientForm.value.patientLastname!);
    const formattedCity = this.modifyPatientForm.value.patientCity ? this.formatForm.formatTextToUpper(this.modifyPatientForm.value.patientCity!) : this.modifyPatientForm.value.patientCity;


    const data = {
      token: localStorage.getItem('token'),
      patientData: {
        dni: this.modifyPatientForm.value.patientDNI,
        firstname: formattedName,
        lastname: formattedLastName,
        gender: this.modifyPatientForm.value.patientGender,
        city: this.modifyPatientForm.value.patientCity ?? null,
        email: this.modifyPatientForm.value.patientEmail,
        phone: this.modifyPatientForm.value.patientPhone,
        assigneddoctor: this.modifyPatientForm.value.patientDoctor
      }
    }

    if (data.patientData.email === '') data.patientData.email = null;
    if (data.patientData.city === '') data.patientData.city = null;

    // console.log(data.patientData);

    Swal.fire({
      title: 'Do you want to save changes?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.apiService.modifyPatient(data).subscribe(
          (data: any) => {
            // console.log(data);

            if (data.status == 200) {
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
                text: 'Error deleting patient. Please try again.',
                icon: 'error',
              });
            }
          },
          (error) => {
            console.error('Error deleting patient:', error);

            Swal.fire({
              title: 'Error',
              text: 'Error deleting patient. Please try again.',
              icon: 'error',
            });
          }
        );
      }
    });
  }

  deletePatient(): void {
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
          dni: this.modifyPatientForm.value.patientDNI!
        }

        this.apiService.deletePatient(data).subscribe(
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
                window.location.reload();
              }, 3000);    
              
            } else {
              Swal.fire({
                title: 'Error',
                text: 'Error deleting patient. Please try again.',
                icon: 'error',
              });
            }
          },
          (error) => {
            console.error('Error deleting patient:', error);

            Swal.fire({
              title: 'Error',
              text: 'Error deleting patient. Please try again.',
              icon: 'error',
            });
          }
        );
      }
    });
  }

  changeStatusPatient(): void {

    const data = {dni: this.dataPatient.dni , token: this.token};

    this.apiService.changeStatusPatient(data).subscribe((changeSatusRes: any) => {

      // console.log(changeSatusRes);

      if (changeSatusRes.status == 200){

        this.getDataPatient(this.dniPatient);

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


  // SEARCH DOCTOR
  filteredDoctor: any = [];
  offsetDoctor: number = 0;
  limitDoctor: number = 11;
  maxDoctors: number = 0;
  maxPagesDoctors: number = 0;
  currentPageDoctor: number = 1;

  filterDoctor: any = undefined;

  dniSelectedDoctor = signal<any>("");

  countDoctors() {
    const token = localStorage.getItem('token')!;

    this.apiService.countDoctors(token).subscribe((countRes: any) => {
      // console.log(countRes)
      this.maxPages = countRes;
    });

  }

  nextPageDoctor(): void{
    const currentOffset = this.offsetDoctor + this.limitDoctor;
    this.offsetDoctor = currentOffset;
    this.currentPageDoctor = ++this.currentPage;
    this.getDoctors();
    this.countDoctors();
  }

  previousPageDoctor(): void{
    const currentOffset = this.offsetDoctor - this.limitDoctor;
    this.offsetDoctor = currentOffset;
    this.currentPageDoctor = --this.currentPage;
    this.getDoctors();
  }

  totalPagesDoctors(): number {
    this.maxPagesDoctors = Math.ceil(this.maxDoctors / this.limitDoctor);
    return this.maxPagesDoctors;
  }

  generatePageDoctorNumbers(): number[] {
    const pagesArray = [];
    const totalPages = this.totalPagesDoctors();
    if (totalPages < 1) pagesArray.push(1);
    
    for (let i = 1; i <= totalPages; i++) {
      pagesArray.push(i);
    }
    return pagesArray;
  }

  goToPageDoctor(page: number){
    this.offset = ( page - 1 ) * this.limit;
    this.currentPage = page;
    this.getDoctors();
  }

  getDoctors(): void {

    const data = {
      limit: this.limitDoctor, 
      offset: this.offsetDoctor, 
      token: this.token,
      textFilter: this.filterDoctor,
    }

    try {

      this.apiService.getDoctors(data).subscribe((data: any) => {

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
          this.filteredDoctor = data.res;
        }
      });
    } catch (error) {
      console.log('Error while getting users: ',error);
    }

  }

  redirectToDoctor(dni: string): void {
    this.returnBack();
    this.router.navigate(['/doctors/modify-doctor', dni]);
  }

  filterDoctors(dataToSearch: string): void {

    if (dataToSearch === "") {
      
      this.filterDoctor = undefined;
      
      this.getDoctors();
      this.countDoctors();
      this.generatePageDoctorNumbers();
      
    } else {
  
      this.filterDoctor = dataToSearch;
  
      this.getDoctors();
      this.countDoctors();
      this.generatePageDoctorNumbers();
  
    }
    
  }

  unMarkDoctor(dni: string){
    this.dniSelectedDoctor.set(null);
    this.modifyPatientForm.get('patientDoctor')?.setValue(null);
  }

  markDoctor(dni: string){
    this.dniSelectedDoctor.set(dni);
    this.modifyPatientForm.get('patientDoctor')?.setValue(dni);
  }

}
