import { AbstractControl, ValidationErrors } from '@angular/forms';

export function textValidator(control: AbstractControl): ValidationErrors | null {
    const regex = new RegExp('^[a-zA-ZÀ-ÿ, ]+$');

    const checkTextFormat = regex.test(control.value);

    return checkTextFormat ? null : { invalidTextFormat: true};
}