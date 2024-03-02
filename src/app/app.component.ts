import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBarComponent } from './pages/nav-bar/nav-bar.component';
import { HttpClientModule } from '@angular/common/http';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavBarComponent, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{

  title = 'consultorio-medico';

  ngOnInit(): void {
    initFlowbite();
    this.setMode();
  }

  setMode(): void {

    if (localStorage.getItem("darkModePrefer") === 'true'){
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }

  }
}
