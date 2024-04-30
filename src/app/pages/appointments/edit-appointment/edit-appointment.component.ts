import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ApiService } from '../../../core/services/api.service';
import { dateValidator } from '../../../shared/validators/date.validator';
import { textValidator } from '../../../shared/validators/text.validator';

// FLOWBITE MODAL
import { ModalOptions, InstanceOptions, Modal } from 'flowbite';
@Component({
  selector: 'app-edit-appointment',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './edit-appointment.component.html',
  styleUrl: './edit-appointment.component.css'
})
export class EditAppointmentComponent implements OnInit {

  @Input() modalId?: string;
  
  // Save info appointment
  infoAppointmentDay: any = [];

  // Save info patient
  infoPatient: any = [];

  // Merge infoAppointmentDay + infoPatient
  generalData: any = [];

  apiService = inject(ApiService);
  
  // Save doctorInfo
  doctors: any = [];

  // Save doctorFilter
  filteredDoctor: any [] = [];
  
  ngOnInit(): void {
    this.getDoctors();
  }

  // FormGroup to creat appointment
  createAppointmentForm = new FormGroup({
    searchAppointment: new FormGroup({
      date : new FormControl('', [Validators.required, dateValidator]),
      selectAppointment: new FormControl('', Validators.required),
    }),
    patientName: new FormControl('', Validators.required),
    patientDNI: new FormControl(''),
    searchDataDoctorForm: new FormGroup({
      dataToSearch: new FormControl(''),
      dataSelect : new FormControl('', Validators.required)

    }),
    appointmentComment: new FormControl('', [Validators.required, textValidator])
  });

  getAppointments(date: string): void {
    let data = {
      date: date,
      token: localStorage.getItem('token')
    };


    // Reset arrays to clear data
    this.infoAppointmentDay = [];
    this.infoPatient = [];
    this.generalData = [];
    
    // Patch value to form
    this.createAppointmentForm.patchValue({
      searchAppointment: {
        selectAppointment: '',
      },
      searchDataDoctorForm: {
        dataToSearch: '',
        dataSelect: '',
      },
      patientName: '',
      patientDNI: '',
      appointmentComment: '',
    });
    
    // Fetch dayAppointmentData from API
    this.apiService.getDayAppointments(data).subscribe((appointmentPerDayDataResponse: any) => {
      if (appointmentPerDayDataResponse) { 
        this.infoAppointmentDay = appointmentPerDayDataResponse;
        
        // Fetch dataPatient for each patient from dayAppointmentData
        const requests = appointmentPerDayDataResponse.map((patient: any) => {
          return this.apiService.getPatientData({dni: patient.assignedPatient, token: localStorage.getItem('token')}).toPromise();
        });
        
        // Create new promise to merge patientDataResponses with dayAppointmentData
        Promise.all(requests).then((patientDataResponses: any) => {
          patientDataResponses.forEach((patientDataResponse: any, index: any) => {
            if (patientDataResponse) {
              const combinedObject = Object.assign({}, appointmentPerDayDataResponse[index], patientDataResponse);
              this.generalData.push(combinedObject); 
            }
          });
        });
      }
    }, (error) => {
      Swal.fire({
        icon: 'error',
        toast: true,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        position: 'bottom',
        text: error.error.message
      });
    });
  }


  loadData(id: string): void {

    let findDoctorAppointment = this.generalData.findIndex((appointment:any) => appointment.id == id);
    let doctorInfo = this.doctors.findIndex((doctor: any) => doctor.dni = this.infoAppointmentDay[findDoctorAppointment].assignedDoctor)
    let infoAppointment = this.generalData[findDoctorAppointment];
    let infoDoctor = this.doctors[doctorInfo];


    // Reset the form values
    this.createAppointmentForm.patchValue({
      searchDataDoctorForm: {
        dataToSearch: '',
        dataSelect: '',
      },
      patientName: '',
      patientDNI: '',
      appointmentComment: '',
    });

    // Set all values to the form
    this.createAppointmentForm.patchValue({
      patientName: `${infoAppointment.firstname} ${infoAppointment.lastname}`,
      patientDNI: `${infoAppointment.dni}`,
      appointmentComment: `${infoAppointment.comment}`,
      searchDataDoctorForm: {
        dataToSearch: `${infoDoctor.firstname} ${infoDoctor.lastname}`,
        dataSelect: `${infoDoctor.dni}`
      }
    })
  }

  getDoctors(): void{

    const token = localStorage.getItem('token')!;

    this.apiService.getDoctors(token).subscribe((data: any) => {

      if (data){
        this.doctors = data;
        this.filteredDoctor = data;
        // console.log(data);
      }

    });
  }

  updateAppointment(): void {

    const dataAppointment = {
      token: localStorage.getItem('token'),
      appointmentData: {
        id: this.createAppointmentForm.value.searchAppointment?.selectAppointment,
        assignedPatient: this.createAppointmentForm.value.patientDNI,
        assignedDoctor: this.createAppointmentForm.value.searchDataDoctorForm?.dataSelect,
        comment: this.createAppointmentForm.value.appointmentComment
      }
    }

    // console.log(dataAppointment.appointmentData);

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

             if (data) {
                Swal.fire({
                  title: 'Appointment edited!',
                  icon: 'success',
                  toast: true,
                  showConfirmButton: false,
                  timer: 2000,
                  timerProgressBar: true,
                  position: 'bottom'
                });
      
                setTimeout(() => {
                  window.location.reload();
                }, 2000);
            
             } else {
               Swal.fire({
                 title: 'Error',
                 text: 'Error updating appointment. Please try again.',
                 icon: 'error',
               });
             }
           },
           (error) => {
             console.error('Error updating appointment:', error);

             Swal.fire({
               title: 'Error',
               text: 'Error updating appointment. Please try again.',
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
        dataDoctorToFilter.phone.toLowerCase().includes(dataToSearch.toLowerCase())

      );

      if (searchName.length > 0) {

        if (searchName.length === 1){

          this.createAppointmentForm.patchValue({
            searchDataDoctorForm: {
              dataSelect: searchName[0].dni,
            },
          });

          this.filteredDoctor = searchName;

        } else {
          this.filteredDoctor = searchName;
        }

      } else {
        this.filteredDoctor = this.doctors;

        Swal.fire({
          icon: 'error',
          toast: true,
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          position: 'bottom',
          text: "We didn't found any doctors..."
        });
      }

    }
  }

  deleteAppointment(): void {

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

        const data = {
          token: localStorage.getItem('token'),
          id: id
        }

        this.apiService.deleteAppointments(data).subscribe(
          (data: any) => {
            // console.log(data);

             if (data) {
                Swal.fire({
                  title: 'Appointment deleted!',
                  icon: 'success',
                  toast: true,
                  showConfirmButton: false,
                  timer: 2000,
                  timerProgressBar: true,
                  position: 'bottom'
                });
      
                setTimeout(() => {
                  window.location.reload();
                }, 2000);
            
             } else {
               Swal.fire({
                 title: 'Error',
                 text: 'Error deleting appointment. Please try again.',
                 icon: 'error',
               });
             }
           },
           (error) => {
             console.error('Error deleting appointment:', error);

             Swal.fire({
               title: 'Error',
               text: 'Error deleting appointment. Please try again.',
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

  returnBack(): void {
    const modalElement: HTMLElement = document.getElementById('edit-appointment')!;

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

}
