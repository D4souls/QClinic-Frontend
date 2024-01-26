import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModifyUserService {

  constructor() { }

  userDNI: any[] = [];

  shareData(obj: Object){
    this.userDNI.pop();
    this.userDNI.push(obj);
  }
}
