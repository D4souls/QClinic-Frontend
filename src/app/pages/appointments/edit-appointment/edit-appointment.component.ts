import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { dniValidator } from '../../../shared/validators/dni.validator';
import { phoneNumberValidator } from '../../../shared/validators/phone.validator';
import { textValidator } from '../../../shared/validators/text.validator';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { FormatFormsInputsService } from '../../../shared/services/format-forms-inputs.service';
import { patientsInterfaces } from '../../../core/interfaces/patients/patients-interfaces';

@Component({
  selector: 'app-edit-appointment',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './edit-appointment.component.html',
  styleUrl: './edit-appointment.component.css'
})
export class EditAppointmentComponent implements OnInit {

  apiService = inject(ApiService);

  dayAppointments: any[] = [];
  
  doctors: any = [];
  filteredDoctor: any [] = [];

  ngOnInit(): void {
    this.getDoctors();
  }

  createAppointmentForm = new FormGroup({
    searchAppointment: new FormGroup({
      date : new FormControl('', Validators.required),
      selectAppointment: new FormControl('', Validators.required),
    }),
    patientName: new FormControl('', Validators.required),
    searchDataDoctorForm: new FormGroup({
      dataToSearch: new FormControl(''),
      dataSelect : new FormControl('', Validators.required)

    }),
    appointmentComment: new FormControl('', [Validators.required, textValidator])
  });

  getAppointments(date: string): void {
    this.apiService.getDayAppointments(date).subscribe((data: any) => {

      this.dayAppointments = data.data;
      console.log(this.dayAppointments);

    }, (error) => {
      console.error("Error getting dayAppointments: ", error);
      Swal.fire({
        title: 'Error',
        text: 'Error getting appointments. Please try again.',
        icon: 'error',
      });
    });
  }

  loadData(id: string): void {

    const dataAppointment = this.dayAppointments;
    const patientInfo = dataAppointment.findIndex((appointment) => appointment.id == id);

    this.createAppointmentForm.patchValue({
      patientName: `${dataAppointment[patientInfo].patientFirstname} ${dataAppointment[patientInfo].patientLastname}`,
      searchDataDoctorForm: {
        dataToSearch: `${dataAppointment[patientInfo].doctorFirstname} ${dataAppointment[patientInfo].doctorLastname}`,
        dataSelect: dataAppointment[patientInfo].dniDoctor
      },
      appointmentComment: dataAppointment[patientInfo].comment,
    });
  }

  getDoctors(): void{

    this.apiService.getDoctors().subscribe((data: any) => {

      if (data.success){
        this.doctors = data.data
        this.filteredDoctor = this.doctors.slice();
      } else {
        console.log(data);
      }

    });
  }

  updateAppointment(): void {

    const dataAppointment = {
      id: this.createAppointmentForm.value.searchAppointment?.selectAppointment,
      dniDoctor: this.createAppointmentForm.value.searchDataDoctorForm?.dataSelect,
      comment: this.createAppointmentForm.value.appointmentComment
    };

    // console.log(dataAppointment);

    Swal.fire({
      title: 'Do you want to save changes?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.apiService.updateAppointments(dataAppointment).subscribe(
          (data: any) => {
            // console.log(data);

             if (data.message) {
               Swal.fire({
                 title: 'Success',
                 text: data.message,
                 icon: 'success',
                 confirmButtonText: "Return back",
               }).then((result) => {
                 if (result.isConfirmed) {
                   window.location.reload();
                 }
               });
            
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

  filterDoctors(dataToSearch: string): void {
    if (!dataToSearch) {
      this.filteredDoctor = this.doctors.slice();
    } else {
      const searchName = this.doctors.filter((dataDoctorToFilter: any) =>
        dataDoctorToFilter.firstname.toLowerCase().includes(dataToSearch.toLowerCase()) ||
        dataDoctorToFilter.lastname.toLowerCase().includes(dataToSearch.toLowerCase()) ||
        dataDoctorToFilter.dni.toLowerCase().includes(dataToSearch.toLowerCase()) ||
        dataDoctorToFilter.email.toLowerCase().includes(dataToSearch.toLowerCase())

      );

      if (searchName.length > 0) {
        this.filteredDoctor = searchName;
      } else {
        this.filteredDoctor = this.doctors;

        Swal.fire({
          title: 'Search error',
          text: "We didn't found any doctors..." ,
          icon: 'error',
        });
      }

    }
  }

  deletePatient(): void {

    const id = this.createAppointmentForm.value.searchAppointment!.selectAppointment;

    console.log(id);

    Swal.fire({
      title: 'Do you want to delete this appointment?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.apiService.deleteAppointments(id!).subscribe(
          (data: any) => {
            // console.log(data);

             if (data.message) {
               Swal.fire({
                 title: 'Success',
                 text: data.message,
                 icon: 'success',
                 confirmButtonText: "Return back",
               }).then((result) => {
                 if (result.isConfirmed) {
                   window.location.reload();
                 }
               });
            
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

  onSubmit(event: Event): void{
    event.preventDefault();
  }

}
