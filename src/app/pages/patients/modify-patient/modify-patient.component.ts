import { Component, Input, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import Swal from 'sweetalert2';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { phoneNumberValidator } from '../../../shared/validators/phone.validator';
import { dniValidator } from '../../../shared/validators/dni.validator';

import { FormatFormsInputsService } from '../../../shared/services/format-forms-inputs.service';
import { textValidator } from '../../../shared/validators/text.validator';
import { patientsInterfaces } from '../../../core/interfaces/patients/patients-interfaces';
import { CommonModule } from '@angular/common';

import { InstanceOptions, Modal, ModalOptions } from 'flowbite';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-modify-patient',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink, NgxPaginationModule],
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

  allAppointments: number = 0;
  pagination: number = 1;
  cantAppointmentsPerPage: number = 4;

  offset: number = 0;
  limit: number = 4;
  maxAppointments: number = 0;
  maxPages: number = 0;
  currentPage: number = 1;
  filterActive: boolean = false;

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
      this.getDoctors();
      this.countAppointments();
    })
  }

  nextPage(): void{
    const currentOffset = this.offset + this.limit;
    this.offset = currentOffset;
    this.currentPage = ++this.currentPage;
    if (!this.filterActive) {
      this.getPatientAppointments(this.dniPatient);
    } else {

      if(this.currentPage == 1){
        this.filterAppointmentsPatient().slice(0, this.limit + 1);
        console.log(this.filterAppointmentsPatient())
      } else {

        const startIndex = (this.currentPage - 1) * this.limit;
        const endIndex = startIndex + this.limit;

        this.filterAppointmentsPatient().slice(startIndex, endIndex);
        console.log(this.filterAppointmentsPatient())
      }


    }
  }

  previousPage(): void{
    const currentOffset = this.offset - this.limit;
    this.offset = currentOffset;
    this.currentPage = --this.currentPage;
    if (!this.filterActive) this.getPatientAppointments(this.dniPatient);
  }

  countAppointments() {

    if (!this.filterActive){
      const token = localStorage.getItem('token')!;
  
      this.apiService.countAppointments(token).subscribe((countRes: any) => {
        this.maxAppointments = countRes.msn;
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
        
        if (patientResponse.assigneddoctor){
          let doctorData = {
            dni: patientResponse.assigneddoctor,
            token: this.token
          }
    
          this.apiService.getDoctorByDNI(doctorData).subscribe((doctorResponse: any) => {
            if(doctorResponse) {
              // console.log(doctorResponse);
    
              const doctorInfo = {
                doctorName: doctorResponse.firstname,
                doctorLastname: doctorResponse.lastname
              };
    
              this.dataDoctor = doctorInfo;
              // console.log(this.dataDoctor);
            }
          });
        }

  
      }
    });
  }

  getDoctors(){
    this.apiService.getDoctors(this.token!).subscribe((data: any) => {
      if (data){
        this.doctors = data;
        // console.log(this.doctors);
      }
    });
  }

  getPatientAppointments(dni: string, payed?: boolean, date?: string) {

    const data = {
      token: localStorage.getItem('token'),
      dni: dni,
      limit: this.limit,
      offset: this.offset,
      order: this.typeOrder,
      payed: payed,
      date: date
    }

    this.apiService.getUserAppointments(data).subscribe((data: any) => {
      
      if (data) {
        this.appointmentsPatient = data;
        this.filterAppointmentsPatient.set(data)

        // Get doctors info
        this.appointmentsPatient.forEach((appointment: any) => {
          const assigneddoctorDNI = appointment.assignedDoctor;

          this.apiService.getDoctorByDNI({token: localStorage.getItem('token'), dni: assigneddoctorDNI}).subscribe((doctorInfo: any) => {
            appointment.doctor = `${doctorInfo.firstname} ${doctorInfo.lastname}`;
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

  filterAppoinments(dataToSearch: string): void {

    // if (!dataToSearch) {
    //   this.filterAppointmentsPatient.set(this.appointmentsPatient);
    // } else {

    //   if (dataToSearch == 'payed'){

    //     const searchName = this.filterAppointmentsPatient().filter((dataPatientToFilter: any) => dataPatientToFilter.payed);
    //     this.filterAppointmentsPatient.set(searchName);
    //     this.filterActive = true;
    //     this.currentPage = 1;

    //   } else if (dataToSearch == 'no payed'){

    //     const searchName = this.filterAppointmentsPatient().filter((dataPatientToFilter: any) => !dataPatientToFilter.payed);
    //     this.filterAppointmentsPatient.set(searchName);
    //     this.filterActive = true;

    //   } else {

    //     const searchName = this.filterAppointmentsPatient().filter((dataPatientToFilter: any) =>
    //       dataPatientToFilter.comment.toLowerCase().includes(dataToSearch.toLowerCase()) ||
    //       dataPatientToFilter.doctor.toLowerCase().includes(dataToSearch.toLowerCase()) ||
    //       dataPatientToFilter.appointmentDate.toLowerCase().includes(dataToSearch.toLowerCase())
    //     );
  
    //     if (searchName.length > 0) {
    //       this.filterAppointmentsPatient.set(searchName);
    //       this.filterActive = true;
    //     } else {
  
    //       this.filterAppointmentsPatient.set(this.appointmentsPatient);
  
    //       Swal.fire({
    //         text: "We didn't found any appointment..." ,
    //         icon: 'error',
    //         toast: true,
    //         showConfirmButton: false,
    //         timer: 3000,
    //         timerProgressBar: true,
    //         position: 'bottom'
    //       });
    //     }
    //   }
      

    // }

    if (dataToSearch) {
      const lowerCaseDataToSearch = dataToSearch.toLocaleLowerCase();
  
      if (lowerCaseDataToSearch === 'payed') {
        this.getPatientAppointments(this.dniPatient, true, undefined);
      } else if (lowerCaseDataToSearch === 'no payed') {
        this.getPatientAppointments(this.dniPatient, false, undefined);
      } else {
        this.getPatientAppointments(this.dniPatient, undefined, dataToSearch);
      }

    } else {
      this.getPatientAppointments(this.dniPatient);
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

    return `${hours} hours y ${minutes} minutes`;
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

  renderPage(event: number) {
    this.pagination = event;
    this.getPatientAppointments(this.dniPatient);
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
        city: formattedCity,
        email: this.modifyPatientForm.value.patientEmail,
        phone: this.modifyPatientForm.value.patientPhone,
        assigneddoctor: this.modifyPatientForm.value.patientDoctor,
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
        this.apiService.modifyPatient(data).subscribe(
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
                this.router.navigate(['/patients']);
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
