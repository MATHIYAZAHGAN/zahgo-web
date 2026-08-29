import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'zah-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container" role="status" aria-live="polite">
      @for (toast of notificationService.toasts(); track toast.id) {
        <div class="toast-card zah-card animate-slide-up" [class]="'toast-' + toast.type">
          <div class="toast-icon">
            @if (toast.type === 'success') {
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            } @else if (toast.type === 'danger') {
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
            } @else if (toast.type === 'warning') {
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            } @else {
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            }
          </div>
          <div class="toast-content">
            <h4 class="toast-title">{{ toast.title }}</h4>
            <p class="toast-message">{{ toast.message }}</p>
          </div>
          <button class="dismiss-btn" (click)="notificationService.dismiss(toast.id)" aria-label="Dismiss">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      bottom: calc(2rem + var(--zah-safe-bottom));
      right: calc(2rem + var(--zah-safe-right));
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      max-width: 380px;
      width: calc(100% - 2rem);
      pointer-events: none;
    }

    @media (max-width: 768px) {
      .toast-container {
        bottom: calc(5rem + var(--zah-safe-bottom)); /* above sticky mobile nav */
        left: 1rem;
        right: 1rem;
        width: auto;
      }
    }

    .toast-card {
      pointer-events: auto;
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      padding: 0.85rem 1rem;
      border-radius: var(--zah-radius-md);
      box-shadow: var(--zah-shadow-xl);
      background-color: var(--zah-surface);
      border-left: 4px solid var(--zah-primary);

      &.toast-success { border-left-color: var(--zah-success); .toast-icon { color: var(--zah-success); } }
      &.toast-danger { border-left-color: var(--zah-danger); .toast-icon { color: var(--zah-danger); } }
      &.toast-warning { border-left-color: var(--zah-warning); .toast-icon { color: var(--zah-warning); } }
      &.toast-info { border-left-color: var(--zah-info); .toast-icon { color: var(--zah-info); } }
    }

    .toast-icon {
      margin-top: 0.1rem;
      flex-shrink: 0;
    }

    .toast-content {
      flex-grow: 1;
    }

    .toast-title {
      font-size: 0.875rem;
      font-weight: 700;
      color: var(--zah-text-primary);
      margin: 0 0 0.15rem 0;
    }

    .toast-message {
      font-size: 0.8125rem;
      color: var(--zah-text-secondary);
      margin: 0;
      line-height: 1.35;
    }

    .dismiss-btn {
      color: var(--zah-text-muted);
      padding: 0.2rem;
      border-radius: 4px;
      &:hover { color: var(--zah-text-primary); background-color: var(--zah-surface-secondary); }
    }
  `]
})
export class ZahToastComponent {
  notificationService = inject(NotificationService);
}
