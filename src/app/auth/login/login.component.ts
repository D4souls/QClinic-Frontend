import { Component, inject } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  
  api = inject(ApiService);
  router = inject(Router)

  formLogin = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', Validators.required),
  })

  login(): void{

    const dataLogin = {
      user: this.formLogin.value.username,
      password: this.formLogin.value.password,
    }

    console.log(dataLogin);

    this.api.login(dataLogin).subscribe((data: any) => {

      if(!data.token){
        console.error(data.message)

        Swal.fire({
          title: 'Error',
          text: data.message.error,
          icon: 'error',
        })

      }

      localStorage.setItem('token', data.token);

      this.router.navigate(['/']);

    })

  }

}
