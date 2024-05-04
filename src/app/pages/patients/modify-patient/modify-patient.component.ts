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
  typeOrder: string = 'DSC';

  actualStatus = signal<boolean>(false);

  dniPatient: string = '';

  doctors: any = [];

  dataDoctor: any = [];

  appointmentsPatient: any = [];

  token = localStorage.getItem('token');

  allAppointments: number = 0;
  pagination: number = 1;
  cantAppointmentsPerPage: number = 4;

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
    })
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

  getPatientAppointments(dni: string) {

    const data = {
      token: localStorage.getItem('token'),
      dni: dni
    }

    this.apiService.getUserAppointments(data).subscribe((data: any) => {
      
      if (data) {
        data.sort((a: any, b: any) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime())
        this.appointmentsPatient = data;
        
        if (this.filterAppointmentsPatient().length == 0 ) this.filterAppointmentsPatient.set(data);

        // console.log(this.filterAppointmentsPatient().length);

        // Get doctors info
        this.appointmentsPatient.forEach((appointment: any) => {
          const assigneddoctorDNI = appointment.assignedDoctor;

          this.apiService.getDoctorByDNI({token: localStorage.getItem('token'), dni: assigneddoctorDNI}).subscribe((doctorInfo: any) => {
            appointment.doctor = `${doctorInfo.firstname} ${doctorInfo.lastname}`;
          }, err => {
            console.error(err);
          });

        });

      }
    })
  }

  filterAppoinments(dataToSearch: string): void {

    // console.log(dataToSearch);

    if (!dataToSearch) {
      this.filterAppointmentsPatient.set(this.appointmentsPatient);
      // console.log(this.filteredPatient);
    } else {

      if (dataToSearch == 'payed'){

        const searchName = this.filterAppointmentsPatient().filter((dataPatientToFilter: any) => dataPatientToFilter.payed);
        this.filterAppointmentsPatient.set(searchName);

      } else if (dataToSearch == 'no payed'){

        const searchName = this.filterAppointmentsPatient().filter((dataPatientToFilter: any) => !dataPatientToFilter.payed);
        this.filterAppointmentsPatient.set(searchName);

      } else {

        const searchName = this.filterAppointmentsPatient().filter((dataPatientToFilter: any) =>
          dataPatientToFilter.comment.toLowerCase().includes(dataToSearch.toLowerCase()) ||
          dataPatientToFilter.doctor.toLowerCase().includes(dataToSearch.toLowerCase()) ||
          dataPatientToFilter.appointmentDate.toLowerCase().includes(dataToSearch.toLowerCase())
        );
  
        if (searchName.length > 0) {
          this.filterAppointmentsPatient.set(searchName);
        } else {
  
          this.filterAppointmentsPatient.set(this.appointmentsPatient);
  
          Swal.fire({
            text: "We didn't found any appointment..." ,
            icon: 'error',
            toast: true,
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            position: 'bottom'
          });
        }
      }
      

    }
  }

  changeSVGIcon(){

    // Get 2 svg id
    const svgDSC = document.getElementById('svgFilterDSC');
    const svgASC = document.getElementById('svgFilterASC');

    if (svgDSC?.style.display == 'block') {

      this.typeOrder = 'ASC';
      this.shortByDate();

      svgDSC!.style.display = 'none';
      svgASC!.style.display = 'block';

    } else {
      this.typeOrder = 'DSC';
      this.shortByDate();

      svgASC!.style.display = 'none';
      svgDSC!.style.display = 'block';

    }
  }

  shortByDate(): void {

    if (this.typeOrder == 'ASC') {
     
      // Change order to DSC
      const originalData = this.filterAppointmentsPatient();
      const orderASC= originalData.sort((a: any, b: any) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime());
      this.filterAppointmentsPatient.set(orderASC);

    } else {

      // Change order to DSC
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
