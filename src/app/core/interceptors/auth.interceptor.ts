import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const notificationService = inject(NotificationService);

  // Get the auth token
  const token = authService.getAuthToken();

  // Clone request and add authorization header if token exists
  let authReq = req;
  if (token && !req.url.includes('/auth/login') && !req.url.includes('/auth/register') && !req.url.includes('/auth/refresh-token')) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // Handle the request and catch errors
  return next(authReq).pipe(
    catchError((error) => {
      if (error.status === 401 && !req.url.includes('/auth/refresh-token') && localStorage.getItem('zah_refresh_token')) {
        return authService.refreshAccessToken().pipe(
          switchMap(newToken => {
            if (!newToken) return throwError(() => error);
            return next(req.clone({ setHeaders: { Authorization: `Bearer ${newToken}` } }));
          }),
          catchError(refreshError => {
            authService.logout();
            router.navigate(['/login']);
            notificationService.error('Session Expired', 'Please sign in again to continue.');
            return throwError(() => refreshError);
          })
        );
      }

      if (error.status === 401) {
        // Unauthorized - clear session and redirect to login
        authService.logout();
        router.navigate(['/login']);
        notificationService.error('Session Expired', 'Please log in again to continue.');
      } else if (error.status === 403) {
        // Forbidden - user doesn't have permission
        notificationService.error('Access Denied', 'You do not have permission to access this resource.');
      } else if (error.status === 429) {
        // Too many requests - rate limited
        notificationService.error('Too Many Attempts', 'Please wait a moment before trying again.');
      }
      
      return throwError(() => error);
    })
  );
};
