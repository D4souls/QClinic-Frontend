import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { Router } from '@angular/router';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-patient',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './create-patient.component.html',
  styleUrl: './create-patient.component.css',
})
export class CreatePatientComponent {

  constructor(private router: Router){}

  createPatientForm = new FormGroup({
    patientDNI: new FormControl('', Validators.required),
    patientName: new FormControl('', Validators.required),
    patientLastname: new FormControl('', Validators.required),
    patientPhone: new FormControl('', Validators.required),
    patientEmail: new FormControl('', Validators.required),
    patientCity: new FormControl('', Validators.required),
    patientGender: new FormControl('', Validators.required),
    patientDirection: new FormControl('', Validators.required),
  });

  response: string | null = null;

  createPatient() {
    fetch('http://localhost/api/createUser.php', {
      method: 'POST',
      body: JSON.stringify({
        dni: this.createPatientForm.value.patientDNI,
        firstname: this.createPatientForm.value.patientName,
        lastname: this.createPatientForm.value.patientLastname,
        telefono: this.createPatientForm.value.patientPhone,
        email: this.createPatientForm.value.patientEmail,
        city: this.createPatientForm.value.patientCity,
        genero: this.createPatientForm.value.patientGender,
        direccion: this.createPatientForm.value.patientDirection,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((response) => response.text())
      .then((text) => {
        
        if(text){
          Swal.fire({
            title: 'Patient created!',
            showDenyButton: true,
            confirmButtonText: "Return to patients",
            denyButtonText: "Create more"
          }).then((result) => {
            if (result.isConfirmed) {
              setTimeout(()=>{
                this.router.navigate(['/patients']);
              }, 1000);
            } else if (result.isDenied) {
              setTimeout(()=>{
                this.router.navigate(['/create-patient']);
              }, 1000);
            }
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: text,
          });
        }

      })
      .catch((error) => console.error('Error en la solicitud:', error));
  }
}
