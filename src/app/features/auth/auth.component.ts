import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
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
          <button [class.active]="mode() === 'login'" (click)="switchMode('login')">Sign In</button>
          <button [class.active]="mode() === 'register'" (click)="switchMode('register')">Create Account</button>
        </div>

        @if (mode() === 'login') {
          <div class="auth-form">
            <h2>Welcome Back to ZAH</h2>
            <p class="sub">Enter your account credentials to access your luxury bags & orders.</p>

            <!-- Login Method Toggle -->
            <div class="login-methods">
              <button 
                type="button" 
                [class.active]="loginMethod() === 'email'" 
                (click)="loginMethod.set('email')"
                class="method-btn">
                Email & Password
              </button>
              <button 
                type="button" 
                [class.active]="loginMethod() === 'otp'" 
                (click)="loginMethod.set('otp')"
                class="method-btn">
                Mobile OTP
              </button>
            </div>

            @if (loginMethod() === 'email') {
              <form (ngSubmit)="onLogin()" #loginForm="ngForm">
                <div class="input-group">
                  <label>Email Address</label>
                  <input 
                    type="email" 
                    placeholder="name@domain.com" 
                    [(ngModel)]="email" 
                    name="email" 
                    required 
                    [disabled]="authService.loading()" />
                </div>

                <div class="input-group">
                  <label>Password</label>
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    [(ngModel)]="password" 
                    name="password" 
                    required 
                    [disabled]="authService.loading()" />
                </div>

                <div class="form-row">
                  <button type="button" class="forgot-btn" (click)="switchMode('forgot')">Forgot Password?</button>
                </div>

                <button 
                  type="submit" 
                  class="zah-btn zah-btn-primary submit-btn"
                  [disabled]="authService.loading() || !loginForm.valid">
                  @if (authService.loading()) {
                    <span>Signing In...</span>
                  } @else {
                    <span>Sign In to ZAH</span>
                  }
                </button>
              </form>
            }

            @if (loginMethod() === 'otp') {
              <div>
                @if (!otpSent()) {
                  <form (ngSubmit)="onSendOtp()" #otpForm="ngForm">
                    <div class="input-group">
                      <label>Phone Number</label>
                      <input 
                        type="tel" 
                        placeholder="+91 98765 43210" 
                        [(ngModel)]="phone" 
                        name="phone" 
                        required 
                        [disabled]="authService.loading()" />
                    </div>

                    <button 
                      type="submit" 
                      class="zah-btn zah-btn-primary submit-btn"
                      [disabled]="authService.loading() || !otpForm.valid || cooldownTime() > 0">
                      @if (authService.loading()) {
                        <span>Sending OTP...</span>
                      } @else if (cooldownTime() > 0) {
                        <span>Resend in {{ cooldownTime() }}s</span>
                      } @else {
                        <span>Send OTP</span>
                      }
                    </button>
                  </form>
                } @else {
                  <form (ngSubmit)="onVerifyOtp()" #verifyForm="ngForm">
                    <div class="input-group">
                      <label>Enter OTP sent to {{ phone }}</label>
                      <input 
                        type="text" 
                        placeholder="123456" 
                        [(ngModel)]="otp" 
                        name="otp" 
                        required 
                        maxlength="6"
                        [disabled]="authService.loading()" />
                    </div>

                    <div class="otp-actions">
                      <button 
                        type="submit" 
                        class="zah-btn zah-btn-primary submit-btn"
                        [disabled]="authService.loading() || !verifyForm.valid">
                        @if (authService.loading()) {
                          <span>Verifying...</span>
                        } @else {
                          <span>Verify OTP</span>
                        }
                      </button>

                      <button 
                        type="button" 
                        class="zah-btn zah-btn-ghost resend-btn"
                        [disabled]="cooldownTime() > 0 || authService.loading()"
                        (click)="onResendOtp()">
                        @if (cooldownTime() > 0) {
                          <span>Resend in {{ cooldownTime() }}s</span>
                        } @else {
                          <span>Resend OTP</span>
                        }
                      </button>

                      <button 
                        type="button" 
                        class="back-link"
                        (click)="resetOtpFlow()">
                        ← Change Phone Number
                      </button>
                    </div>
                  </form>
                }
              </div>
            }
          </div>
        }

        @if (mode() === 'register') {
          <form (ngSubmit)="onRegister()" class="auth-form" #registerForm="ngForm">
            <h2>Join ZAH Luxury</h2>
            <p class="sub">Unlock exclusive rewards, fast checkout, and personalized drops.</p>

            <div class="input-group">
              <label>Full Name</label>
              <input 
                type="text" 
                placeholder="Siddharth V." 
                [(ngModel)]="name" 
                name="name" 
                required 
                [disabled]="authService.loading()" />
            </div>

            <div class="input-group">
              <label>Email Address</label>
              <input 
                type="email" 
                placeholder="name@domain.com" 
                [(ngModel)]="email" 
                name="email" 
                required 
                [disabled]="authService.loading()" />
            </div>

            <div class="input-group">
              <label>Phone Number</label>
              <input 
                type="tel" 
                placeholder="+91 98765 43210" 
                [(ngModel)]="phone" 
                name="phone" 
                required 
                [disabled]="authService.loading()" />
            </div>

            <div class="input-group">
              <label>Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                [(ngModel)]="password" 
                name="password" 
                required 
                minlength="6"
                [disabled]="authService.loading()" />
            </div>

            @if (authService.errorMessage()) {
              <p class="form-error" role="alert">{{ authService.errorMessage() }}</p>
            }

            <button 
              type="submit" 
              class="zah-btn zah-btn-accent submit-btn"
              [disabled]="authService.loading() || !registerForm.valid">
              @if (authService.loading()) {
                <span>Creating Account...</span>
              } @else {
                <span>Create Account</span>
              }
            </button>
          </form>
        }

        @if (mode() === 'forgot') {
          <div class="auth-form">
            <h2>Reset Password</h2>
            <p class="sub">Enter your email to receive password reset instructions.</p>

            <form (ngSubmit)="onForgot()" #forgotForm="ngForm">
              <div class="input-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  placeholder="name@domain.com" 
                  [(ngModel)]="email" 
                  name="email" 
                  required 
                  [disabled]="authService.loading()" />
              </div>

              <button 
                type="submit"
                class="zah-btn zah-btn-primary submit-btn"
                [disabled]="authService.loading() || !forgotForm.valid">
                @if (authService.loading()) {
                  <span>Sending...</span>
                } @else {
                  <span>Send Reset Instructions</span>
                }
              </button>

              <button 
                type="button"
                class="zah-btn zah-btn-ghost back-btn" 
                (click)="switchMode('login')">
                ← Back to Sign In
              </button>
            </form>
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
      .form-error { color: var(--zah-danger); background: color-mix(in srgb, var(--zah-danger) 10%, transparent); border-left: 3px solid var(--zah-danger); padding: 0.7rem 0.8rem; margin: 0; font-size: 0.875rem; font-weight: 600; }
    }

    .login-methods {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 0.5rem;

      .method-btn {
        flex: 1;
        padding: 0.5rem 0.75rem;
        font-size: 0.8rem;
        font-weight: 600;
        border: 1px solid var(--zah-border);
        border-radius: var(--zah-radius-sm);
        background: var(--zah-surface-secondary);
        color: var(--zah-text-secondary);
        transition: all 0.2s ease;

        &.active {
          background: var(--zah-accent);
          border-color: var(--zah-accent);
          color: white;
        }
      }
    }

    .input-group {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;

      label { font-size: 0.8125rem; font-weight: 600; color: var(--zah-text-secondary); }
      input { 
        padding: 0.65rem 0.85rem; 
        border-radius: var(--zah-radius-md); 
        border: 1px solid var(--zah-border-strong); 
        background: var(--zah-surface); 
        color: var(--zah-text-primary); 
        font-size: 0.9rem;
        transition: border-color 0.2s ease;

        &:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        &:focus {
          outline: none;
          border-color: var(--zah-accent);
        }
      }
    }

    .form-row { display: flex; justify-content: flex-end; }
    .forgot-btn { font-size: 0.8125rem; color: var(--zah-accent); }
    .submit-btn { width: 100%; margin-top: 0.5rem; padding: 0.8rem; }
    .back-btn { width: 100%; margin-top: 0.5rem; }

    .otp-actions {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;

      .resend-btn {
        padding: 0.6rem;
        font-size: 0.875rem;
      }

      .back-link {
        font-size: 0.8125rem;
        color: var(--zah-accent);
        text-align: center;
        padding: 0.5rem;
      }
    }

    @media (max-width: 480px) {
      .auth-card { 
        padding: 1.5rem; 
        margin: 1rem;
        max-width: none;
      }
    }
  `]
})
export class AuthComponent implements OnInit, OnDestroy {
  authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  mode = signal<'login' | 'register' | 'forgot'>('login');
  loginMethod = signal<'email' | 'otp'>('email');
  
  // Form data
  name = '';
  email = '';
  phone = '';
  password = '';
  otp = '';

  // OTP state
  otpSent = signal<boolean>(false);
  cooldownTime = signal<number>(0);
  private cooldownInterval?: number;

  ngOnInit() {
    this.route.url.subscribe(url => {
      const path = url[0]?.path;
      if (path === 'register') this.switchMode('register');
      else if (path === 'forgot-password') this.switchMode('forgot');
      else this.switchMode('login');
    });
  }

  ngOnDestroy() {
    if (this.cooldownInterval) {
      clearInterval(this.cooldownInterval);
    }
  }

  switchMode(newMode: 'login' | 'register' | 'forgot') {
    this.mode.set(newMode);
    this.resetForm();
    
    // Update URL
    if (newMode === 'register') {
      this.router.navigate(['/register'], { replaceUrl: true });
    } else if (newMode === 'forgot') {
      this.router.navigate(['/forgot-password'], { replaceUrl: true });
    } else {
      this.router.navigate(['/login'], { replaceUrl: true });
    }
  }

  resetForm() {
    this.name = '';
    this.email = '';
    this.phone = '';
    this.password = '';
    this.otp = '';
    this.resetOtpFlow();
  }

  resetOtpFlow() {
    this.otpSent.set(false);
    this.cooldownTime.set(0);
    if (this.cooldownInterval) {
      clearInterval(this.cooldownInterval);
    }
  }

  startCooldown(seconds: number = 60) {
    this.cooldownTime.set(seconds);
    this.cooldownInterval = window.setInterval(() => {
      const current = this.cooldownTime();
      if (current <= 1) {
        this.cooldownTime.set(0);
        if (this.cooldownInterval) {
          clearInterval(this.cooldownInterval);
        }
      } else {
        this.cooldownTime.set(current - 1);
      }
    }, 1000);
  }

  onLogin() {
    if (this.email && this.password) {
      this.authService.login(this.email, this.password).subscribe(success => {
        if (success) {
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/account';
          this.router.navigate([returnUrl]);
        }
      });
    }
  }

  onRegister() {
    if (this.email && this.name && this.password && this.phone) {
      this.authService.register(this.name, this.email, this.phone, this.password).subscribe(success => {
        if (success) {
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/account';
          this.router.navigate([returnUrl]);
        }
      });
    }
  }

  onSendOtp() {
    if (this.phone) {
      this.authService.sendOtp(this.phone).subscribe(success => {
        if (success) {
          this.otpSent.set(true);
          this.startCooldown(60); // 60 second cooldown
        }
      });
    }
  }

  onVerifyOtp() {
    if (this.phone && this.otp) {
      this.authService.verifyOtp(this.phone, this.otp).subscribe(success => {
        if (success) {
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/account';
          this.router.navigate([returnUrl]);
        }
      });
    }
  }

  onResendOtp() {
    if (this.phone && this.cooldownTime() === 0) {
      this.authService.sendOtp(this.phone).subscribe(success => {
        if (success) {
          this.startCooldown(60);
        }
      });
    }
  }

  onForgot() {
    if (this.email) {
      this.authService.forgotPassword(this.email).subscribe(success => {
        if (success) {
          // Show success message and optionally switch back to login
          setTimeout(() => {
            this.switchMode('login');
          }, 2000);
        }
      });
    }
  }
}
