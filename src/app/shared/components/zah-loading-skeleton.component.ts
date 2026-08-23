import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'zah-loading-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (type === 'product-grid') {
      <div class="skeleton-grid" [style.grid-template-columns]="'repeat(' + count + ', 1fr)'">
        @for (item of items; track $index) {
          <div class="skeleton-card zah-card">
            <div class="skeleton-media skeleton-shimmer"></div>
            <div class="skeleton-content">
              <div class="skeleton-line sm skeleton-shimmer"></div>
              <div class="skeleton-line lg skeleton-shimmer"></div>
              <div class="skeleton-line md skeleton-shimmer"></div>
              <div class="skeleton-btn skeleton-shimmer"></div>
            </div>
          </div>
        }
      </div>
    } @else if (type === 'text') {
      <div class="skeleton-text-group">
        @for (item of items; track $index) {
          <div class="skeleton-line skeleton-shimmer" [style.width.%]="80 - ($index * 15)"></div>
        }
      </div>
    }
  `,
  styles: [`
    .skeleton-grid {
      display: grid;
      gap: 1.25rem;
      width: 100%;
    }

    @media (max-width: 1024px) {
      .skeleton-grid {
        grid-template-columns: repeat(2, 1fr) !important;
      }
    }

    @media (max-width: 640px) {
      .skeleton-grid {
        grid-template-columns: repeat(2, 1fr) !important;
      }
    }

    .skeleton-card {
      border-radius: var(--zah-radius-md);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      height: 380px;
    }

    .skeleton-media {
      width: 100%;
      height: 220px;
    }

    .skeleton-content {
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.65rem;
      flex-grow: 1;
    }

    .skeleton-line {
      height: 14px;
      border-radius: 4px;

      &.sm { width: 40%; }
      &.md { width: 60%; }
      &.lg { width: 90%; }
    }

    .skeleton-btn {
      height: 36px;
      margin-top: auto;
      border-radius: var(--zah-radius-md);
    }

    .skeleton-text-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
  `]
})
export class ZahLoadingSkeletonComponent {
  @Input() type: 'product-grid' | 'text' | 'card' = 'product-grid';
  @Input() count = 4;

  get items() {
    return Array(this.count).fill(0);
  }
}
