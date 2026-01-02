// login.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { isTokenValid } from '../utils/TokenValidation';

export const loginGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('access_token');

  // Se o token existe e É VÁLIDO, manda para a home
  if (token && isTokenValid(token)) {
    router.navigate(['/home']);
    return false;
  }
  
  // Se não tem token ou está expirado, deixa o usuário acessar a tela de login
  return true;
};