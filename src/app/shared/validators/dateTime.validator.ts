import { AbstractControl, ValidationErrors } from '@angular/forms';

export function dateTimeValidator(control: AbstractControl): ValidationErrors | null {
  
  const inputDate = new Date(control.value);
  const now = new Date();

  if (inputDate <= now){
    return {datetime: true}
  }

  return null;

  
}