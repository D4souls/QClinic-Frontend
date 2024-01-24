import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [],
  templateUrl: './patients.component.html',
  styleUrl: './patients.component.css'
})
export class PatientsComponent{
  name: string = "";

  httpClient = inject(HttpClient);
  data: any = [];

  ngOnInit(): void {
    this.getUser();
  }

  getUser(): void {
    this.httpClient.get('http://localhost/api/patients.php')
      .subscribe((data: any) => {
        console.log(data);
        this.data = data;
      });
  };
}
