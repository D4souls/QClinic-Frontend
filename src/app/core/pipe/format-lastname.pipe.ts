import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatLastname',
  standalone: true
})
export class FormatLastnamePipe implements PipeTransform {

  transform(lastname: string): string {
    
    const parts = lastname.split(' ');

    let formattedLastName = '';

    if (parts.length > 0) {
      formattedLastName += parts[0].substring(0, 3);

      if (parts.length > 1) {
        formattedLastName += '. ';
        
        if (parts[1].length >= 2) {
          formattedLastName += parts[1].substring(0, 2);
        } else {
          formattedLastName += parts[1];
        }
      }
    }

    return formattedLastName;

  }

}
