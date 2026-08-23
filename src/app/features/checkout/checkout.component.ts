import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth.service';
import { OrderService } from '../../core/services/order.service';
import { NotificationService } from '../../core/services/notification.service';
import { Address } from '../../core/models/user.model';

@Component({
  selector: 'zah-checkout',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="zah-container checkout-page">
      <h1 class="page-title">Express Checkout</h1>

      <!-- Stepper Header Bar -->
      <div class="stepper-bar zah-card">
        <div class="step-item" [class.active]="currentStep() >= 1" [class.completed]="currentStep() > 1">
          <span class="step-num">1</span>
          <span class="step-label">Shipping Address</span>
        </div>
        <div class="step-line" [class.active]="currentStep() > 1"></div>

        <div class="step-item" [class.active]="currentStep() >= 2" [class.completed]="currentStep() > 2">
          <span class="step-num">2</span>
          <span class="step-label">Delivery Options</span>
        </div>
        <div class="step-line" [class.active]="currentStep() > 2"></div>

        <div class="step-item" [class.active]="currentStep() >= 3" [class.completed]="currentStep() > 3">
          <span class="step-num">3</span>
          <span class="step-label">Payment Method</span>
        </div>
        <div class="step-line" [class.active]="currentStep() > 3"></div>

        <div class="step-item" [class.active]="currentStep() >= 4">
          <span class="step-num">4</span>
          <span class="step-label">Review & Place Order</span>
        </div>
      </div>

      <div class="checkout-layout">
        <!-- Main Form Step Area -->
        <main class="form-column">
          <!-- Step 1: Address Selection -->
          @if (currentStep() === 1) {
            <div class="step-card zah-card animate-fade-in">
              <div class="card-header">
                <h3>Select Shipping Address</h3>
                <button class="zah-btn zah-btn-sm zah-btn-outline" (click)="isAddressModalOpen.set(true)">+ Add New Address</button>
              </div>

              <div class="addresses-grid">
                @for (addr of authService.currentUser()?.addresses || []; track addr.id) {
                  <div class="address-card" [class.selected]="selectedAddress()?.id === addr.id" (click)="selectedAddress.set(addr)">
                    <div class="card-top">
                      <span class="type-badge">{{ addr.type }}</span>
                      @if (addr.isDefault) { <span class="default-badge">DEFAULT</span> }
                    </div>
                    <strong class="name">{{ addr.fullName }}</strong>
                    <p class="phone">{{ addr.phone }}</p>
                    <p class="street">{{ addr.streetAddress }}, {{ addr.city }}, {{ addr.state }} - {{ addr.pincode }}</p>
                  </div>
                }
              </div>

              <div class="step-footer">
                <button class="zah-btn zah-btn-primary" (click)="goToStep(2)" [disabled]="!selectedAddress()">
                  Continue to Delivery →
                </button>
              </div>
            </div>
          }

          <!-- Step 2: Delivery Method -->
          @if (currentStep() === 2) {
            <div class="step-card zah-card animate-fade-in">
              <h3>Select Delivery Speed</h3>
              <div class="delivery-options">
                <label class="delivery-card" [class.selected]="deliveryMethod() === 'STANDARD'" (click)="deliveryMethod.set('STANDARD')">
                  <input type="radio" name="del" [checked]="deliveryMethod() === 'STANDARD'" />
                  <div>
                    <strong>Standard Express Delivery (FREE)</strong>
                    <p>Delivered within 2–3 business days with full real-time tracking.</p>
                  </div>
                  <span class="cost">FREE</span>
                </label>

                <label class="delivery-card" [class.selected]="deliveryMethod() === 'EXPRESS'" (click)="deliveryMethod.set('EXPRESS')">
                  <input type="radio" name="del" [checked]="deliveryMethod() === 'EXPRESS'" />
                  <div>
                    <strong>Next-Day VIP Air Delivery</strong>
                    <p>Guaranteed morning delivery by 10:30 AM next business day.</p>
                  </div>
                  <span class="cost">₹299</span>
                </label>
              </div>

              <div class="step-footer">
                <button class="zah-btn zah-btn-ghost" (click)="goToStep(1)">← Back</button>
                <button class="zah-btn zah-btn-primary" (click)="goToStep(3)">Continue to Payment →</button>
              </div>
            </div>
          }

          <!-- Step 3: Payment Method -->
          @if (currentStep() === 3) {
            <div class="step-card zah-card animate-fade-in">
              <h3>Select Payment Gateway</h3>
              <div class="payment-methods">
                <label class="pay-card" [class.selected]="paymentMethod() === 'UPI'" (click)="paymentMethod.set('UPI')">
                  <input type="radio" name="pay" [checked]="paymentMethod() === 'UPI'" />
                  <span class="pay-title">Instant UPI / QR (PhonePe, GPay, Paytm)</span>
                </label>

                <label class="pay-card" [class.selected]="paymentMethod() === 'CARD'" (click)="paymentMethod.set('CARD')">
                  <input type="radio" name="pay" [checked]="paymentMethod() === 'CARD'" />
                  <span class="pay-title">Credit / Debit Card (Visa, Mastercard, Amex)</span>
                </label>

                <label class="pay-card" [class.selected]="paymentMethod() === 'COD'" (click)="paymentMethod.set('COD')">
                  <input type="radio" name="pay" [checked]="paymentMethod() === 'COD'" />
                  <span class="pay-title">Cash on Delivery (Pay upon arrival)</span>
                </label>
              </div>

              <div class="step-footer">
                <button class="zah-btn zah-btn-ghost" (click)="goToStep(2)">← Back</button>
                <button class="zah-btn zah-btn-primary" (click)="goToStep(4)">Review Order →</button>
              </div>
            </div>
          }

          <!-- Step 4: Final Review & Confirmation -->
          @if (currentStep() === 4) {
            <div class="step-card zah-card animate-fade-in">
              <h3>Review Order Details</h3>
              <div class="review-block">
                <h4>Shipping Address</h4>
                <p>{{ selectedAddress()?.fullName }} ({{ selectedAddress()?.phone }})</p>
                <p>{{ selectedAddress()?.streetAddress }}, {{ selectedAddress()?.city }} - {{ selectedAddress()?.pincode }}</p>
              </div>

              <div class="review-block">
                <h4>Payment & Delivery</h4>
                <p>Method: <strong>{{ paymentMethod() }}</strong></p>
                <p>Speed: <strong>{{ deliveryMethod() }}</strong></p>
              </div>

              <div class="step-footer">
                <button class="zah-btn zah-btn-ghost" (click)="goToStep(3)">← Back</button>
                <button class="zah-btn zah-btn-accent zah-btn-lg place-order-btn" (click)="submitOrder()">
                  🔒 Pay & Place Order (₹{{ cartService.cartSummary().total | number }})
                </button>
              </div>
            </div>
          }
        </main>

        <!-- Sidebar Summary Preview -->
        <aside class="summary-column">
          <div class="summary-card zah-card">
            <h3 class="summary-title">Order Items ({{ cartService.totalItemCount() }})</h3>
            <div class="cart-preview-list">
              @for (item of cartService.cartItems(); track item.id) {
                <div class="preview-item">
                  <img [src]="item.product.images[0]" [alt]="item.product.name" />
                  <div class="item-meta">
                    <span class="name">{{ item.product.name }}</span>
                    <span class="qty">Qty: {{ item.quantity }}</span>
                  </div>
                  <span class="price">₹{{ item.totalPrice | number }}</span>
                </div>
              }
            </div>

            <hr />

            <div class="totals-breakdown">
              <div class="row"><span>Subtotal</span><span>₹{{ cartService.cartSummary().subtotal | number }}</span></div>
              <div class="row"><span>Discount</span><span>-₹{{ cartService.cartSummary().discountAmount | number }}</span></div>
              <div class="row"><span>Shipping</span><span>{{ cartService.cartSummary().shippingFee === 0 ? 'FREE' : '₹' + cartService.cartSummary().shippingFee }}</span></div>
              <div class="row"><span>Tax</span><span>₹{{ cartService.cartSummary().estimatedTax | number }}</span></div>
              <hr />
              <div class="row total"><span>Total Payable</span><span>₹{{ cartService.cartSummary().total | number }}</span></div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  `,
  styles: [`
    .checkout-page { padding-top: 2rem; padding-bottom: 4rem; }
    .page-title { font-size: 2rem; font-weight: 800; margin-bottom: 1.5rem; }

    .stepper-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.25rem 2rem;
      margin-bottom: 2.5rem;

      @media (max-width: 768px) { display: none; }
    }

    .step-item {
      display: flex;
      align-items: center;
      gap: 0.65rem;
      color: var(--zah-text-muted);

      .step-num { width: 32px; height: 32px; border-radius: 50%; background: var(--zah-surface-tertiary); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.85rem; }
      .step-label { font-size: 0.9rem; font-weight: 600; }

      &.active {
        color: var(--zah-text-primary);
        .step-num { background: var(--zah-accent); color: #0f172a; }
      }
    }

    .step-line {
      flex-grow: 1;
      height: 2px;
      background: var(--zah-border);
      margin: 0 1rem;
      &.active { background: var(--zah-accent); }
    }

    .checkout-layout {
      display: grid;
      grid-template-columns: 1fr 340px;
      gap: 2rem;

      @media (max-width: 992px) { grid-template-columns: 1fr; }
    }

    .step-card {
      padding: 2rem;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .card-header { display: flex; justify-content: space-between; align-items: center; }

    .addresses-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }

    .address-card {
      padding: 1.25rem;
      border-radius: var(--zah-radius-md);
      border: 2px solid var(--zah-border);
      cursor: pointer;
      display: flex;
      flex-direction: column;
      gap: 0.35rem;

      &.selected { border-color: var(--zah-accent); background: var(--zah-accent-light); }
    }

    .card-top { display: flex; gap: 0.5rem; }
    .type-badge { font-size: 0.6875rem; font-weight: 700; background: var(--zah-primary); color: var(--zah-text-inverse); padding: 0.15rem 0.4rem; border-radius: 4px; }
    .default-badge { font-size: 0.6875rem; font-weight: 700; background: var(--zah-accent); color: #0f172a; padding: 0.15rem 0.4rem; border-radius: 4px; }

    .delivery-options, .payment-methods { display: flex; flex-direction: column; gap: 1rem; }

    .delivery-card, .pay-card {
      padding: 1.25rem;
      border-radius: var(--zah-radius-md);
      border: 2px solid var(--zah-border);
      display: flex;
      align-items: center;
      gap: 1rem;
      cursor: pointer;

      &.selected { border-color: var(--zah-accent); background: var(--zah-accent-light); }
      .cost { margin-left: auto; font-weight: 800; color: var(--zah-accent); }
    }

    .step-footer { display: flex; justify-content: space-between; margin-top: 1.5rem; }
    .place-order-btn { flex-grow: 1; font-size: 1.1rem; }

    .summary-card { padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; }
    .summary-title { font-size: 1.1rem; font-weight: 800; margin: 0; }

    .cart-preview-list { display: flex; flex-direction: column; gap: 0.85rem; }
    .preview-item { display: flex; align-items: center; gap: 0.75rem; font-size: 0.85rem; img { width: 44px; height: 44px; border-radius: 4px; object-fit: cover; } .item-meta { flex-grow: 1; display: flex; flex-direction: column; .name { font-weight: 600; } .qty { font-size: 0.75rem; color: var(--zah-text-muted); } } .price { font-weight: 700; } }

    .totals-breakdown { display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.875rem; .row { display: flex; justify-content: space-between; &.total { font-size: 1.1rem; font-weight: 800; } } }
  `]
})
export class CheckoutComponent {
  cartService = inject(CartService);
  authService = inject(AuthService);
  orderService = inject(OrderService);
  notificationService = inject(NotificationService);
  router = inject(Router);

  currentStep = signal(1);
  selectedAddress = signal<Address | null>(this.authService.currentUser()?.addresses[0] || null);
  deliveryMethod = signal<'STANDARD' | 'EXPRESS'>('STANDARD');
  paymentMethod = signal<'UPI' | 'CARD' | 'COD'>('UPI');
  isAddressModalOpen = signal(false);

  goToStep(step: number) {
    this.currentStep.set(step);
  }

  submitOrder() {
    if (!this.selectedAddress()) {
      this.notificationService.error('Missing Address', 'Please select a delivery address.');
      return;
    }
    const newOrder = this.orderService.placeOrder(
      this.cartService.cartItems(),
      this.cartService.cartSummary(),
      this.selectedAddress()!,
      this.paymentMethod()
    );
    this.router.navigate(['/order-confirmation'], { queryParams: { orderId: newOrder.id } });
  }
}
