import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModifyUserService {

  constructor() { }

  userDNI: any[] = [];

  shareData(dni: string){
    this.userDNI.pop();
    this.userDNI.push(dni);
  }
}
