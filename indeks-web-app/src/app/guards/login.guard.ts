import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const loginGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    const role = authService.getUserRole()?.toUpperCase();
    switch (role) {
      case 'ADMIN':
        router.navigate(['/admin']);
        break;
      case 'STUDENT':
        router.navigate(['/student']);
        break;
      default:
        authService.logout();
        break;
    }
    return false;
  }

  return true;
};
