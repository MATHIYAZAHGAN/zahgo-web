import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'zah-footer',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <footer class="zah-footer">
      <div class="zah-container">
        <!-- Top Footer Grid -->
        <div class="footer-grid">
          <!-- Col 1: Brand Info -->
          <div class="footer-col brand-col">
            <a routerLink="/" class="footer-logo">
              <span class="logo-main">ZAH</span>
              <span class="logo-small">go</span>
            </a>
            <p class="brand-desc">
              Curated luxury fashion, high-performance audio, and refined living accessories designed for the modern lifestyle.
            </p>
            <div class="social-links">
              <a href="#" aria-label="Instagram"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg></a>
              <a href="#" aria-label="Twitter"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg></a>
              <a href="#" aria-label="LinkedIn"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg></a>
            </div>
          </div>

          <!-- Col 2: Quick Links -->
          <div class="footer-col">
            <h4 class="col-title">Shop Categories</h4>
            <ul>
              <li><a routerLink="/category/men-fashion">Men's Tailored Fashion</a></li>
              <li><a routerLink="/category/women-fashion">Women's Silk Couture</a></li>
              <li><a routerLink="/category/electronics">Studio ANC Audio</a></li>
              <li><a routerLink="/category/accessories">Leather Timepieces</a></li>
              <li><a routerLink="/category/home-living">Espresso Stations</a></li>
              <li><a routerLink="/offers">Exclusive Offers</a></li>
            </ul>
          </div>

          <!-- Col 3: Customer Care -->
          <div class="footer-col">
            <h4 class="col-title">Customer Care</h4>
            <ul>
              <li><a routerLink="/support">Track Your Order</a></li>
              <li><a routerLink="/support">Shipping & Express Delivery</a></li>
              <li><a routerLink="/support">Returns & Refunds</a></li>
              <li><a routerLink="/support">Size Guide & Styling</a></li>
              <li><a routerLink="/support">Contact ZAH go Concierge</a></li>
              <li><a routerLink="/support">FAQs</a></li>
            </ul>
          </div>

          <!-- Col 4: Newsletter -->
          <div class="footer-col newsletter-col">
            <h4 class="col-title">Join The ZAH go Club</h4>
            <p class="newsletter-desc">Subscribe to receive private preview codes, flash sale drops, and 10% off your first order.</p>
            <form (ngSubmit)="subscribeNewsletter()" class="newsletter-form">
              <input type="email" placeholder="Enter your email address" [(ngModel)]="emailInput" name="email" required />
              <button type="submit" class="zah-btn zah-btn-accent">Subscribe</button>
            </form>
          </div>
        </div>

        <hr class="footer-divider" />

        <!-- Bottom Bar -->
        <div class="footer-bottom">
          <p>© 2026 ZAH go Luxury E-Commerce Inc. All Rights Reserved.</p>
          <div class="payment-badges">
            <span class="pay-badge">UPI</span>
            <span class="pay-badge">VISA</span>
            <span class="pay-badge">MASTERCARD</span>
            <span class="pay-badge">RAZORPAY</span>
            <span class="pay-badge">PHONEPE</span>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .zah-footer {
      background-color: #0b1120;
      color: #94a3b8;
      padding-top: 4rem;
      padding-bottom: 2rem;
      border-top: 1px solid #1e293b;
      margin-top: 4rem;
    }

    .footer-grid {
      display: grid;
      grid-template-columns: 1.5fr 1fr 1fr 1.5fr;
      gap: 2.5rem;

      @media (max-width: 992px) {
        grid-template-columns: 1fr 1fr;
      }

      @media (max-width: 640px) {
        grid-template-columns: 1fr;
      }
    }

    .footer-logo {
      font-family: var(--zah-font-heading);
      display: flex;
      align-items: center;
      gap: 0.3rem;
      
      .logo-main {
        font-size: 2rem;
        font-weight: 800;
        color: #ffffff;
        letter-spacing: 0.08em;
      }
      
      .logo-small {
        font-size: 1.1rem;
        font-weight: 600;
        color: #64748b;
        margin-top: 0.4rem;
      }
    }

    .brand-desc {
      font-size: 0.875rem;
      line-height: 1.6;
      margin-top: 0.75rem;
      margin-bottom: 1.25rem;
    }

    .social-links {
      display: flex;
      gap: 0.75rem;

      a {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: #1e293b;
        color: #f8fafc;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: var(--zah-transition-fast);

        &:hover {
          background: var(--zah-accent);
          color: #0f172a;
        }
      }
    }

    .col-title {
      font-size: 1rem;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 1.25rem;
    }

    ul {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 0.65rem;

      a {
        font-size: 0.875rem;
        color: #94a3b8;
        transition: var(--zah-transition-fast);

        &:hover {
          color: #ffffff;
          padding-left: 4px;
        }
      }
    }

    .newsletter-desc {
      font-size: 0.875rem;
      margin-bottom: 1rem;
      line-height: 1.5;
    }

    .newsletter-form {
      display: flex;
      gap: 0.5rem;

      input {
        flex-grow: 1;
        padding: 0.65rem 0.85rem;
        font-size: 0.85rem;
        border-radius: var(--zah-radius-md);
        border: 1px solid #334155;
        background: #1e293b;
        color: #ffffff;
        outline: none;

        &:focus {
          border-color: var(--zah-accent);
        }
      }
    }

    .footer-divider {
      border: none;
      border-top: 1px solid #1e293b;
      margin: 3rem 0 1.5rem 0;
    }

    .footer-bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.8125rem;

      @media (max-width: 640px) {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }
    }

    .payment-badges {
      display: flex;
      gap: 0.5rem;
    }

    .pay-badge {
      font-size: 0.6875rem;
      font-weight: 700;
      padding: 0.2rem 0.5rem;
      background: #1e293b;
      border-radius: 4px;
      color: #cbd5e1;
    }
  `]
})
export class ZahFooterComponent {
  private notificationService = inject(NotificationService);
  emailInput = '';

  subscribeNewsletter() {
    if (this.emailInput.includes('@')) {
      this.notificationService.success('Subscribed!', 'Thank you for joining the ZAH go Club. Promo code ZAH10 is active for your account.');
      this.emailInput = '';
    } else {
      this.notificationService.warning('Invalid Email', 'Please enter a valid email address.');
    }
  }
}
