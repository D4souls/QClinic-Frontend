import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {

  changeMode(): void{

    const darkMode = document.getElementById('moon');
    const lightMode = document.getElementById('sun');
    
    document.body.classList.toggle('dark');

    lightMode?.classList.toggle('animate-rotate-in');
    darkMode?.classList.toggle('animate-rotate-in');
    
    if(darkMode!.style.display !== 'none'){
      darkMode!.style.display = 'none';
      lightMode!.style.display = 'block';
    } else {
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
