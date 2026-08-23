import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'zah-auth',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="zah-container auth-page">
      <div class="auth-card zah-card animate-slide-up">
        <!-- Auth View Switcher -->
        <div class="auth-tabs">
          <button [class.active]="mode() === 'login'" (click)="mode.set('login')">Sign In</button>
          <button [class.active]="mode() === 'register'" (click)="mode.set('register')">Create Account</button>
        </div>

        @if (mode() === 'login') {
          <form (ngSubmit)="onLogin()" class="auth-form">
            <h2>Welcome Back to ZAH</h2>
            <p class="sub">Enter your account credentials to access your luxury bag & orders.</p>

            <div class="input-group">
              <label>Email Address</label>
              <input type="email" placeholder="name@domain.com" [(ngModel)]="email" name="email" required />
            </div>

            <div class="input-group">
              <label>Password</label>
              <input type="password" placeholder="••••••••" [(ngModel)]="password" name="password" required />
            </div>

            <div class="form-row">
              <button type="button" class="forgot-btn" (click)="mode.set('forgot')">Forgot Password?</button>
            </div>

            <button type="submit" class="zah-btn zah-btn-primary submit-btn">Sign In to ZAH</button>
          </form>
        }

        @if (mode() === 'register') {
          <form (ngSubmit)="onRegister()" class="auth-form">
            <h2>Join ZAH Luxury</h2>
            <p class="sub">Unlock exclusive rewards, fast checkout, and personalized drops.</p>

            <div class="input-group">
              <label>Full Name</label>
              <input type="text" placeholder="Siddharth V." [(ngModel)]="name" name="name" required />
            </div>

            <div class="input-group">
              <label>Email Address</label>
              <input type="email" placeholder="name@domain.com" [(ngModel)]="email" name="email" required />
            </div>

            <div class="input-group">
              <label>Phone Number</label>
              <input type="text" placeholder="+91 98765 43210" [(ngModel)]="phone" name="phone" required />
            </div>

            <div class="input-group">
              <label>Password</label>
              <input type="password" placeholder="••••••••" [(ngModel)]="password" name="password" required minlength="6" />
            </div>

            <button type="submit" class="zah-btn zah-btn-accent submit-btn">Create Account</button>
          </form>
        }

        @if (mode() === 'forgot') {
          <div class="auth-form">
            <h2>Reset Password</h2>
            <p class="sub">Enter your email to receive an OTP verification code.</p>

            <div class="input-group">
              <label>Email Address</label>
              <input type="email" placeholder="name@domain.com" [(ngModel)]="email" />
            </div>

            <button class="zah-btn zah-btn-primary submit-btn" (click)="onForgot()">Send Verification OTP</button>
            <button class="zah-btn zah-btn-ghost back-btn" (click)="mode.set('login')">← Back to Sign In</button>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .auth-page { padding-top: 3rem; padding-bottom: 5rem; display: flex; justify-content: center; }
    .auth-card { max-width: 440px; width: 100%; padding: 2.5rem; }

    .auth-tabs {
      display: flex;
      border-bottom: 1px solid var(--zah-border);
      margin-bottom: 2rem;

      button {
        flex-grow: 1;
        padding: 0.75rem;
        font-size: 0.95rem;
        font-weight: 700;
        color: var(--zah-text-secondary);
        border-bottom: 2px solid transparent;

        &.active {
          color: var(--zah-text-primary);
          border-bottom-color: var(--zah-accent);
        }
      }
    }

    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 1.15rem;

      h2 { font-size: 1.5rem; font-weight: 800; margin: 0; }
      .sub { font-size: 0.875rem; color: var(--zah-text-muted); margin: 0 0 0.5rem 0; line-height: 1.4; }
    }

    .input-group {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;

      label { font-size: 0.8125rem; font-weight: 600; color: var(--zah-text-secondary); }
      input { padding: 0.65rem 0.85rem; border-radius: var(--zah-radius-md); border: 1px solid var(--zah-border-strong); background: var(--zah-surface); color: var(--zah-text-primary); font-size: 0.9rem; }
    }

    .form-row { display: flex; justify-content: flex-end; }
    .forgot-btn { font-size: 0.8125rem; color: var(--zah-accent); }
    .submit-btn { width: 100%; margin-top: 0.5rem; padding: 0.8rem; }
    .back-btn { width: 100%; margin-top: 0.5rem; }
  `]
})
export class AuthComponent implements OnInit {
  authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  mode = signal<'login' | 'register' | 'forgot'>('login');
  name = '';
  email = '';
  phone = '';
  password = '';

  ngOnInit() {
    this.route.url.subscribe(url => {
      const path = url[0]?.path;
      if (path === 'register') this.mode.set('register');
      else if (path === 'forgot-password') this.mode.set('forgot');
      else this.mode.set('login');
    });
  }

  onLogin() {
    if (this.email && this.password) {
      this.authService.login(this.email, this.password).subscribe(success => {
        if (success) {
          this.router.navigate(['/account']);
        }
      });
    }
  }

  onRegister() {
    if (this.email && this.name && this.password) {
      this.authService.register(this.name, this.email, this.phone, this.password).subscribe(success => {
        if (success) {
          this.router.navigate(['/account']);
        }
      });
    }
  }

  onForgot() {
    if (this.email) {
      this.mode.set('login');
    }
  }
}
