import { HttpInterceptorFn } from '@angular/common/http';
import { inject, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const notificationService = inject(NotificationService);
  const injector = inject(Injector);

  // Get token directly from localStorage to prevent Angular NG0200 Circular Dependency
  const token = localStorage.getItem('zah_access_token');

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
      // Do not attempt token refresh for auth endpoints to prevent loops
      if (req.url.includes('/auth/logout') || req.url.includes('/auth/refresh-token')) {
        return throwError(() => error);
      }

      if (error.status === 401 && localStorage.getItem('zah_refresh_token')) {
        const authService = injector.get(AuthService);
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
        const authService = injector.get(AuthService);
        authService.logout();
        router.navigate(['/login']);
        notificationService.error('Session Expired', 'Please log in again to continue.');
      } else if (error.status === 403) {
        notificationService.error('Access Denied', 'You do not have permission to access this resource.');
      } else if (error.status === 429) {
        notificationService.error('Too Many Attempts', 'Please wait a moment before trying again.');
      }
      
      return throwError(() => error);
    })
  );
};
