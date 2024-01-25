import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{

  time: any = {};

  ngOnInit(): void {
    this.showTime();

    setInterval(() => {
      this.showTime();
    }, 1000);
  }

  showTime() {
    let now: Date = new Date();

    this.time = {
      'hour': this.formatTime(now.getHours()),
      'minutes': this.formatTime(now.getMinutes()),
      'day': this.formatTime(now.getDate()),
      'month': this.formatTime(now.getMonth() + 1),
      'year': now.getFullYear()
    };
  }

  formatTime(value: number): string {
    return value < 10 ? `0${value}` : value.toString();
  }

}
