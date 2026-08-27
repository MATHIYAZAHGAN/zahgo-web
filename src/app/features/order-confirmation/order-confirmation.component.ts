import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { OrderService } from '../../core/services/order.service';
import { Order } from '../../core/models/order.model';

@Component({
  selector: 'zah-order-confirmation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="zah-container confirmation-page">
      @if (order()) {
        <div class="confirmation-card zah-card animate-slide-up">
          <div class="success-icon-badge">✓</div>
          <h1 class="title">Thank You For Your Order!</h1>
          <p class="subtitle">Your order <strong>{{ order()?.orderNumber }}</strong> has been placed and is now being processed.</p>

          <div class="details-box">
            <div class="info-group">
              <label>Estimated Delivery:</label>
              <strong>{{ order()?.estimatedDeliveryDate }}</strong>
            </div>
            <div class="info-group">
              <label>Tracking Reference:</label>
              <strong>{{ order()?.trackingNumber }}</strong>
            </div>
            <div class="info-group">
              <label>Payment Method:</label>
              <strong>{{ order()?.paymentMethod }} ({{ order()?.paymentStatus }})</strong>
            </div>
          </div>

          <div class="items-summary">
            <h3>Ordered Items ({{ order()?.items?.length }})</h3>
            <div class="items-grid">
              @for (item of order()?.items; track item.id) {
                <div class="item-row">
                  <img [src]="item.product.images[0]" [alt]="item.product.name" />
                  <div class="item-info">
                    <span class="name">{{ item.product.name }}</span>
                    <span class="qty">Qty: {{ item.quantity }}</span>
                  </div>
                  <span class="price">₹{{ item.totalPrice | number }}</span>
                </div>
              }
            </div>
          </div>

          <div class="actions-row">
            <a routerLink="/account/orders" class="zah-btn zah-btn-primary">Track Order Progress</a>
            <a routerLink="/" class="zah-btn zah-btn-outline">Continue Shopping</a>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .confirmation-page { padding-top: 3rem; padding-bottom: 5rem; display: flex; justify-content: center; }
    .confirmation-card { max-width: 680px; width: 100%; padding: 3rem 2rem; text-align: center; display: flex; flex-direction: column; align-items: center; }
    .success-icon-badge { width: 72px; height: 72px; border-radius: 50%; background: var(--zah-success-bg); color: var(--zah-success); font-size: 2.25rem; font-weight: 800; display: flex; align-items: center; justify-content: center; margin-bottom: 1.5rem; }
    .title { font-size: 2rem; font-weight: 800; margin: 0 0 0.5rem 0; }
    .subtitle { font-size: 1rem; color: var(--zah-text-secondary); margin-bottom: 2rem; }
    .details-box { display: flex; justify-content: space-around; width: 100%; padding: 1.25rem; background: var(--zah-surface-secondary); border-radius: var(--zah-radius-md); margin-bottom: 2rem; text-align: left; }
    .info-group { display: flex; flex-direction: column; label { font-size: 0.75rem; color: var(--zah-text-muted); } strong { font-size: 0.95rem; } }
    .items-summary { width: 100%; text-align: left; margin-bottom: 2rem; h3 { font-size: 1.1rem; font-weight: 700; margin-bottom: 1rem; } }
    .items-grid { display: flex; flex-direction: column; gap: 0.85rem; }
    .item-row { display: flex; align-items: center; gap: 1rem; img { width: 48px; height: 48px; border-radius: 4px; object-fit: cover; } .item-info { flex-grow: 1; display: flex; flex-direction: column; .name { font-size: 0.9rem; font-weight: 600; } .qty { font-size: 0.75rem; color: var(--zah-text-muted); } } .price { font-weight: 700; } }
    .actions-row { display: flex; gap: 1rem; }
    @media (max-width: 560px) {
      .confirmation-page { padding-top: 1.5rem; }
      .confirmation-card { padding: 2rem 1rem; }
      .title { font-size: 1.55rem; }
      .details-box, .actions-row { flex-direction: column; gap: 1rem; }
      .details-box { padding: 1rem; }
      .actions-row, .actions-row .zah-btn { width: 100%; }
    }
  `]
})
export class OrderConfirmationComponent implements OnInit {
  orderService = inject(OrderService);
  private route = inject(ActivatedRoute);

  order = signal<Order | null>(null);

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const orderId = params['orderId'];
      const found = this.orderService.getOrderById(orderId);
      if (found) {
        this.order.set(found);
      } else {
        this.order.set(this.orderService.orders()[0] || null);
      }
    });
  }
}
