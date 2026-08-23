import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../core/services/cart.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { ZahEmptyStateComponent } from '../../shared/components/zah-empty-state.component';

@Component({
  selector: 'zah-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ZahEmptyStateComponent],
  template: `
    <div class="zah-container cart-page">
      <h1 class="page-title">Your Shopping Bag</h1>

      @if (cartService.cartItems().length > 0) {
        <div class="cart-layout">
          <!-- Items List -->
          <div class="items-column">
            <div class="free-shipping-card zah-card">
              @if (cartService.cartSummary().amountForFreeShipping > 0) {
                <p>Add <strong>₹{{ cartService.cartSummary().amountForFreeShipping | number }}</strong> more for FREE Express Shipping!</p>
              } @else {
                <p class="unlocked">🎉 You unlocked FREE Express Shipping!</p>
              }
            </div>

            <div class="items-list zah-card">
              @for (item of cartService.cartItems(); track item.id) {
                <div class="cart-item-row">
                  <img [src]="item.product.images[0]" [alt]="item.product.name" class="item-thumb" />
                  <div class="item-main">
                    <span class="brand-tag">{{ item.product.brand }}</span>
                    <h3 class="title"><a [routerLink]="['/products', item.product.slug]">{{ item.product.name }}</a></h3>
                    <div class="variants">
                      @if (item.selectedColor) { <span>Color: {{ item.selectedColor.name }}</span> }
                      @if (item.selectedSize) { <span>Size: {{ item.selectedSize }}</span> }
                    </div>
                  </div>

                  <div class="qty-col">
                    <button (click)="cartService.updateQuantity(item.id, item.quantity - 1)">-</button>
                    <span>{{ item.quantity }}</span>
                    <button (click)="cartService.updateQuantity(item.id, item.quantity + 1)">+</button>
                  </div>

                  <div class="price-col">
                    <span class="total-price">₹{{ item.totalPrice | number }}</span>
                    <button class="remove-btn" (click)="cartService.removeFromCart(item.id)">Remove</button>
                  </div>
                </div>
              }
            </div>
          </div>

          <!-- Summary Sidebar -->
          <div class="summary-column">
            <div class="summary-card zah-card">
              <h3 class="summary-title">Order Summary</h3>

              <div class="coupon-box">
                <input type="text" placeholder="Promo code (e.g. ZAH10)" [(ngModel)]="couponInput" />
                <button class="zah-btn zah-btn-sm zah-btn-outline" (click)="applyCoupon()">Apply</button>
              </div>

              <div class="summary-rows">
                <div class="row"><span>Subtotal</span><span>₹{{ cartService.cartSummary().subtotal | number }}</span></div>
                @if (cartService.cartSummary().discountAmount > 0) {
                  <div class="row discount"><span>Discount</span><span>-₹{{ cartService.cartSummary().discountAmount | number }}</span></div>
                }
                <div class="row"><span>Shipping</span><span>{{ cartService.cartSummary().shippingFee === 0 ? 'FREE' : '₹' + cartService.cartSummary().shippingFee }}</span></div>
                <div class="row"><span>Estimated Tax</span><span>₹{{ cartService.cartSummary().estimatedTax | number }}</span></div>
                <hr />
                <div class="row grand-total"><span>Total</span><span>₹{{ cartService.cartSummary().total | number }}</span></div>
              </div>

              <button class="zah-btn zah-btn-accent checkout-btn" (click)="router.navigate(['/checkout'])">
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      } @else {
        <zah-empty-state icon="cart" title="Your Bag is Empty" description="Browse through our collections to find items you love." actionLink="/products" actionLabel="Explore Products"></zah-empty-state>
      }
    </div>
  `,
  styles: [`
    .cart-page { padding-top: 2rem; padding-bottom: 4rem; }
    .page-title { font-size: 2rem; font-weight: 800; margin-bottom: 2rem; }
    .cart-layout { display: grid; grid-template-columns: 1fr 340px; gap: 2rem; @media (max-width: 992px) { grid-template-columns: 1fr; } }
    .free-shipping-card { padding: 1rem; margin-bottom: 1.25rem; background: var(--zah-accent-light); p { margin: 0; font-size: 0.875rem; font-weight: 600; &.unlocked { color: var(--zah-success); } } }
    .items-list { padding: 1.5rem; display: flex; flex-direction: column; gap: 1.5rem; }
    .cart-item-row { display: flex; align-items: center; gap: 1.25rem; border-bottom: 1px solid var(--zah-border); padding-bottom: 1.25rem; }
    .item-thumb { width: 80px; height: 80px; border-radius: var(--zah-radius-sm); object-fit: cover; }
    .item-main { flex-grow: 1; .brand-tag { font-size: 0.725rem; font-weight: 700; color: var(--zah-accent); } .title { font-size: 1rem; font-weight: 600; margin: 0.2rem 0; } .variants { font-size: 0.775rem; color: var(--zah-text-muted); display: flex; gap: 0.5rem; } }
    .qty-col { display: flex; align-items: center; border: 1px solid var(--zah-border-strong); border-radius: var(--zah-radius-sm); button { width: 32px; height: 32px; font-weight: 700; } span { width: 32px; text-align: center; font-weight: 600; } }
    .price-col { display: flex; flex-direction: column; align-items: flex-end; gap: 0.25rem; .total-price { font-size: 1.1rem; font-weight: 800; } .remove-btn { font-size: 0.75rem; color: var(--zah-danger); } }
    .summary-card { padding: 1.5rem; display: flex; flex-direction: column; gap: 1.25rem; }
    .summary-title { font-size: 1.2rem; font-weight: 800; margin: 0; }
    .coupon-box { display: flex; gap: 0.5rem; input { flex-grow: 1; padding: 0.5rem; border-radius: var(--zah-radius-sm); border: 1px solid var(--zah-border-strong); background: var(--zah-surface); color: var(--zah-text-primary); font-size: 0.85rem; } }
    .summary-rows { display: flex; flex-direction: column; gap: 0.65rem; font-size: 0.9rem; .row { display: flex; justify-content: space-between; color: var(--zah-text-secondary); &.discount { color: var(--zah-success); } &.grand-total { font-size: 1.15rem; font-weight: 800; color: var(--zah-text-primary); } } }
    .checkout-btn { width: 100%; padding: 0.85rem; }
  `]
})
export class CartComponent {
  cartService = inject(CartService);
  router = inject(Router);

  couponInput = '';

  applyCoupon() {
    if (this.couponInput.trim()) {
      this.cartService.applyCoupon(this.couponInput.trim());
      this.couponInput = '';
    }
  }
}
