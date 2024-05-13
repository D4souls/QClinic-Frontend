import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatTimes',
  standalone: true
})
export class FormatTimesPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return value;

    const [hours, minutes, seconds] = value.split(':');
    const formattedHours = parseInt(hours, 10);
    const period = formattedHours < 12 ? 'AM' : 'PM';
    const formattedHours12 = formattedHours % 12 || 12;

    return `${formattedHours12}:${minutes} ${period}`;
  }

}
