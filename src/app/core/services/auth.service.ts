import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of, map } from 'rxjs';
import { User, Address } from '../models/user.model';
import { NotificationService } from './notification.service';
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

  constructor() {
    // Load user from localStorage on init
    const savedUser = localStorage.getItem('zah_user');
    const savedToken = localStorage.getItem('zah_access_token');
    
    if (savedUser && savedToken) {
      try {
        this.currentUser.set(JSON.parse(savedUser));
        this.accessToken.set(savedToken);
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
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
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
          
          this.notificationService.success('Welcome Back!', `Logged in successfully as ${user.name}`);
        }
      }),
      map(() => true),
      catchError(error => {
        console.error('Login error:', error);
        const message = error.error?.message || 'Invalid email or password';
        this.notificationService.error('Login Failed', message);
        return of(false);
      })
    );
  }

  register(name: string, email: string, phone: string, password: string): Observable<boolean> {
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
            addresses: []
          };
          
          this.currentUser.set(user);
          this.accessToken.set(response.data.accessToken);
          localStorage.setItem('zah_refresh_token', response.data.refreshToken);
          
          this.notificationService.success('Account Created!', 'Welcome to the ZAH luxury platform.');
        }
      }),
      map(() => true),
      catchError(error => {
        console.error('Registration error:', error);
        const message = error.error?.message || 'Registration failed. Please try again.';
        this.notificationService.error('Registration Failed', message);
        return of(false);
      })
    );
  }

  logout(): void {
    this.currentUser.set(null);
    this.accessToken.set(null);
    this.notificationService.info('Logged Out', 'You have been safely signed out.');
  }

  getAuthToken(): string | null {
    return this.accessToken();
  }

  addAddress(address: Omit<Address, 'id'>): void {
    const user = this.currentUser();
    if (!user) return;
    
    const newAddress: Address = {
      ...address,
      id: `addr-${Date.now()}`
    };

    const updatedAddresses = address.isDefault
      ? user.addresses.map(a => ({ ...a, isDefault: false }))
      : [...user.addresses];

    this.currentUser.set({
      ...user,
      addresses: [newAddress, ...updatedAddresses]
    });

    this.notificationService.success('Address Added', 'New shipping address saved.');
  }

  deleteAddress(id: string): void {
    const user = this.currentUser();
    if (!user) return;

    this.currentUser.set({
      ...user,
      addresses: user.addresses.filter(a => a.id !== id)
    });
    this.notificationService.info('Address Deleted', 'Saved address removed.');
  }
}
