import { AbstractControl, ValidationErrors } from '@angular/forms';

export function dateValidator(control: AbstractControl): ValidationErrors | null {
  
  const inputDate = new Date(control.value);
  const now = new Date();

  inputDate.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);

  if (inputDate < now){
    return {datetime: true}
  }

  return null;

  
}