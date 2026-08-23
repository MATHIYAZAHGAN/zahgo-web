import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'zah-empty-state',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="empty-state-container animate-fade-in">
      <div class="icon-wrapper">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          @if (icon === 'cart') {
            <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
          } @else if (icon === 'heart') {
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
          } @else if (icon === 'search') {
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
          } @else {
            <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
          }
        </svg>
      </div>

      <h3 class="title">{{ title }}</h3>
      <p class="description">{{ description }}</p>

      @if (actionLink && actionLabel) {
        <a [routerLink]="actionLink" class="zah-btn zah-btn-primary action-btn">
          {{ actionLabel }}
        </a>
      }
    </div>
  `,
  styles: [`
    .empty-state-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 4rem 1.5rem;
      background-color: var(--zah-surface);
      border: 1px border var(--zah-border);
      border-radius: var(--zah-radius-lg);
      margin: 2rem 0;
    }

    .icon-wrapper {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background-color: var(--zah-surface-secondary);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--zah-accent);
      margin-bottom: 1.25rem;
    }

    .title {
      font-size: 1.35rem;
      font-weight: 700;
      color: var(--zah-text-primary);
      margin-bottom: 0.5rem;
    }

    .description {
      font-size: 0.95rem;
      color: var(--zah-text-muted);
      max-width: 420px;
      margin-bottom: 1.5rem;
      line-height: 1.5;
    }

    .action-btn {
      padding: 0.75rem 2rem;
    }
  `]
})
export class ZahEmptyStateComponent {
  @Input() icon: 'cart' | 'heart' | 'search' | 'package' = 'package';
  @Input({ required: true }) title!: string;
  @Input({ required: true }) description!: string;
  @Input() actionLink?: string = '/products';
  @Input() actionLabel?: string = 'Explore Collections';
}
