import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../core/services/cart.service';
import { WishlistService } from '../../core/services/wishlist.service';

@Component({
  selector: 'zah-cart-drawer',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    @if (cartService.isCartDrawerOpen()) {
      <div class="drawer-overlay animate-fade-in" (click)="cartService.closeCartDrawer()">
        <div class="drawer-panel animate-slide-up" (click)="$event.stopPropagation()">
          <!-- Header -->
          <div class="drawer-header">
            <div class="header-title">
              <h3>Shopping Bag</h3>
              <span class="badge-tag">{{ cartService.totalItemCount() }} items</span>
            </div>
            <button class="close-btn" (click)="cartService.closeCartDrawer()">×</button>
          </div>

          <!-- Free Shipping Progress Bar -->
          <div class="free-shipping-bar">
            @if (cartService.cartSummary().amountForFreeShipping > 0) {
              <p>Add <strong>₹{{ cartService.cartSummary().amountForFreeShipping | number }}</strong> more for <strong>FREE EXPRESS SHIPPING</strong></p>
              <div class="progress-track">
                <div class="progress-fill" [style.width.%]="(cartService.cartSummary().subtotal / cartService.cartSummary().freeShippingThreshold) * 100"></div>
              </div>
            } @else {
              <p class="unlocked">🎉 You unlocked <strong>FREE EXPRESS SHIPPING!</strong></p>
            }
          </div>

          <!-- Drawer Body: Cart Items -->
          <div class="drawer-body">
            @if (cartService.cartItems().length > 0) {
              <div class="items-list">
                @for (item of cartService.cartItems(); track item.id) {
                  <div class="cart-item">
                    <img [src]="item.product.images[0]" [alt]="item.product.name" class="item-img" />
                    <div class="item-details">
                      <span class="item-brand">{{ item.product.brand }}</span>
                      <h4 class="item-name">{{ item.product.name }}</h4>
                      
                      <div class="variant-tags">
                        @if (item.selectedColor) {
                          <span class="tag">Color: {{ item.selectedColor.name }}</span>
                        }
                        @if (item.selectedSize) {
                          <span class="tag">Size: {{ item.selectedSize }}</span>
                        }
                      </div>

                      <div class="item-bottom-row">
                        <!-- Qty Selector -->
                        <div class="qty-btn-group">
                          <button (click)="cartService.updateQuantity(item.id, item.quantity - 1)">-</button>
                          <span>{{ item.quantity }}</span>
                          <button (click)="cartService.updateQuantity(item.id, item.quantity + 1)">+</button>
                        </div>

                        <div class="price-box">
                          <span class="item-price">₹{{ item.totalPrice | number }}</span>
                        </div>
                      </div>

                      <!-- Remove & Wishlist Link -->
                      <div class="action-links">
                        <button (click)="moveToWishlist(item)">Move to Wishlist</button>
                        <span>•</span>
                        <button class="remove-btn" (click)="cartService.removeFromCart(item.id)">Remove</button>
                      </div>
                    </div>
                  </div>
                }
              </div>
            } @else {
              <div class="empty-cart">
                <div class="empty-icon">🛍️</div>
                <h3>Your bag is empty</h3>
                <p>Explore our curated luxury collections and add your favorite pieces.</p>
                <button class="zah-btn zah-btn-primary" (click)="cartService.closeCartDrawer(); router.navigate(['/products'])">
                  Explore Catalog
                </button>
              </div>
            }
          </div>

          <!-- Drawer Footer: Summary & Checkout CTA -->
          @if (cartService.cartItems().length > 0) {
            <div class="drawer-footer">
              <!-- Coupon Input -->
              <div class="coupon-section">
                @if (cartService.appliedCoupon()) {
                  <div class="applied-coupon-tag">
                    <span>Code <strong>{{ cartService.appliedCoupon()?.code }}</strong> Applied ({{ cartService.appliedCoupon()?.discountPercentage }}% OFF)</span>
                    <button (click)="cartService.removeCoupon()">Remove</button>
                  </div>
                } @else {
                  <div class="coupon-form">
                    <input type="text" placeholder="Promo code (e.g. ZAH10)" [(ngModel)]="couponCodeInput" />
                    <button class="zah-btn zah-btn-sm zah-btn-outline" (click)="applyCoupon()">Apply</button>
                  </div>
                }
              </div>

              <!-- Price Breakdown -->
              <div class="summary-breakdown">
                <div class="summary-row">
                  <span>Subtotal</span>
                  <span>₹{{ cartService.cartSummary().subtotal | number }}</span>
                </div>
                @if (cartService.cartSummary().discountAmount > 0) {
                  <div class="summary-row discount">
                    <span>Discount</span>
                    <span>-₹{{ cartService.cartSummary().discountAmount | number }}</span>
                  </div>
                }
                <div class="summary-row">
                  <span>Estimated Shipping</span>
                  <span>{{ cartService.cartSummary().shippingFee === 0 ? 'FREE' : '₹' + cartService.cartSummary().shippingFee }}</span>
                </div>
                <div class="summary-row total">
                  <span>Total Amount</span>
                  <span>₹{{ cartService.cartSummary().total | number }}</span>
                </div>
              </div>

              <!-- Checkout CTAs -->
              <div class="checkout-actions">
                <button class="zah-btn zah-btn-accent checkout-btn" (click)="goToCheckout()">
                  Proceed to Checkout • ₹{{ cartService.cartSummary().total | number }}
                </button>
                <a routerLink="/cart" class="view-bag-link" (click)="cartService.closeCartDrawer()">View Detailed Bag</a>
              </div>
            </div>
          }
        </div>
      </div>
    }
  `,
  styles: [`
    .drawer-overlay {
      position: fixed;
      inset: 0;
      z-index: 1000;
      background: var(--zah-overlay-bg);
      backdrop-filter: blur(6px);
      display: flex;
      justify-content: flex-end;
    }

    .drawer-panel {
      width: 440px;
      max-width: 100vw;
      height: 100%;
      background: var(--zah-surface);
      display: flex;
      flex-direction: column;
      box-shadow: var(--zah-shadow-xl);
    }

    .drawer-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.25rem;
      padding-top: calc(1.25rem + var(--zah-safe-top));
      border-bottom: 1px solid var(--zah-border);

      .header-title {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        h3 { margin: 0; font-size: 1.2rem; font-weight: 700; }
        .badge-tag { font-size: 0.75rem; font-weight: 600; background: var(--zah-surface-secondary); padding: 0.2rem 0.5rem; border-radius: 4px; }
      }

      .close-btn { font-size: 1.6rem; color: var(--zah-text-muted); &:hover { color: var(--zah-text-primary); } }
    }

    .free-shipping-bar {
      background: var(--zah-accent-light);
      padding: 0.65rem 1.25rem;
      border-bottom: 1px solid var(--zah-border);
      p { font-size: 0.8125rem; margin: 0 0 0.35rem 0; color: var(--zah-text-primary); &.unlocked { color: var(--zah-success); margin: 0; } }
      .progress-track { width: 100%; height: 6px; background: rgba(0,0,0,0.1); border-radius: 3px; overflow: hidden; }
      .progress-fill { height: 100%; background: var(--zah-accent); border-radius: 3px; transition: width 0.3s ease; }
    }

    .drawer-body {
      flex-grow: 1;
      overflow-y: auto;
      padding: 1.25rem;
    }

    .items-list {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .cart-item {
      display: flex;
      gap: 1rem;
      padding-bottom: 1.25rem;
      border-bottom: 1px solid var(--zah-border);
    }

    .item-img {
      width: 76px;
      height: 76px;
      border-radius: var(--zah-radius-sm);
      object-fit: cover;
      background: var(--zah-surface-secondary);
    }

    .item-details {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
    }

    .item-brand { font-size: 0.725rem; font-weight: 700; color: var(--zah-accent); text-transform: uppercase; }
    .item-name { font-size: 0.875rem; font-weight: 600; margin: 0; line-height: 1.3; color: var(--zah-text-primary); }

    .variant-tags {
      display: flex;
      gap: 0.5rem;
      .tag { font-size: 0.75rem; color: var(--zah-text-muted); }
    }

    .item-bottom-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 0.4rem;
    }

    .qty-btn-group {
      display: flex;
      align-items: center;
      border: 1px solid var(--zah-border-strong);
      border-radius: var(--zah-radius-sm);

      button {
        width: var(--zah-touch-target);
        height: var(--zah-touch-target);
        font-weight: 700;
        font-size: 1.1rem;
        color: var(--zah-text-primary);
        border-radius: var(--zah-radius-sm);

        &:active { background: var(--zah-surface-secondary); }
      }

      span { width: 32px; text-align: center; font-size: 0.9rem; font-weight: 600; }
    }

    .item-price { font-size: 0.95rem; font-weight: 700; color: var(--zah-text-primary); }

    .action-links {
      display: flex;
      gap: 0.5rem;
      font-size: 0.75rem;
      margin-top: 0.35rem;
      button { color: var(--zah-text-muted); &:hover { color: var(--zah-text-primary); text-decoration: underline; } }
      .remove-btn { color: var(--zah-danger); }
    }

    .empty-cart {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 3rem 1rem;
      .empty-icon { font-size: 3rem; margin-bottom: 1rem; }
      h3 { font-size: 1.25rem; margin-bottom: 0.5rem; }
      p { font-size: 0.875rem; color: var(--zah-text-muted); max-width: 260px; margin-bottom: 1.5rem; }
    }

    .drawer-footer {
      padding: 1.25rem;
      padding-bottom: calc(1.25rem + var(--zah-safe-bottom));
      border-top: 1px solid var(--zah-border);
      background: var(--zah-surface);
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
    }

    .coupon-form {
      display: flex;
      gap: 0.5rem;
      input { flex-grow: 1; padding: 0.4rem 0.75rem; font-size: 0.8125rem; border-radius: var(--zah-radius-sm); border: 1px solid var(--zah-border-strong); background: var(--zah-surface); color: var(--zah-text-primary); }
    }

    .applied-coupon-tag {
      font-size: 0.775rem;
      color: var(--zah-success);
      background: var(--zah-success-bg);
      padding: 0.4rem 0.75rem;
      border-radius: var(--zah-radius-sm);
      display: flex;
      justify-content: space-between;
      button { font-weight: 700; color: var(--zah-danger); }
    }

    .summary-breakdown {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
      font-size: 0.85rem;
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      color: var(--zah-text-secondary);

      &.discount { color: var(--zah-success); }
      &.total { font-size: 1.05rem; font-weight: 800; color: var(--zah-text-primary); padding-top: 0.35rem; border-top: 1px dashed var(--zah-border); }
    }

    .checkout-actions {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      text-align: center;
    }

    .checkout-btn { width: 100%; padding: 0.85rem; font-size: 1rem; }
    .view-bag-link { font-size: 0.8125rem; color: var(--zah-text-muted); text-decoration: underline; &:hover { color: var(--zah-text-primary); } }
  `]
})
export class ZahCartDrawerComponent {
  cartService = inject(CartService);
  wishlistService = inject(WishlistService);
  router = inject(Router);

  couponCodeInput = '';

  applyCoupon() {
    if (this.couponCodeInput.trim()) {
      if (this.cartService.applyCoupon(this.couponCodeInput.trim())) {
        this.couponCodeInput = '';
      }
    }
  }

  moveToWishlist(item: any) {
    this.wishlistService.toggleWishlist(item.product);
    this.cartService.removeFromCart(item.id);
  }

  goToCheckout() {
    this.cartService.closeCartDrawer();
    this.router.navigate(['/checkout']);
  }
}
