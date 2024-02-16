import { AbstractControl, ValidationErrors } from '@angular/forms';

export function phoneNumberValidator(control: AbstractControl): ValidationErrors | null {
    const regex = /^[679]{1}\d{8}$/;

    const checkPhone = regex.test(control.value);

    return checkPhone ? null : { invalidPhoneNumber: true};
}