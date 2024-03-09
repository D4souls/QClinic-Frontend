import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const JWTGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);

  const token = localStorage.getItem('token');

  if(!token){
    router.navigate(['/login']);
    return false;
  }
  return true;

};
