import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

// FLOWBITE
import { InstanceOptions, Modal, ModalOptions } from 'flowbite';
@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent implements OnInit{

  router = inject(Router);

  ngOnInit(): void {
    this.changeButton()
  }

  changeButton(): void {

    const darkMode = document.getElementById('moon');
    const lightMode = document.getElementById('sun');

    const logoDark = document.getElementById('logoDark');
    const logoLight = document.getElementById('logoLight');

    lightMode?.classList.toggle('animate-rotate-in');
    darkMode?.classList.toggle('animate-rotate-in');

    if (localStorage.getItem("darkModePrefer") === 'true'){

      darkMode?.classList.remove('animate-rotate-in');
      lightMode?.classList.add('animate-rotate-in');

      darkMode!.style.display = 'none';
      lightMode!.style.display = 'block';

      logoLight!.style.display = 'none';
      logoDark!.style.display = 'block';

    } else {

      darkMode?.classList.add('animate-rotate-in');
      lightMode?.classList.remove('animate-rotate-in');
      
      darkMode!.style.display = 'block';
      lightMode!.style.display = 'none';
    }
  }

  changeMode(): void{

    const darkMode = document.getElementById('moon');
    const lightMode = document.getElementById('sun');

    const darkModeMobile = document.getElementById('moon-mobile');
    const lightModeMobile = document.getElementById('sun-mobile');

    const logoDark = document.getElementById('logoDark');
    const logoLight = document.getElementById('logoLight');
    
    document.body.classList.toggle('dark');

    lightMode?.classList.toggle('animate-rotate-in');
    darkMode?.classList.toggle('animate-rotate-in');

    lightModeMobile?.classList.toggle('animate-rotate-in');
    darkModeMobile?.classList.toggle('animate-rotate-in');
    
    if(darkMode!.style.display !== 'none') {
      localStorage.setItem("darkModePrefer", "true");

      darkMode!.style.display = 'none';
      lightMode!.style.display = 'block';

      darkModeMobile!.style.display = 'none';
      lightModeMobile!.style.display = 'block';

      logoLight!.style.display = 'none';
      logoDark!.style.display = 'block';

    } else {
      localStorage.setItem("darkModePrefer", "false");

      darkMode!.style.display = 'block';
      lightMode!.style.display = 'none';

      darkModeMobile!.style.display = 'block';
      lightModeMobile!.style.display = 'none';

      logoLight!.style.display = 'block';
      logoDark!.style.display = 'none';
    }

  }

  logout(): void {

    const $targetEl = document.getElementById('mobile-navbar');
  
    // Modal Options
    const options: ModalOptions = {
      placement: 'bottom-right',
      backdrop: 'dynamic',
      backdropClasses: 'bg-gray-900/50 dark:bg-gray-900/80 fixed inset-0 z-40',
      closable: true,
    };
    
    // Modal instance options
    const instanceOptions: InstanceOptions = {
      id: 'new-appointment',
      override: true
    };

    const modal: Modal = new Modal($targetEl, options, instanceOptions);

    modal.hide();

    localStorage.removeItem('token');
    this.router.navigate(["/login"]);
    
  }

  openNavbar(): void {
    const $targetEl = document.getElementById('mobile-navbar');
  
    // Modal Options
    const options: ModalOptions = {
      placement: 'bottom-right',
      backdrop: 'dynamic',
      backdropClasses: 'bg-gray-900/50 dark:bg-gray-900/80 fixed inset-0 z-40',
      closable: true,
    };
    
    // Modal instance options
    const instanceOptions: InstanceOptions = {
      id: 'new-appointment',
      override: true
    };

    const modal: Modal = new Modal($targetEl, options, instanceOptions);

    modal.show();
  }

  //? NEED LOGIN DATA TO USE THIS

  // data: any = [];

  // constructor(
  //   public patientApiService: PatientApiService,
  // ){}

  // ngOnInit(): void {
  //   this.getUserName();
  // }

  // getUserName(): void {
  //   this.patientApiService.getPatientData().subscribe((data: any) => {
  //     console.log(data);
  //     this.data = data;
  //   });
  // }

  
}
