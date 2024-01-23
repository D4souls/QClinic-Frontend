import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {
  name: string = "";

  httpClient = inject(HttpClient);
  data: any = {};

  ngOnInit(): void {
    this.getUser();
  }

  getUser(): void {
    this.httpClient.get('http://localhost/api/example.json')
      .subscribe((data: any) => {
        console.log(data);
        this.data = data;
        this.name = data[0].firstname;
      });
  };
}
