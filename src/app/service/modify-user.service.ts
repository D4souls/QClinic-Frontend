import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModifyUserService {

  constructor() { }

  userDNI: string[] = [];

  shareData(obj: string){
    this.userDNI.pop();
    this.userDNI.push(obj);
  }
}
