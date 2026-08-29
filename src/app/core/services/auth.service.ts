import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of, map, BehaviorSubject } from 'rxjs';
import { User, Address } from '../models/user.model';
import { NotificationService } from './notification.service';
import { getFriendlyErrorMessage } from './error-message.service';
import { environment } from '../../../environments/environment';

interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    userId: string;
    name: string;
    email: string;
    phone?: string;
    accessToken: string;
    refreshToken: string;
    expiresAt: string;
    rewardPoints: number;
    addresses?: Address[];
  };
}

interface OtpResponse {
  success: boolean;
  message: string;
  data?: {
    expiresAt: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private notificationService = inject(NotificationService);
  private apiUrl = `${environment.apiUrl}/auth`;

  readonly currentUser = signal<User | null>(null);
  readonly isAuthenticated = computed(() => this.currentUser() !== null);
  readonly accessToken = signal<string | null>(null);
  readonly loading = signal<boolean>(false);
  readonly errorMessage = signal<string | null>(null);

  constructor() {
    // Load user from localStorage on init
    const savedUser = localStorage.getItem('zah_user');
    const savedToken = localStorage.getItem('zah_access_token');
    
    if (savedUser && savedToken) {
      try {
        this.currentUser.set(JSON.parse(savedUser));
        this.accessToken.set(savedToken);
        // Load current user from backend to verify session
        this.loadCurrentUser().subscribe();
      } catch (e) {
        console.error('Failed to parse user session:', e);
        this.logout();
      }
    }

    // Save to localStorage when user changes
    effect(() => {
      const user = this.currentUser();
      const token = this.accessToken();
      
      if (user && token) {
        localStorage.setItem('zah_user', JSON.stringify(user));
        localStorage.setItem('zah_access_token', token);
      } else {
        localStorage.removeItem('zah_user');
        localStorage.removeItem('zah_access_token');
        localStorage.removeItem('zah_refresh_token');
      }
    });
  }

  login(email: string, password: string): Observable<boolean> {
    this.loading.set(true);
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(response => {
        if (response.success && response.data) {
          const user: User = {
            id: response.data.userId,
            name: response.data.name,
            email: response.data.email,
            phone: response.data.phone,
            rewardPoints: response.data.rewardPoints,
            addresses: response.data.addresses || []
          };

          this.currentUser.set(user);
          this.accessToken.set(response.data.accessToken);
          localStorage.setItem('zah_refresh_token', response.data.refreshToken);

          this.notificationService.success('Welcome Back!', `Logged in successfully as ${user.name}`);
        }
        this.loading.set(false);
      }),
      map(() => true),
      catchError(error => {
        this.loading.set(false);
        console.error('Login error:', error);
        const message = getFriendlyErrorMessage(error, 'Invalid email or password');
        this.notificationService.error('Login Failed', message);
        return of(false);
      })
    );
  }

