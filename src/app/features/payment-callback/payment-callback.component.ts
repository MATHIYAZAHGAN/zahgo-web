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
        <div class="status-card zah-card"><h1>Verifying payment</h1><p>Please wait while we securely confirm your payment.</p></div>
      } @else {
        @if (status(); as payment) {
          <div class="status-card zah-card">
            <div class="status-icon" [class.success]="payment.status === 'PAID'">{{ payment.status === 'PAID' ? '✓' : '!' }}</div>
            <h1>{{ payment.status === 'PAID' ? 'Payment successful' : 'Payment pending' }}</h1>
            <p>Order {{ payment.orderNumber }} · ₹{{ payment.amount | number }}</p>
            <div class="actions"><a routerLink="/account/orders" class="zah-btn zah-btn-primary">View Orders</a><a routerLink="/" class="zah-btn zah-btn-outline">Continue Shopping</a></div>
          </div>
        } @else {
        <div class="status-card zah-card"><h1>Payment status unavailable</h1><p>We could not verify this payment yet. Please check your orders shortly.</p><a routerLink="/account/orders" class="zah-btn zah-btn-primary">View Orders</a></div>
        }
      }
    </section>
  `,
  styles: [`
    .payment-page { min-height: 55vh; display: grid; place-items: center; padding-top: 3rem; padding-bottom: 4rem; }
    .status-card { width: min(560px, 100%); padding: 3rem 2rem; text-align: center; }
    .status-icon { width: 64px; height: 64px; margin: 0 auto 1rem; display: grid; place-items: center; border-radius: 50%; background: var(--zah-warning-bg); color: var(--zah-warning); font-size: 2rem; font-weight: 800; }
    .status-icon.success { background: var(--zah-success-bg); color: var(--zah-success); }
    .status-card h1 { margin: 0 0 0.5rem; }
    .status-card p { color: var(--zah-text-secondary); margin-bottom: 1.5rem; }
    .actions { display: flex; justify-content: center; gap: 0.75rem; flex-wrap: wrap; }
    @media (max-width: 560px) { .status-card { padding: 2rem 1rem; } .actions, .actions .zah-btn { width: 100%; } }
  `]
})
export class PaymentCallbackComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private paymentService = inject(PaymentService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);
  private cartService = inject(CartService);
  loading = signal(true);
  status = signal<PaymentStatus | null>(null);

  ngOnInit() {
    const orderId = this.route.snapshot.queryParamMap.get('order_id');
    if (!orderId) { this.loading.set(false); return; }
    this.paymentService.getStatus(orderId).subscribe({
      next: result => { this.status.set(result); if (result.status === 'PAID') this.cartService.clearCart(); this.loading.set(false); },
      error: () => { this.loading.set(false); this.notificationService.error('Payment Check Failed', 'Please check your orders for the latest status.'); }
    });
  }
}
