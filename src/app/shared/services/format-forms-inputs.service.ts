import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FormatFormsInputsService {

  constructor() { }

  // Format DNI letter
  formatDNI(dni:string):string {
    const formatLetter = dni[8].toUpperCase();
    return dni.slice(0,8) + formatLetter;
  }


  // Format input text toUpperCase()
  formatTextToUpper(text:string):string {

    const splitText = text.split(" ");

    if (splitText.length > 1) {

      const firstTextPart = splitText[0][0].toUpperCase() + splitText[0].slice(1, splitText[0].length);
      const secondTextPart = splitText[1][0].toUpperCase() + splitText[1].slice(1, splitText[1].length);

      return firstTextPart + " " + secondTextPart;

    } else {
      return text[0].toUpperCase() + text.slice(1, text.length);
    }

  }

}