  register(name: string, email: string, phone: string, password: string): Observable<boolean> {
    this.loading.set(true);
    this.errorMessage.set(null);
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, { 
      name, 
      email, 
      phone, 
      password 
    }).pipe(
      tap(response => {
        if (response.success && response.data) {
          const user: User = {
            id: response.data.userId,
            name: response.data.name,
            email: response.data.email,
            phone: response.data.phone,
            rewardPoints: response.data.rewardPoints,
            addresses: response.data.addresses || []
          };
          
          this.currentUser.set(user);
          this.accessToken.set(response.data.accessToken);
          localStorage.setItem('zah_refresh_token', response.data.refreshToken);
          
          this.notificationService.success('Account Created!', 'Welcome to the ZAH luxury platform.');
        }
        this.loading.set(false);
      }),
      map(() => true),
      catchError(error => {
        this.loading.set(false);
        console.error('Registration error:', error);
        const message = getFriendlyErrorMessage(error, 'Registration failed. Please try again.');
        this.errorMessage.set(message);
        this.notificationService.error('Registration Failed', message);
        return of(false);
      })
    );
  }

  // Load current user from backend
  loadCurrentUser(): Observable<boolean> {
    const token = this.accessToken();
    if (!token) return of(false);

    return this.http.get<AuthResponse>(`${this.apiUrl}/me`).pipe(
      tap(response => {
        if (response.success && response.data) {
          const user: User = {
            id: response.data.userId,
            name: response.data.name,
            email: response.data.email,
            phone: response.data.phone,
            rewardPoints: response.data.rewardPoints,
            addresses: response.data.addresses || []
          };
          this.currentUser.set(user);
        }
      }),
      map(response => response.success),
      catchError(error => {
        // Only treat an explicit 401/403 as an invalid session.
        // Network errors (offline, 5xx) keep the local session so the
        // user isn't unexpectedly signed out during a temporary outage.
        if (error?.status === 401 || error?.status === 403) {
          this.logout();
        }
        return of(false);
      })
    );
  }

  // Send OTP to phone number
  sendOtp(phone: string): Observable<boolean> {
    this.loading.set(true);
    return this.http.post<OtpResponse>(`${this.apiUrl}/send-otp`, { phone }).pipe(
      tap(response => {
        this.loading.set(false);
        if (response.success) {
          this.notificationService.success('OTP Sent!', 'Check your phone for the verification code.');
        }
      }),
      map(response => response.success),
      catchError(error => {
        this.loading.set(false);
        console.error('Send OTP error:', error);
        const message = getFriendlyErrorMessage(error, 'Failed to send OTP. Please try again.');
        this.notificationService.error('OTP Failed', message);
        return of(false);
      })
    );
  }

  // Verify OTP and authenticate
  verifyOtp(phone: string, otp: string): Observable<boolean> {
    this.loading.set(true);
    return this.http.post<AuthResponse>(`${this.apiUrl}/verify-otp`, { phone, otp }).pipe(
      tap(response => {
        if (response.success && response.data) {
          const user: User = {
            id: response.data.userId,
            name: response.data.name,
            email: response.data.email,
            phone: response.data.phone,
            rewardPoints: response.data.rewardPoints,
            addresses: []
          };
          
          this.currentUser.set(user);
          this.accessToken.set(response.data.accessToken);
          localStorage.setItem('zah_refresh_token', response.data.refreshToken);
          
          this.notificationService.success('Welcome!', `Logged in successfully as ${user.name}`);
        }
        this.loading.set(false);
      }),
      map(() => true),
      catchError(error => {
        this.loading.set(false);
        console.error('Verify OTP error:', error);
        const message = getFriendlyErrorMessage(error, 'Invalid OTP. Please try again.');
        this.notificationService.error('Verification Failed', message);
        return of(false);
      })
    );
  }

  // Google Sign-In via Firebase
  loginWithGoogle(payload: { email: string; name: string; firebaseUid?: string; photoUrl?: string; idToken?: string }): Observable<boolean> {
    this.loading.set(true);
    return this.http.post<AuthResponse>(`${this.apiUrl}/google-login`, payload).pipe(
      tap(response => {
        if (response.success && response.data) {
          const user: User = {
            id: response.data.userId,
            name: response.data.name,
            email: response.data.email,
            phone: response.data.phone,
            rewardPoints: response.data.rewardPoints,
            addresses: response.data.addresses || []
          };
          
          this.currentUser.set(user);
          this.accessToken.set(response.data.accessToken);
          localStorage.setItem('zah_refresh_token', response.data.refreshToken);
          
          this.notificationService.success('Welcome to ZAH!', `Signed in with Google as ${user.name}`);
        }
        this.loading.set(false);
      }),
      map(() => true),
      catchError(error => {
        this.loading.set(false);
        console.error('Google Sign-In error:', error);
        const message = getFriendlyErrorMessage(error, 'Google Sign-In failed. Please try again.');
        this.notificationService.error('Sign-In Failed', message);
        return of(false);
      })
    );
  }

  // Forgot password - request reset
  forgotPassword(email: string): Observable<boolean> {
    this.loading.set(true);
    return this.http.post<{ success: boolean; message: string }>(`${this.apiUrl}/forgot-password`, { email }).pipe(
      tap(response => {
        this.loading.set(false);
        if (response.success) {
          this.notificationService.success('Reset Email Sent!', 'Check your email for password reset instructions.');
        }
      }),
      map(response => response.success),
      catchError(error => {
        this.loading.set(false);
        console.error('Forgot password error:', error);
        const message = getFriendlyErrorMessage(error, 'Failed to send reset email.');
        this.notificationService.error('Reset Failed', message);
        return of(false);
      })
    );
  }

  // Reset password with token
  resetPassword(token: string, newPassword: string): Observable<boolean> {
    this.loading.set(true);
    return this.http.post<{ success: boolean; message: string }>(`${this.apiUrl}/reset-password`, { 
      token, 
      newPassword 
    }).pipe(
      tap(response => {
        this.loading.set(false);
        if (response.success) {
          this.notificationService.success('Password Reset!', 'Your password has been updated successfully.');
        }
      }),
      map(response => response.success),
      catchError(error => {
        this.loading.set(false);
        console.error('Reset password error:', error);
        const message = getFriendlyErrorMessage(error, 'Failed to reset password.');
        this.notificationService.error('Reset Failed', message);
        return of(false);
      })
    );
  }

  logout(): void {
    const refreshToken = localStorage.getItem('zah_refresh_token');
    if (refreshToken) {
      this.http.post(`${this.apiUrl}/logout`, { refreshToken }).pipe(
        catchError(() => of(null))
      ).subscribe();
    }

    localStorage.removeItem('zah_user');
    localStorage.removeItem('zah_access_token');
    localStorage.removeItem('zah_refresh_token');
    this.currentUser.set(null);
    this.accessToken.set(null);
    this.notificationService.info('Logged Out', 'You have been safely signed out.');
  }

  getAuthToken(): string | null {
    return this.accessToken();
  }

  refreshAccessToken(): Observable<string | null> {
    const refreshToken = localStorage.getItem('zah_refresh_token');
    if (!refreshToken) return of(null);

    return this.http.post<AuthResponse>(`${this.apiUrl}/refresh-token`, { refreshToken }).pipe(
      map(response => {
        if (!response.success || !response.data) return null;
        this.accessToken.set(response.data.accessToken);
        localStorage.setItem('zah_refresh_token', response.data.refreshToken);
        return response.data.accessToken;
      }),
      catchError(() => of(null))
    );
  }

  addAddress(address: Omit<Address, 'id'>): Observable<Address | null> {
    const user = this.currentUser();
    if (!user) {
      this.notificationService.error('Sign In Required', 'Please sign in before saving an address.');
      return of(null);
    }

    return this.http.post<{ success: boolean; data: Address }>(`${this.apiUrl}/addresses`, address).pipe(
      tap(response => {
        if (response.success && response.data) {
          const addresses = address.isDefault
            ? user.addresses.map(item => ({ ...item, isDefault: false }))
            : [...user.addresses];
          this.currentUser.set({ ...user, addresses: [response.data, ...addresses] });
          this.notificationService.success('Address Added', 'New shipping address saved.');
        }
      }),
      map(response => response.success ? response.data : null),
      catchError(error => {
        this.notificationService.error('Address Failed', getFriendlyErrorMessage(error, 'Could not save this address.'));
        return of(null);
      })
    );
  }

  deleteAddress(id: string): Observable<boolean> {
    const user = this.currentUser();
    if (!user) return of(false);

    return this.http.delete<{ success: boolean }>(`${this.apiUrl}/addresses/${id}`).pipe(
      tap(response => {
        if (response.success) {
          this.currentUser.set({ ...user, addresses: user.addresses.filter(item => item.id !== id) });
          this.notificationService.info('Address Deleted', 'Saved address removed.');
        }
      }),
      map(response => response.success),
      catchError(error => {
        this.notificationService.error('Delete Failed', getFriendlyErrorMessage(error, 'Could not delete this address.'));
        return of(false);
      })
    );
  }
}
