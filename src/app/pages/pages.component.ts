import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-pages',
  standalone: true,
  imports: [RouterOutlet, NavBarComponent],
  templateUrl: './pages.component.html',
  // styleUrl: './pages.component.css'
})
export class PagesComponent implements OnInit{

  token = localStorage.getItem('token');

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
