import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

//provjerava da li trenutna rola korisnika ima pristup odredjenoj ruti
export const roleGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const requiredRoles = route.data['roles'];
  const userRole = authService.getUserRole();

  if (!requiredRoles.includes(userRole)) {
    router.navigate(['/login']); //TODO: Ovdje bi trebalo neku not found stranicu
    return false;
  }

  return true;
};
