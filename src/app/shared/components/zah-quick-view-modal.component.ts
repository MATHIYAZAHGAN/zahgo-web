import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../core/models/product.model';
import { CartService } from '../../core/services/cart.service';
import { WishlistService } from '../../core/services/wishlist.service';

@Component({
  selector: 'zah-quick-view-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (product) {
      <div class="modal-backdrop animate-fade-in" (click)="close.emit()">
        <div class="modal-card zah-card animate-slide-up" (click)="$event.stopPropagation()">
          <button class="close-btn" (click)="close.emit()" aria-label="Close modal">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>

          <div class="modal-grid">
            <!-- Left Image Gallery -->
            <div class="gallery-col">
              <div class="main-img-box">
                <img [src]="selectedImage || product.images[0]" [alt]="product.name" />
              </div>
              @if (product.images.length > 1) {
                <div class="thumb-row">
                  @for (img of product.images; track $index) {
                    <button class="thumb-btn" [class.active]="selectedImage === img" (click)="selectedImage = img">
                      <img [src]="img" [alt]="product.name" />
                    </button>
                  }
                </div>
              }
            </div>

            <!-- Right Details Col -->
            <div class="details-col">
              <span class="brand-badge">{{ product.brand }}</span>
              <h2 class="title">{{ product.name }}</h2>

              <div class="rating-bar">
                <div class="stars">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#d4af37" stroke="#d4af37"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  <span>{{ product.rating }}</span>
                </div>
                <span class="review-count">({{ product.reviewCount }} reviews)</span>
              </div>

              <div class="price-box">
                <span class="current-price">₹{{ product.price | number }}</span>
                @if (product.originalPrice > product.price) {
                  <span class="original-price">₹{{ product.originalPrice | number }}</span>
                  <span class="discount-tag">{{ product.discountPercentage }}% OFF</span>
                }
              </div>

              <p class="description">{{ product.shortDescription }}</p>

              <!-- Color Selection -->
              @if (product.availableColors && product.availableColors.length > 0) {
                <div class="option-group">
                  <label>Color: <strong>{{ selectedColor?.name || product.availableColors[0].name }}</strong></label>
                  <div class="swatch-row">
                    @for (c of product.availableColors; track c.name) {
                      <button class="swatch-btn" [class.active]="selectedColor?.name === c.name" (click)="selectedColor = c" [title]="c.name">
                        <span class="swatch-color" [style.background-color]="c.hex"></span>
                      </button>
                    }
                  </div>
                </div>
              }

              <!-- Size Selection -->
              @if (product.availableSizes && product.availableSizes.length > 0) {
                <div class="option-group">
                  <label>Size: <strong>{{ selectedSize || product.availableSizes[0] }}</strong></label>
                  <div class="size-row">
                    @for (s of product.availableSizes; track s) {
                      <button class="size-btn" [class.active]="selectedSize === s" (click)="selectedSize = s">
                        {{ s }}
                      </button>
                    }
                  </div>
                </div>
              }

              <!-- Quantity & Actions -->
              <div class="action-row">
                <div class="qty-control">
                  <button (click)="changeQty(-1)" [disabled]="quantity <= 1">-</button>
                  <span>{{ quantity }}</span>
                  <button (click)="changeQty(1)" [disabled]="quantity >= product.stockCount">+</button>
                </div>

                <button class="zah-btn zah-btn-primary add-btn" (click)="addToCart()">
                  Add To Cart • ₹{{ (product.price * quantity) | number }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .modal-backdrop {
      position: fixed;
      inset: 0;
      z-index: 999;
      background: var(--zah-overlay-bg);
      backdrop-filter: blur(6px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
    }

    .modal-card {
      position: relative;
      background: var(--zah-surface);
      border-radius: var(--zah-radius-lg);
      max-width: 860px;
      width: 100%;
      max-height: 90vh;
      overflow-y: auto;
      padding: 2rem;
    }

    .close-btn {
      position: absolute;
      top: 1rem;
      right: 1rem;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: var(--zah-surface-secondary);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--zah-text-primary);
      z-index: 10;
      &:hover { background: var(--zah-border-strong); }
    }

    .modal-grid {
      display: grid;
      grid-template-columns: 1fr 1.2fr;
      gap: 2rem;

      @media (max-width: 768px) {
        grid-template-columns: 1fr;
      }
    }

    .main-img-box {
      width: 100%;
      height: 340px;
      border-radius: var(--zah-radius-md);
      overflow: hidden;
      background: var(--zah-surface-secondary);
      img { width: 100%; height: 100%; object-fit: cover; }
    }

    .thumb-row {
      display: flex;
      gap: 0.5rem;
      margin-top: 0.75rem;
    }

    .thumb-btn {
      width: 54px;
      height: 54px;
      border-radius: var(--zah-radius-sm);
      overflow: hidden;
      border: 2px solid transparent;
      img { width: 100%; height: 100%; object-fit: cover; }
      &.active { border-color: var(--zah-accent); }
    }

    .details-col {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .brand-badge {
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--zah-accent);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .title {
      font-size: 1.5rem;
      font-weight: 700;
      margin: 0;
    }

    .rating-bar {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      .stars { display: flex; align-items: center; gap: 0.25rem; font-weight: 700; }
      .review-count { color: var(--zah-text-muted); }
    }

    .price-box {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      .current-price { font-size: 1.5rem; font-weight: 800; color: var(--zah-text-primary); }
      .original-price { font-size: 1rem; color: var(--zah-text-muted); text-decoration: line-through; }
      .discount-tag { font-size: 0.8125rem; font-weight: 700; color: var(--zah-danger); background: var(--zah-danger-bg); padding: 0.2rem 0.5rem; border-radius: 4px; }
    }

    .description {
      font-size: 0.9375rem;
      color: var(--zah-text-secondary);
      line-height: 1.5;
    }

    .option-group {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
      label { font-size: 0.875rem; color: var(--zah-text-secondary); }
    }

    .swatch-row {
      display: flex;
      gap: 0.5rem;
    }

    .swatch-btn {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: 2px solid transparent;
      padding: 2px;
      &.active { border-color: var(--zah-accent); }
    }

    .swatch-color {
      display: block;
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }

    .size-row {
      display: flex;
      gap: 0.5rem;
    }

    .size-btn {
      padding: 0.4rem 0.85rem;
      border: 1px solid var(--zah-border-strong);
      border-radius: var(--zah-radius-sm);
      font-size: 0.85rem;
      font-weight: 600;
      &.active { background: var(--zah-primary); color: var(--zah-text-inverse); border-color: var(--zah-primary); }
    }

    .action-row {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-top: 1rem;
    }

    .qty-control {
      display: flex;
      align-items: center;
      border: 1px solid var(--zah-border-strong);
      border-radius: var(--zah-radius-md);
      overflow: hidden;
      button { width: 38px; height: 38px; font-size: 1.1rem; font-weight: 700; &:disabled { opacity: 0.4; } }
      span { width: 40px; text-align: center; font-weight: 600; }
    }

    .add-btn {
      flex-grow: 1;
    }
  `]
})
export class ZahQuickViewModalComponent {
  @Input() product: Product | null = null;
  @Output() close = new EventEmitter<void>();

  private cartService = inject(CartService);

  selectedImage: string | null = null;
  selectedColor: { name: string; hex: string } | null = null;
  selectedSize: string | null = null;
  quantity = 1;

  ngOnChanges() {
    if (this.product) {
      this.selectedImage = this.product.images[0];
      this.selectedColor = this.product.availableColors?.[0] || null;
      this.selectedSize = this.product.availableSizes?.[0] || null;
      this.quantity = 1;
    }
  }

  changeQty(delta: number) {
    this.quantity = Math.max(1, this.quantity + delta);
  }

  addToCart() {
    if (!this.product) return;
    this.cartService.addToCart(this.product, this.quantity, this.selectedColor || undefined, this.selectedSize || undefined);
    this.close.emit();
  }
}
