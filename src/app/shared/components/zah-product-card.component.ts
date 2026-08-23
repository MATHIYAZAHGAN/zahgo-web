import { Component, Input, Output, EventEmitter, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Product } from '../../core/models/product.model';
import { CartService } from '../../core/services/cart.service';
import { WishlistService } from '../../core/services/wishlist.service';

@Component({
  selector: 'zah-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="product-card zah-card group" [class.loading]="imageLoading()">
      <!-- Media Header -->
      <div class="card-media">
        <a [routerLink]="['/products', product.slug]" class="media-link">
          <!-- Image Loading Placeholder -->
          @if (imageLoading()) {
            <div class="image-skeleton"></div>
          }
          <img 
            [src]="currentImage" 
            [alt]="product.name" 
            class="main-image" 
            [class.loaded]="!imageLoading()"
            loading="lazy" 
            (load)="onImageLoad()"
            (mouseenter)="onMouseEnter()" 
            (mouseleave)="onMouseLeave()" />
        </a>

        <!-- Badges -->
        <div class="badge-container">
          @if (product.isNew) {
            <span class="zah-badge zah-badge-primary badge-animate">✨ NEW</span>
          }
          @if (product.isFlashSale) {
            <span class="zah-badge zah-badge-accent badge-pulse">⚡ FLASH SALE</span>
          }
          @if (product.discountPercentage > 0) {
            <span class="zah-badge zah-badge-danger">-{{ product.discountPercentage }}% OFF</span>
          }
          @if (product.stockCount < 10 && product.stockCount > 0) {
            <span class="zah-badge zah-badge-warning">⏰ ONLY {{ product.stockCount }} LEFT</span>
          }
        </div>

        <!-- Wishlist Button with Animation -->
        <button 
          class="wishlist-btn" 
          [class.active]="isInWishlist()"
          [class.animate-heart]="wishlistAnimating()"
          (click)="toggleWishlist($event)"
          [attr.aria-label]="isInWishlist() ? 'Remove from Wishlist' : 'Add to Wishlist'">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" [attr.fill]="isInWishlist() ? '#ef4444' : 'none'" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
          </svg>
        </button>

        <!-- Quick View Overlay -->
        <div class="quick-actions">
          <button class="zah-btn zah-btn-sm zah-btn-ghost quick-view-btn" (click)="onQuickViewClick($event)">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
            Quick View
          </button>
        </div>

        <!-- Express Delivery Badge - Removed (property doesn't exist) -->
      </div>

      <!-- Card Body -->
      <div class="card-body">
        <div class="brand-name">{{ product.brand }}</div>
        <h3 class="product-title">
          <a [routerLink]="['/products', product.slug]">{{ product.name }}</a>
        </h3>

        <!-- Rating with Stars -->
        <div class="rating-row">
          <div class="stars">
            @for (star of [1,2,3,4,5]; track star) {
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" 
                [attr.fill]="star <= product.rating ? '#d4af37' : 'none'" 
                [attr.stroke]="star <= product.rating ? '#d4af37' : '#94a3b8'" 
                stroke-width="1.5">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            }
            <span class="rating-value">{{ product.rating }}</span>
          </div>
          <span class="review-count">({{ product.reviewCount }} reviews)</span>
        </div>

        <!-- Pricing with Savings -->
        <div class="price-row">
          <div class="current-price">₹{{ product.price | number }}</div>
          @if (product.originalPrice > product.price) {
            <div class="original-price">₹{{ product.originalPrice | number }}</div>
            <div class="savings-badge">Save ₹{{ (product.originalPrice - product.price) | number }}</div>
          }
        </div>

        <!-- Stock Status Indicator -->
        @if (!product.inStock) {
          <div class="stock-status out-of-stock">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
            Out of Stock
          </div>
        } @else if (product.stockCount < 10) {
          <div class="stock-status low-stock">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
            Only {{ product.stockCount }} left in stock!
          </div>
        } @else {
          <div class="stock-status in-stock">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
            In Stock
          </div>
        }

        <!-- Add To Cart CTA with Loading State -->
        <button 
          class="zah-btn zah-btn-sm zah-btn-outline add-cart-btn" 
          [class.loading]="cartLoading()"
          [disabled]="!product.inStock"
          (click)="addToCart($event)">
          @if (cartLoading()) {
            <span class="btn-spinner"></span>
            Adding...
          } @else {
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
            Add To Cart
          }
        </button>
      </div>
    </div>
  `,
  styles: [`
    .product-card {
      position: relative;
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: hidden;
      border-radius: var(--zah-radius-md);
      background-color: var(--zah-surface);
      border: 1px solid var(--zah-border);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;

      &:hover {
        transform: translateY(-6px);
        box-shadow: 0 12px 24px -10px rgba(0, 0, 0, 0.15);
        border-color: var(--zah-accent);

        .quick-actions {
          opacity: 1;
          transform: translateY(0);
        }

        .main-image {
          transform: scale(1.08);
        }
      }

      &.loading {
        .image-skeleton {
          animation: shimmer 1.5s infinite;
        }
      }
    }

    @keyframes shimmer {
      0% { background-position: -1000px 0; }
      100% { background-position: 1000px 0; }
    }

    .card-media {
      position: relative;
      width: 100%;
      padding-top: 100%; /* 1:1 Aspect Ratio */
      background-color: var(--zah-surface-secondary);
      overflow: hidden;

      .media-link {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }

      .image-skeleton {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 2000px 100%;
      }

      .main-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease;
        opacity: 0;

        &.loaded {
          opacity: 1;
        }

        &:hover {
          transform: scale(1.08);
        }
      }
    }

    .badge-container {
      position: absolute;
      top: 0.75rem;
      left: 0.75rem;
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
      z-index: 2;
    }

    .badge-animate {
      animation: badge-entrance 0.5s ease-out;
    }

    .badge-pulse {
      animation: pulse-badge 2s infinite;
    }

    @keyframes badge-entrance {
      from {
        opacity: 0;
        transform: translateX(-10px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    @keyframes pulse-badge {
      0%, 100% {
        transform: scale(1);
        opacity: 1;
      }
      50% {
        transform: scale(1.05);
        opacity: 0.9;
      }
    }

    .wishlist-btn {
      position: absolute;
      top: 0.75rem;
      right: 0.75rem;
      width: 38px;
      height: 38px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(8px);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      color: var(--zah-text-secondary);

      &:hover {
        transform: scale(1.2);
        color: var(--zah-danger);
        box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
      }

      &.active {
        color: var(--zah-danger);
        background: rgba(239, 68, 68, 0.1);
      }

      &.animate-heart {
        animation: heartbeat 0.5s ease;
      }
    }

    @keyframes heartbeat {
      0%, 100% { transform: scale(1); }
      25% { transform: scale(1.3); }
      50% { transform: scale(1.1); }
      75% { transform: scale(1.25); }
    }

    .quick-actions {
      position: absolute;
      bottom: 0.75rem;
      left: 0.75rem;
      right: 0.75rem;
      opacity: 0;
      transform: translateY(10px);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 2;

      .quick-view-btn {
        width: 100%;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        color: #0f172a;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        border: none;
        font-weight: 600;

        &:hover {
          background: #ffffff;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
        }
      }
    }

    .card-body {
      padding: 1.1rem;
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      gap: 0.45rem;
    }

    .brand-name {
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--zah-accent);
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    .product-title {
      font-size: 0.95rem;
      font-weight: 600;
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      height: 2.8em;
      margin-bottom: 0.2rem;

      a {
        color: var(--zah-text-primary);
        transition: color 0.2s ease;
        
        &:hover {
          color: var(--zah-accent);
        }
      }
    }

    .rating-row {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.8125rem;
      margin-top: 0.1rem;

      .stars {
        display: flex;
        align-items: center;
        gap: 0.15rem;
      }

      .rating-value {
        font-weight: 700;
        color: var(--zah-text-primary);
        margin-left: 0.25rem;
      }

      .review-count {
        color: var(--zah-text-muted);
      }
    }

    .price-row {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex-wrap: wrap;
      margin-top: 0.3rem;

      .current-price {
        font-size: 1.2rem;
        font-weight: 800;
        color: var(--zah-text-primary);
      }

      .original-price {
        font-size: 0.9rem;
        color: var(--zah-text-muted);
        text-decoration: line-through;
      }

      .savings-badge {
        font-size: 0.7rem;
        font-weight: 700;
        color: #10b981;
        background: rgba(16, 185, 129, 0.1);
        padding: 0.15rem 0.45rem;
        border-radius: var(--zah-radius-sm);
      }
    }

    .stock-status {
      display: flex;
      align-items: center;
      gap: 0.35rem;
      font-size: 0.75rem;
      font-weight: 600;
      padding: 0.35rem 0.5rem;
      border-radius: var(--zah-radius-sm);
      margin-top: 0.3rem;

      &.in-stock {
        color: #10b981;
        background: rgba(16, 185, 129, 0.1);
      }

      &.low-stock {
        color: #f59e0b;
        background: rgba(245, 158, 11, 0.1);
        animation: gentle-pulse 2s infinite;
      }

      &.out-of-stock {
        color: #ef4444;
        background: rgba(239, 68, 68, 0.1);
      }
    }

    @keyframes gentle-pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
    }

    .add-cart-btn {
      width: 100%;
      margin-top: auto;
      padding-top: 0.65rem;
      padding-bottom: 0.65rem;
      font-weight: 600;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

      &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
      }

      &:active:not(:disabled) {
        transform: translateY(0);
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      &.loading {
        pointer-events: none;
      }
    }

    .btn-spinner {
      display: inline-block;
      width: 14px;
      height: 14px;
      border: 2px solid currentColor;
      border-right-color: transparent;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
      margin-right: 0.5rem;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class ZahProductCardComponent {
  @Input({ required: true }) product!: Product;
  @Output() quickView = new EventEmitter<Product>();

  private cartService = inject(CartService);
  private wishlistService = inject(WishlistService);

  currentImage = '';
  imageLoading = signal(true);
  cartLoading = signal(false);
  wishlistAnimating = signal(false);

  ngOnInit() {
    this.currentImage = this.product.images[0] || 'assets/images/placeholder.jpg';
  }

  onImageLoad() {
    this.imageLoading.set(false);
  }

  onMouseEnter() {
    if (this.product.images.length > 1) {
      this.currentImage = this.product.images[1];
    }
  }

  onMouseLeave() {
    this.currentImage = this.product.images[0];
  }

  isInWishlist(): boolean {
    return this.wishlistService.isInWishlist(this.product.id);
  }

  toggleWishlist(event: Event) {
    event.stopPropagation();
    event.preventDefault();
    
    this.wishlistAnimating.set(true);
    setTimeout(() => this.wishlistAnimating.set(false), 500);
    
    this.wishlistService.toggleWishlist(this.product);
  }

  addToCart(event: Event) {
    event.stopPropagation();
    event.preventDefault();
    
    this.cartLoading.set(true);
    
    // Simulate loading for better UX
    setTimeout(() => {
      this.cartService.addToCart(this.product, 1);
      this.cartLoading.set(false);
    }, 400);
  }

  onQuickViewClick(event: Event) {
    event.stopPropagation();
    event.preventDefault();
    this.quickView.emit(this.product);
  }
}
