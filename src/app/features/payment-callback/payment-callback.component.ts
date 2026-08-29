import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { PaymentService, PaymentStatus } from '../../core/services/payment.service';
import { NotificationService } from '../../core/services/notification.service';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'zah-payment-callback',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="zah-container payment-page">
      @if (loading()) {
        <div class="status-card zah-card animate-pulse">
          <div class="spinner-ring"></div>
          <h2 class="verifying-title">Verifying Payment Security...</h2>
          <p class="verifying-desc">Please stay on this page while we securely reconcile your transaction with Cashfree Payments.</p>
        </div>
      } @else {
        @if (status(); as payment) {
          <div class="confirmation-card zah-card animate-fade-in">
            <!-- Animated Hero Badge -->
            <div class="hero-badge" [class.success]="payment.status === 'PAID' || payment.status === 'CONFIRMED'">
              <div class="badge-icon">
                @if (payment.status === 'PAID' || payment.status === 'CONFIRMED') {
                  <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                } @else {
                  <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                }
              </div>
            </div>

            <!-- Title & Subtitle -->
            <h1 class="main-title">
              {{ (payment.status === 'PAID' || payment.status === 'CONFIRMED') ? 'Order Confirmed & Paid!' : 'Payment Pending Verification' }}
            </h1>
            <p class="main-sub">
              {{ (payment.status === 'PAID' || payment.status === 'CONFIRMED') 
                ? 'Thank you for your purchase. We have received your payment and sent confirmation details to your registered profile.' 
                : 'Your payment status is being finalized by Cashfree. Check your order history shortly.' }}
            </p>

            <!-- Order Number Reference Strip -->
            <div class="order-ref-strip">
              <span class="ref-label">Order Reference:</span>
              <strong class="ref-number">{{ payment.orderNumber }}</strong>
              <button class="copy-btn" (click)="copyOrderRef(payment.orderNumber)">
                {{ copied() ? '✓ Copied' : 'Copy' }}
              </button>
            </div>

            <!-- Estimated Delivery Banner -->
            <div class="delivery-banner">
              <div class="banner-icon">🚚</div>
              <div class="banner-text">
                <strong>Estimated Delivery: {{ estimatedDelivery }}</strong>
                <p>Express Courier Service · Real-Time Tracking Available</p>
              </div>
            </div>

            <!-- Receipt Metadata Grid -->
            <div class="receipt-grid">
              <div class="receipt-item">
                <span class="lbl">Amount Paid</span>
                <span class="val price">₹{{ payment.amount | number }}</span>
              </div>
              <div class="receipt-item">
                <span class="lbl">Payment Provider</span>
                <span class="val">Cashfree PG (UPI/Card)</span>
              </div>
              <div class="receipt-item">
                <span class="lbl">Transaction Status</span>
                <span class="val-badge" [class.paid]="payment.status === 'PAID' || payment.status === 'CONFIRMED'">
                  {{ payment.status }}
                </span>
              </div>
            </div>

            <!-- Order Lifecycle Progress Steps -->
            <div class="timeline-box">
              <h3>Order Status Tracker</h3>
              <div class="timeline-steps">
                <div class="t-step active">
                  <div class="t-dot">✓</div>
                  <span>Order Placed</span>
                </div>
                <div class="t-line active"></div>
                <div class="t-step active">
                  <div class="t-dot">✓</div>
                  <span>Payment Verified</span>
                </div>
                <div class="t-line"></div>
                <div class="t-step">
                  <div class="t-dot">3</div>
                  <span>Processing</span>
                </div>
                <div class="t-line"></div>
                <div class="t-step">
                  <div class="t-dot">4</div>
                  <span>Out for Delivery</span>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="action-buttons">
              <a routerLink="/account/orders" class="zah-btn zah-btn-primary zah-btn-lg">
                Track Order Progress →
              </a>
              <button class="zah-btn zah-btn-outline" (click)="printReceipt()">
                🖨️ Print Receipt
              </button>
              <a routerLink="/products" class="zah-btn zah-btn-ghost">
                Continue Shopping
              </a>
            </div>
          </div>
        } @else {
          <div class="confirmation-card zah-card animate-fade-in">
            <div class="hero-badge warning">
              <div class="badge-icon">!</div>
            </div>
            <h1 class="main-title">Order Processing Status</h1>
            <p class="main-sub">We are checking the latest confirmation for order <strong>{{ currentOrderId }}</strong>.</p>
            <div class="action-buttons">
              <button class="zah-btn zah-btn-primary" (click)="retryCheck()">Check Again</button>
              <a routerLink="/account/orders" class="zah-btn zah-btn-outline">View My Orders</a>
              <a routerLink="/" class="zah-btn zah-btn-ghost">Back to Home</a>
            </div>
          </div>
        }
      }
    </section>
  `,
  styles: [`
    .payment-page {
      min-height: 75vh;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 3rem 1rem 5rem;
    }

    .status-card {
      width: min(520px, 100%);
      padding: 3.5rem 2rem;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;

      .spinner-ring {
        width: 54px;
        height: 54px;
        border: 4px solid var(--zah-border);
        border-top-color: var(--zah-accent);
        border-radius: 50%;
        animation: spin 1s infinite linear;
        margin-bottom: 1.5rem;
      }
      .verifying-title { font-size: 1.4rem; font-weight: 800; margin: 0 0 0.5rem; }
      .verifying-desc { font-size: 0.9rem; color: var(--zah-text-muted); margin: 0; }
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .confirmation-card {
      width: min(680px, 100%);
      padding: 3rem 2.5rem;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .hero-badge {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: rgba(239, 68, 68, 0.1);
      color: #ef4444;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1.5rem;
      box-shadow: 0 0 0 10px rgba(239, 68, 68, 0.05);

      &.success {
        background: rgba(16, 185, 129, 0.12);
        color: #10b981;
        box-shadow: 0 0 0 12px rgba(16, 185, 129, 0.06);
      }

      &.warning {
        background: rgba(245, 158, 11, 0.12);
        color: #f59e0b;
        box-shadow: 0 0 0 12px rgba(245, 158, 11, 0.06);
      }
    }

    .main-title {
      font-size: 2rem;
      font-weight: 800;
      margin: 0 0 0.65rem 0;
      color: var(--zah-text-primary);
    }

    .main-sub {
      font-size: 0.95rem;
      color: var(--zah-text-muted);
      max-width: 520px;
      margin: 0 0 2rem 0;
      line-height: 1.5;
    }

    .order-ref-strip {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.65rem 1.25rem;
      background: var(--zah-surface-tertiary);
      border-radius: var(--zah-radius-md);
      margin-bottom: 1.5rem;

      .ref-label { font-size: 0.825rem; color: var(--zah-text-muted); }
      .ref-number { font-size: 0.95rem; font-weight: 700; color: var(--zah-text-primary); letter-spacing: 0.5px; }
      .copy-btn { font-size: 0.775rem; font-weight: 700; color: var(--zah-accent); border: 0; background: transparent; cursor: pointer; margin-left: 0.25rem; }
    }

    .delivery-banner {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.15rem 1.5rem;
      background: var(--zah-accent-light);
      border: 1px solid var(--zah-accent);
      border-radius: var(--zah-radius-md);
      margin-bottom: 2rem;
      text-align: left;

      .banner-icon { font-size: 1.8rem; }
      .banner-text {
        strong { font-size: 1rem; color: var(--zah-text-primary); }
        p { margin: 0.15rem 0 0 0; font-size: 0.8rem; color: var(--zah-text-muted); }
      }
    }

    .receipt-grid {
      width: 100%;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
      padding: 1.25rem;
      background: var(--zah-surface-secondary);
      border-radius: var(--zah-radius-md);
      margin-bottom: 2rem;
      text-align: left;
    }

    .receipt-item {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      .lbl { font-size: 0.75rem; color: var(--zah-text-muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
      .val { font-size: 0.95rem; font-weight: 700; color: var(--zah-text-primary); &.price { color: var(--zah-accent); font-size: 1.1rem; } }
      .val-badge { display: inline-block; font-size: 0.75rem; font-weight: 800; padding: 0.2rem 0.6rem; border-radius: 4px; background: var(--zah-warning-bg); color: var(--zah-warning); width: fit-content; &.paid { background: var(--zah-success-bg); color: var(--zah-success); } }
    }

    .timeline-box {
      width: 100%;
      text-align: left;
      margin-bottom: 2.5rem;
      h3 { font-size: 1rem; font-weight: 700; margin: 0 0 1.25rem 0; color: var(--zah-text-primary); }
    }

    .timeline-steps {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
    }

    .t-step {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.4rem;
      span { font-size: 0.75rem; font-weight: 600; color: var(--zah-text-muted); white-space: nowrap; }
      .t-dot { width: 28px; height: 28px; border-radius: 50%; background: var(--zah-surface-tertiary); color: var(--zah-text-muted); display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: 700; }

      &.active {
        span { color: var(--zah-text-primary); }
        .t-dot { background: var(--zah-accent); color: #0f172a; }
      }
    }

    .t-line {
      flex-grow: 1;
      height: 2px;
      background: var(--zah-border);
      margin: 0 0.5rem;
      margin-bottom: 1.25rem;
      &.active { background: var(--zah-accent); }
    }

    .action-buttons {
      display: flex;
      gap: 0.85rem;
      width: 100%;
      justify-content: center;
      flex-wrap: wrap;
    }

    @media (max-width: 640px) {
      .payment-page { padding-top: 1.5rem; }
      .confirmation-card { padding: 2rem 1.25rem; }
      .main-title { font-size: 1.55rem; }
      .receipt-grid { grid-template-columns: 1fr; gap: 0.85rem; }
      .timeline-steps { overflow-x: auto; padding-bottom: 0.5rem; }
      .action-buttons, .action-buttons .zah-btn { width: 100%; }
    }
  `]
})
export class PaymentCallbackComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private paymentService = inject(PaymentService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);
  private cartService = inject(CartService);

  loading = signal(true);
  copied = signal(false);
  status = signal<PaymentStatus | null>(null);
  currentOrderId = '';
  estimatedDelivery = '';

  ngOnInit() {
    this.estimatedDelivery = this.calculateEstimatedDelivery();
    this.currentOrderId = this.route.snapshot.queryParamMap.get('order_id') || '';

    if (!this.currentOrderId) {
      this.loading.set(false);
      return;
    }

    this.checkStatus(this.currentOrderId);
  }

  checkStatus(orderId: string) {
    this.loading.set(true);
    this.paymentService.getStatus(orderId).subscribe({
      next: result => {
        this.status.set(result);
        if (result.status === 'PAID' || result.status === 'CONFIRMED') {
          this.cartService.clearCart();
        }
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.notificationService.warning('Verification Pending', 'We are still processing your order status. Please check your account dashboard shortly.');
      }
    });
  }

  retryCheck() {
    if (this.currentOrderId) {
      this.checkStatus(this.currentOrderId);
    }
  }

  copyOrderRef(orderNumber: string) {
    navigator.clipboard.writeText(orderNumber);
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 2000);
  }

  printReceipt() {
    window.print();
  }

  private calculateEstimatedDelivery(): string {
    const start = new Date();
    start.setDate(start.getDate() + 2);
    const end = new Date();
    end.setDate(end.getDate() + 4);
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    return `${start.toLocaleDateString('en-US', options)} – ${end.toLocaleDateString('en-US', options)}`;
  }
}
