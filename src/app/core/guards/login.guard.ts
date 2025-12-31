// login.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const loginGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('access_token');

  // Se já tem token, manda para a home
  if (token) {
    router.navigate(['/home']);
    return false;
  }
  return true;
};
