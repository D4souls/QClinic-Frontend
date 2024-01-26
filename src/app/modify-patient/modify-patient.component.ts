import { Component, OnInit } from '@angular/core';
import { ModifyUserService } from '../service/modify-user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modify-patient',
  standalone: true,
  imports: [],
  templateUrl: './modify-patient.component.html',
  styleUrl: './modify-patient.component.css'
})
export class ModifyPatientComponent implements OnInit{
  
  load: boolean = false;

  constructor(public modifyUserService: ModifyUserService, private router: Router) {};

  ngOnInit(): void {
    console.log(this.modifyUserService.userDNI.length);
    this.chekData();
  }

  chekData():void {
    if(this.modifyUserService.userDNI.length > 0){
      this.load = true;
    } else {
      this.router.navigate(['/patients']);
    }
  }

  discardChanges():void{
    this.router.navigate(['/patients']);
  }

  
}
