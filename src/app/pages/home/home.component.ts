import { Component, inject, OnInit, signal } from '@angular/core';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NavBarComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{

  private _apiService = inject(ApiService);

  patientsStadistics = signal<any>([]);

  doctorsStadistics = signal<any>([]);

  appointmentsStadistics = signal<any>([]);

  moneyStadistics = signal<any>([]);

  token: string = localStorage.getItem('token')!;

  ngOnInit(): void {
    this.getStadistics();
  }

  getStadistics(){

    this._apiService.getPatientsStadistics(this.token).subscribe((patientsStadisticsRes: any) => {

      if (patientsStadisticsRes.status == 200){
        this.patientsStadistics.set(patientsStadisticsRes.res);
      }

    });

    this._apiService.getDoctorsStadistics(this.token).subscribe((doctorsStadisticsRes: any) => {

      if (doctorsStadisticsRes.status == 200){
        this.doctorsStadistics.set(doctorsStadisticsRes.res)
      }

    });

    this._apiService.getAppointmentsStadistics(this.token).subscribe((appointmentsStadisticsRes: any) => {

      if (appointmentsStadisticsRes.status == 200){
        this.appointmentsStadistics.set(appointmentsStadisticsRes.res)
      }

    });

  }

}
