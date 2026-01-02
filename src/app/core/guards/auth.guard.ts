import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { isTokenValid } from '../utils/TokenValidation';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('access_token');

  // Checa se o token existe e se a data de expiração ainda não passou
  if (token && isTokenValid(token)) {
    return true;
  } else {
    // Se o token estiver expirado ou não existir, limpa para evitar loops
    localStorage.removeItem('access_token');
    router.navigate(['/login']);
    return false;
  }
};
