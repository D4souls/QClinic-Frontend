import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const roleGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const role = localStorage.getItem('role');

  switch (role) {

    case "1":
      return true

    case "2":
      router.navigate(["/portal"]);
      return false

    default:
      return false

  }
};
