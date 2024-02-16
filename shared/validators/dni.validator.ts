import { AbstractControl, ValidationErrors } from '@angular/forms';

export function dniValidator(control: AbstractControl): ValidationErrors | null {
  
  const dniRegex = /^\d{8}[a-zA-Z]$/;

  const isValid = dniRegex.test(control.value);

  return isValid ? null : { invalidDNI: true };
}