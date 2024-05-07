import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const patientChildrenComponentGuard: CanActivateFn = (route, state) => {
  
  const router = inject(Router);

  const dniPatient = route.paramMap.get('dniPatient');
    if (!dniPatient) {
      router.navigate(['/patient']);
      return false;
    }
    return true;

};
