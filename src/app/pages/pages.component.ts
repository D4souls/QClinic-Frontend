import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { initFlowbite } from 'flowbite';
import { AssistantComponent } from './assistant/assistant.component';

@Component({
  selector: 'app-pages',
  standalone: true,
  imports: [RouterOutlet, NavBarComponent, AssistantComponent],
  templateUrl: './pages.component.html',
  // styleUrl: './pages.component.css'
})
export class PagesComponent implements OnInit{

  token = localStorage.getItem('token');
  role = localStorage.getItem('role');

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
