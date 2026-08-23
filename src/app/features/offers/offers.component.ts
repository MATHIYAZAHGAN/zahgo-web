import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MOCK_COUPONS } from '../../core/constants/mock-data';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'zah-offers',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="zah-container offers-page">
      <div class="offers-hero zah-card">
        <h1>Exclusive ZAH Offers & Promotion Codes</h1>
        <p>Unlock additional discounts on your order. Copy any code below and paste it in your shopping bag!</p>
      </div>

      <div class="coupons-grid">
        @for (c of coupons; track c.code) {
          <div class="coupon-card zah-card">
            <div class="card-left">
              <span class="discount-num">{{ c.discountPercentage }}% OFF</span>
              <span class="min-amount">Min Order: ₹{{ c.minOrderAmount | number }}</span>
            </div>

            <div class="card-right">
              <span class="code-box">{{ c.code }}</span>
              <p class="desc">{{ c.description }}</p>
              <button class="zah-btn zah-btn-sm zah-btn-accent copy-btn" (click)="copyCode(c.code)">Copy Code</button>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .offers-page { padding-top: 2rem; padding-bottom: 4rem; }
    .offers-hero { padding: 2.5rem; background: linear-gradient(135deg, var(--zah-primary) 0%, #1e293b 100%); color: #ffffff; border-radius: var(--zah-radius-lg); margin-bottom: 2.5rem; text-align: center; h1 { font-size: 2.25rem; font-weight: 800; color: #ffffff; margin-bottom: 0.5rem; } p { color: #cbd5e1; font-size: 1rem; margin: 0; } }
    .coupons-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; @media (max-width: 992px) { grid-template-columns: 1fr; } }
    .coupon-card { padding: 1.5rem; display: flex; gap: 1.5rem; border-left: 4px solid var(--zah-accent); }
    .card-left { display: flex; flex-direction: column; justify-content: center; .discount-num { font-size: 1.5rem; font-weight: 800; color: var(--zah-accent); } .min-amount { font-size: 0.75rem; color: var(--zah-text-muted); } }
    .card-right { flex-grow: 1; display: flex; flex-direction: column; gap: 0.35rem; .code-box { font-family: monospace; font-size: 1.1rem; font-weight: 800; letter-spacing: 0.05em; background: var(--zah-surface-secondary); padding: 0.2rem 0.5rem; border-radius: 4px; width: fit-content; } .desc { font-size: 0.85rem; color: var(--zah-text-secondary); margin: 0; } .copy-btn { margin-top: 0.5rem; align-self: flex-start; } }
  `]
})
export class OffersComponent {
  notificationService = inject(NotificationService);
  coupons = MOCK_COUPONS;

  copyCode(code: string) {
    navigator.clipboard.writeText(code);
    this.notificationService.success('Code Copied!', `Promo code ${code} copied to clipboard.`);
  }
}
