import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent implements OnInit{

  ngOnInit(): void {
    this.changeButton()
  }

  changeButton(): void {

    const darkMode = document.getElementById('moon');
    const lightMode = document.getElementById('sun');

    lightMode?.classList.toggle('animate-rotate-in');
    darkMode?.classList.toggle('animate-rotate-in');

    if (localStorage.getItem("darkModePrefer") === 'true'){

      darkMode?.classList.remove('animate-rotate-in');
      lightMode?.classList.add('animate-rotate-in');

      darkMode!.style.display = 'none';
      lightMode!.style.display = 'block';

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
    
    document.body.classList.toggle('dark');

    lightMode?.classList.toggle('animate-rotate-in');
    darkMode?.classList.toggle('animate-rotate-in');
    
    if(darkMode!.style.display !== 'none') {
      localStorage.setItem("darkModePrefer", "true");
      darkMode!.style.display = 'none';
      lightMode!.style.display = 'block';
    } else {
      localStorage.setItem("darkModePrefer", "false");
      darkMode!.style.display = 'block';
      lightMode!.style.display = 'none';
    }

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
