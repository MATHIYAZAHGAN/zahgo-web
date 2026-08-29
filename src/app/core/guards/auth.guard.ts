import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

/**
 * Lightweight JWT expiry check (no signature verification — that is
 * the backend's job). Guards pass when a valid-looking, unexpired
 * session exists so expired sessions don't slip through to API calls.
 */
function isTokenExpired(token: string | null): boolean {
  if (!token) return true;

  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false; // not JWT-shaped; let backend decide

    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    if (!payload.exp) return false;

    return payload.exp * 1000 <= Date.now();
  } catch {
    return false; // malformed payload → don't block; backend will reject
  }
}

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const notificationService = inject(NotificationService);

  if (authService.isAuthenticated() && !isTokenExpired(authService.accessToken())) {
    return true;
  }

  // Expired/absent session → silently redirect; the auth interceptor will
  // attempt a token refresh on the next API call, so we don't force-logout here.
  notificationService.info('Authentication Required', 'Please log in to access this page.');
  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};