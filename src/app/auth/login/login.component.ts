import { Component, OnInit, inject } from '@angular/core';
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
export class LoginComponent implements OnInit{
  
  api = inject(ApiService);
  router = inject(Router);

  ngOnInit(): void {
    document.body.classList.remove('dark');
  }

  formLogin = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', Validators.required),
  })

  login(): void{

    const dataLogin = {
      username: this.formLogin.value.username,
      passwd: this.formLogin.value.password
    }

    // console.log(dataLogin);

    this.api.login(dataLogin).subscribe((data: any) => {
      // console.log(data);
      if (data.status != 200) {
        Swal.fire({
          timer: 4000,
          position: "bottom",
          timerProgressBar: true,
          showConfirmButton: false,
          text: 'Password or username invalid...',
          icon: 'error',
          toast: true
        })

      } else {
        localStorage.setItem('token', data.res.token);
        localStorage.setItem('role', data.res.role);
        this.router.navigate(['/']);
      }
    }, (error: any) =>{
      Swal.fire({
        timer: 4000,
        position: "bottom",
        timerProgressBar: true,
        showConfirmButton: false,
        text: error.error.message,
        icon: 'error',
        toast: true
      })
    });
    

  }

  showPassword(): void {

    const showPassword = document.getElementById('openEye');
    const noShowPassword = document.getElementById('closeEye');

    const inputPassword = document.getElementById('passwd');

    if (showPassword?.style.display == 'none') {

      inputPassword?.setAttribute('type', 'text');
      
      showPassword!.style.display = 'block';
      noShowPassword!.style.display = 'none';

      
      noShowPassword!.classList.remove('animate-pop');
      showPassword!.classList.add('animate-pop');

    } else {

      inputPassword?.setAttribute('type', 'password');

      showPassword!.style.display = 'none';
      noShowPassword!.style.display = 'block';

      noShowPassword!.classList.add('animate-pop');
      showPassword!.classList.remove('animate-pop');
    }

  }

}
