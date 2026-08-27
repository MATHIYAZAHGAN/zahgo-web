import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { NotificationService } from '../../core/services/notification.service';
import { Product } from '../../core/models/product.model';
import { ZahProductCardComponent } from '../../shared/components/zah-product-card.component';
import { ZahQuickViewModalComponent } from '../../shared/components/zah-quick-view-modal.component';

@Component({
  selector: 'zah-product-details',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ZahProductCardComponent, ZahQuickViewModalComponent],
  template: `
    @if (product()) {
      <div class="zah-container product-detail-page">
        <!-- Breadcrumbs -->
        <div class="breadcrumb-row">
          <a routerLink="/">Home</a>
          <span class="sep">/</span>
          <a routerLink="/products">Products</a>
          <span class="sep">/</span>
          <span class="current">{{ product()?.name }}</span>
        </div>

        <!-- Top Overview Section -->
        <div class="product-main-grid">
          <!-- Left: Gallery -->
          <div class="gallery-column">
            <div class="main-image-frame zah-card">
              <img [src]="activeImage()" [alt]="product()?.name" class="zoom-img" />
              <button class="wishlist-float-btn" [class.active]="isInWishlist()" (click)="toggleWishlist()">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" [attr.fill]="isInWishlist() ? '#ef4444' : 'none'" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
              </button>
            </div>

            <!-- Thumbnails -->
            <div class="thumbnails-list">
              @for (img of product()?.images; track img) {
                <button class="thumb-box" [class.active]="activeImage() === img" (click)="activeImage.set(img)">
                  <img [src]="img" [alt]="product()?.name" />
                </button>
              }
            </div>
          </div>

          <!-- Right: Details & Purchase Options -->
          <div class="info-column">
            <span class="brand-tag">{{ product()?.brand }}</span>
            <h1 class="product-title">{{ product()?.name }}</h1>

            <!-- Ratings Bar -->
            <div class="rating-bar">
              <div class="stars">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#d4af37" stroke="#d4af37"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <span>{{ product()?.rating }}</span>
              </div>
              <span class="review-count">({{ product()?.reviewCount }} customer ratings)</span>
              <span class="in-stock-tag" [class.out]="!product()?.inStock">
                {{ product()?.inStock ? 'In Stock (' + product()?.stockCount + ' left)' : 'Out of Stock' }}
              </span>
            </div>

            <!-- Pricing Banner -->
            <div class="price-banner zah-card">
              <div class="price-row">
                <span class="current-price">₹{{ product()?.price | number }}</span>
                @if ((product()?.originalPrice || 0) > (product()?.price || 0)) {
                  <span class="original-price">₹{{ product()?.originalPrice | number }}</span>
                  <span class="discount-badge">{{ product()?.discountPercentage }}% OFF</span>
                }
              </div>
              <p class="savings-text">Inclusive of all taxes. Free express shipping applied.</p>
            </div>

            <p class="description">{{ product()?.description }}</p>

            <!-- Color Swatches -->
            @if (product()?.availableColors && (product()?.availableColors?.length || 0) > 0) {
              <div class="variant-section">
                <label class="variant-label">Select Color: <strong>{{ selectedColor()?.name }}</strong></label>
                <div class="swatches-row">
                  @for (c of product()?.availableColors; track c.name) {
                    <button class="swatch-btn" [class.active]="selectedColor()?.name === c.name" (click)="selectedColor.set(c)">
                      <span class="color-dot" [style.background-color]="c.hex"></span>
                    </button>
                  }
                </div>
              </div>
            }

            <!-- Size Selector -->
            @if (product()?.availableSizes && (product()?.availableSizes?.length || 0) > 0) {
              <div class="variant-section">
                <label class="variant-label">Select Size: <strong>{{ selectedSize() }}</strong></label>
                <div class="sizes-row">
                  @for (s of product()?.availableSizes; track s) {
                    <button class="size-btn" [class.active]="selectedSize() === s" (click)="selectedSize.set(s)">
                      {{ s }}
                    </button>
                  }
                </div>
              </div>
            }

            <!-- Delivery Pincode Checker -->
            <div class="pincode-box zah-card">
              <span class="pincode-title">🚚 Check Delivery & Assembly</span>
              <div class="pincode-input-row">
                <input type="text" placeholder="Enter 6-digit Pincode" [(ngModel)]="pincodeInput" maxlength="6" />
                <button class="zah-btn zah-btn-sm zah-btn-primary" (click)="checkPincode()">Check</button>
              </div>
              @if (deliveryEstimate()) {
                <p class="delivery-status">✓ Delivery guaranteed by <strong>{{ deliveryEstimate() }}</strong></p>
              }
            </div>

            <!-- Quantity & Actions -->
            <div class="action-buttons-row">
              <div class="qty-control">
                <button (click)="changeQty(-1)" [disabled]="quantity() <= 1">-</button>
                <span>{{ quantity() }}</span>
                <button (click)="changeQty(1)" [disabled]="quantity() >= (product()?.stockCount || 10)">+</button>
              </div>

              <button class="zah-btn zah-btn-primary add-cart-btn" (click)="addToCart()">
                Add To Cart
              </button>

              <button class="zah-btn zah-btn-accent buy-now-btn" (click)="buyNow()">
                Buy Now
              </button>
            </div>
          </div>
        </div>

        <!-- Frequently Bought Together Section -->
        <div class="bundle-section zah-card">
          <h3 class="bundle-title">Frequently Bought Together</h3>
          <div class="bundle-grid">
            <div class="bundle-items">
              <div class="bundle-item">
                <img [src]="product()?.images?.[0]" [alt]="product()?.name" />
                <span>{{ product()?.name }} (₹{{ product()?.price | number }})</span>
              </div>
              <span class="plus">+</span>
              <div class="bundle-item">
                <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=200&q=80" alt="Watch" />
                <span>ZAH Luxe Watch (₹6,499)</span>
              </div>
            </div>

            <div class="bundle-checkout">
              <div class="total-price">
                <span class="label">Total Combo Price:</span>
                <span class="price">₹{{ ((product()?.price || 0) + 6499 - 1000) | number }}</span>
                <span class="save-tag">Save ₹1,000</span>
              </div>
              <button class="zah-btn zah-btn-accent" (click)="addBundleToCart()">Add Combo to Bag</button>
            </div>
          </div>
        </div>

        <!-- Detailed Tabs (Description, Specifications, Reviews, Q&A) -->
        <div class="tabs-container zah-card">
          <div class="tabs-header">
            <button [class.active]="activeTab() === 'desc'" (click)="activeTab.set('desc')">Description</button>
            <button [class.active]="activeTab() === 'specs'" (click)="activeTab.set('specs')">Specifications</button>
            <button [class.active]="activeTab() === 'reviews'" (click)="activeTab.set('reviews')">Customer Reviews ({{ product()?.reviews?.length || 0 }})</button>
          </div>

          <div class="tab-body">
            @if (activeTab() === 'desc') {
              <div class="tab-content">
                <p>{{ product()?.description }}</p>
                <ul>
                  <li>Precision engineered using sustainable luxury materials.</li>
                  <li>Backed by ZAH 2-Year Enterprise Warranty.</li>
                  <li>Free 30-day hassle-free return and exchange policy.</li>
                </ul>
              </div>
            } @else if (activeTab() === 'specs') {
              <div class="specs-table">
                @for (spec of product()?.specifications; track spec.name) {
                  <div class="spec-row">
                    <span class="spec-name">{{ spec.name }}</span>
                    <span class="spec-value">{{ spec.value }}</span>
                  </div>
                }
              </div>
            } @else if (activeTab() === 'reviews') {
              <div class="reviews-list">
                @for (rev of product()?.reviews; track rev.id) {
                  <div class="review-item">
                    <div class="review-meta">
                      <strong>{{ rev.userName }}</strong>
                      <span class="badge-verified">✓ Verified Buyer</span>
                      <span class="review-date">{{ rev.date }}</span>
                    </div>
                    <div class="stars">★★★★★</div>
                    <p class="comment">{{ rev.comment }}</p>
                  </div>
                }
              </div>
            }
          </div>
        </div>

        <!-- Related Products Section -->
        <div class="related-section">
          <h2 class="section-title">You May Also Like</h2>
          <div class="related-grid">
            @for (p of relatedProducts(); track p.id) {
              <zah-product-card [product]="p" (quickView)="openQuickView($event)"></zah-product-card>
            }
          </div>
        </div>

        <zah-quick-view-modal [product]="quickViewProduct()" (close)="quickViewProduct.set(null)"></zah-quick-view-modal>
      </div>
    }
  `,
  styles: [`
    .product-detail-page {
      padding-top: 1.5rem;
      padding-bottom: 4rem;
    }

    .breadcrumb-row {
      display: flex;
      gap: 0.5rem;
      font-size: 0.8125rem;
      color: var(--zah-text-muted);
      margin-bottom: 1.5rem;

      a:hover { color: var(--zah-accent); }
      .current { color: var(--zah-text-primary); font-weight: 600; }
    }

    .product-main-grid {
      display: grid;
      grid-template-columns: 1fr 1.1fr;
      gap: 2.5rem;
      margin-bottom: 3rem;

      @media (max-width: 992px) {
        grid-template-columns: 1fr;
      }
    }

    .main-image-frame {
      position: relative;
      width: 100%;
      height: 480px;
      border-radius: var(--zah-radius-lg);
      overflow: hidden;

      .zoom-img { width: 100%; height: 100%; object-fit: cover; }
    }

    .wishlist-float-btn {
      position: absolute;
      top: 1rem;
      right: 1rem;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: var(--zah-surface);
      box-shadow: var(--zah-shadow-md);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .thumbnails-list {
      display: flex;
      gap: 0.75rem;
      margin-top: 1rem;
    }

    .thumb-box {
      width: 72px;
      height: 72px;
      border-radius: var(--zah-radius-md);
      overflow: hidden;
      border: 2px solid transparent;
      img { width: 100%; height: 100%; object-fit: cover; }
      &.active { border-color: var(--zah-accent); }
    }

    .info-column {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .brand-tag { font-size: 0.8125rem; font-weight: 700; color: var(--zah-accent); text-transform: uppercase; }
    .product-title { font-size: 2.25rem; font-weight: 800; margin: 0; line-height: 1.2; }

    .rating-bar {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 0.875rem;
      .stars { display: flex; align-items: center; gap: 0.25rem; font-weight: 700; }
      .review-count { color: var(--zah-text-muted); }
      .in-stock-tag { font-weight: 700; color: var(--zah-success); &.out { color: var(--zah-danger); } }
    }

    .price-banner {
      padding: 1.25rem;
      background: var(--zah-surface-secondary);
      border-radius: var(--zah-radius-md);

      .price-row { display: flex; align-items: center; gap: 0.75rem; }
      .current-price { font-size: 2rem; font-weight: 800; color: var(--zah-text-primary); }
      .original-price { font-size: 1.1rem; color: var(--zah-text-muted); text-decoration: line-through; }
      .discount-badge { font-size: 0.85rem; font-weight: 700; color: var(--zah-danger); background: var(--zah-danger-bg); padding: 0.2rem 0.6rem; border-radius: 4px; }
      .savings-text { font-size: 0.8125rem; color: var(--zah-text-muted); margin: 0.35rem 0 0 0; }
    }

    .description { font-size: 1rem; color: var(--zah-text-secondary); line-height: 1.6; margin: 0; }

    .variant-section {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      .variant-label { font-size: 0.875rem; color: var(--zah-text-secondary); }
    }

    .swatches-row, .sizes-row { display: flex; gap: 0.5rem; }

    .swatch-btn {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border: 2px solid transparent;
      padding: 2px;
      &.active { border-color: var(--zah-accent); }
    }

    .color-dot { display: block; width: 100%; height: 100%; border-radius: 50%; }

    .size-btn {
      padding: 0.5rem 1rem;
      border-radius: var(--zah-radius-sm);
      border: 1px solid var(--zah-border-strong);
      font-size: 0.875rem;
      font-weight: 600;
      &.active { background: var(--zah-primary); color: var(--zah-text-inverse); border-color: var(--zah-primary); }
    }

    .pincode-box {
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;

      .pincode-title { font-size: 0.875rem; font-weight: 700; }
      .pincode-input-row { display: flex; gap: 0.5rem; input { width: 180px; padding: 0.4rem 0.75rem; font-size: 0.85rem; border-radius: var(--zah-radius-sm); border: 1px solid var(--zah-border-strong); } }
      .delivery-status { font-size: 0.8125rem; color: var(--zah-success); margin: 0; }
    }

    .action-buttons-row {
      display: flex;
      gap: 1rem;
      margin-top: 1rem;

      .qty-control {
        display: flex;
        align-items: center;
        border: 1px solid var(--zah-border-strong);
        border-radius: var(--zah-radius-md);
        button { width: 42px; height: 42px; font-weight: 700; font-size: 1.2rem; }
        span { width: 44px; text-align: center; font-weight: 700; }
      }

      .add-cart-btn, .buy-now-btn { flex-grow: 1; height: 44px; }
    }

    .bundle-section {
      padding: 1.5rem;
      margin-bottom: 3rem;
      .bundle-title { font-size: 1.25rem; font-weight: 800; margin-bottom: 1rem; }
    }

    .bundle-grid {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1.5rem;

      @media (max-width: 768px) { flex-direction: column; align-items: flex-start; }
    }

    .bundle-items {
      display: flex;
      align-items: center;
      gap: 1rem;
      .plus { font-size: 1.5rem; font-weight: 800; color: var(--zah-accent); }
    }

    .bundle-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      img { width: 60px; height: 60px; border-radius: var(--zah-radius-sm); object-fit: cover; }
      span { font-size: 0.85rem; font-weight: 600; }
    }

    .bundle-checkout {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      .total-price { display: flex; flex-direction: column; .label { font-size: 0.75rem; color: var(--zah-text-muted); } .price { font-size: 1.25rem; font-weight: 800; } .save-tag { font-size: 0.75rem; font-weight: 700; color: var(--zah-success); } }
    }

    .tabs-container {
      margin-bottom: 4rem;
    }

    .tabs-header {
      display: flex;
      border-bottom: 1px solid var(--zah-border);
      button {
        padding: 1rem 1.5rem;
        font-size: 0.95rem;
        font-weight: 600;
        color: var(--zah-text-secondary);
        border-bottom: 2px solid transparent;

        &.active {
          color: var(--zah-text-primary);
          border-bottom-color: var(--zah-accent);
        }
      }
    }

    .tab-body { padding: 1.5rem; }

    .specs-table {
      display: flex;
      flex-direction: column;
      .spec-row { display: flex; padding: 0.6rem 0; border-bottom: 1px solid var(--zah-border); .spec-name { width: 220px; font-weight: 600; color: var(--zah-text-secondary); } .spec-value { font-weight: 600; color: var(--zah-text-primary); } }
    }

    .reviews-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;

      .review-item { padding-bottom: 1rem; border-bottom: 1px solid var(--zah-border); }
      .review-meta { display: flex; gap: 0.75rem; align-items: center; font-size: 0.85rem; .badge-verified { color: var(--zah-success); font-size: 0.75rem; } .review-date { color: var(--zah-text-muted); } }
      .comment { font-size: 0.9rem; margin-top: 0.35rem; }
    }

    .related-section {
      .section-title { font-size: 1.5rem; font-weight: 800; margin-bottom: 1.5rem; }
    }

    .related-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.5rem;

      @media (max-width: 992px) { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 560px) {
      .rating-bar, .pincode-input-row, .action-buttons-row { flex-wrap: wrap; }
      .pincode-input-row input { width: 100%; }
      .action-buttons-row .zah-btn { width: 100%; }
      .tabs-header { overflow-x: auto; }
      .tabs-header button { white-space: nowrap; }
      .spec-row { flex-direction: column; gap: 0.25rem; }
      .spec-row .spec-name { width: auto; }
      .bundle-items, .bundle-checkout { flex-direction: column; }
    }
  `]
})
export class ProductDetailsComponent implements OnInit {
  productService = inject(ProductService);
  cartService = inject(CartService);
  wishlistService = inject(WishlistService);
  notificationService = inject(NotificationService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  product = signal<Product | null>(null);
  activeImage = signal<string>('');
  selectedColor = signal<{ name: string; hex: string } | null>(null);
  selectedSize = signal<string | null>(null);
  quantity = signal<number>(1);
  activeTab = signal<'desc' | 'specs' | 'reviews'>('desc');
  
  pincodeInput = '';
  deliveryEstimate = signal<string | null>(null);
  relatedProducts = signal<Product[]>([]);
  quickViewProduct = signal<Product | null>(null);

  ngOnInit() {
    this.route.params.subscribe(params => {
      const slug = params['slug'];
      
      // Try to get from loaded products first (for instant display)
      const cachedProd = this.productService.products().find(p => p.slug === slug || p.id === slug);
      if (cachedProd) {
        this.product.set(cachedProd);
        this.activeImage.set(cachedProd.images[0]);
        this.selectedColor.set(cachedProd.availableColors?.[0] || null);
        this.selectedSize.set(cachedProd.availableSizes?.[0] || null);
        this.quantity.set(1);
        
        const related = this.productService.products().filter(p => p.category === cachedProd.category && p.id !== cachedProd.id).slice(0, 4);
        this.relatedProducts.set(related);
      }
      
      // Fetch from API for fresh data
      this.productService.getProductBySlug(slug).subscribe(prod => {
        if (prod) {
          this.product.set(prod);
          this.activeImage.set(prod.images[0]);
          this.selectedColor.set(prod.availableColors?.[0] || null);
          this.selectedSize.set(prod.availableSizes?.[0] || null);
          this.quantity.set(1);

          const related = this.productService.products().filter(p => p.category === prod.category && p.id !== prod.id).slice(0, 4);
          this.relatedProducts.set(related);
        } else {
          this.notificationService.error('Product Not Found', 'The requested product could not be found.');
          this.router.navigate(['/products']);
        }
      });
    });
  }

  isInWishlist(): boolean {
    return this.product() ? this.wishlistService.isInWishlist(this.product()!.id) : false;
  }

  toggleWishlist() {
    if (this.product()) {
      this.wishlistService.toggleWishlist(this.product()!);
    }
  }

  changeQty(delta: number) {
    this.quantity.update(q => Math.max(1, q + delta));
  }

  checkPincode() {
    if (this.pincodeInput.length === 6) {
      const date = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
      this.deliveryEstimate.set(date);
    } else {
      this.notificationService.warning('Invalid Pincode', 'Please enter a 6-digit postal code.');
    }
  }

  addToCart() {
    if (this.product()) {
      this.cartService.addToCart(this.product()!, this.quantity(), this.selectedColor() || undefined, this.selectedSize() || undefined);
    }
  }

  buyNow() {
    this.addToCart();
    this.router.navigate(['/checkout']);
  }

  addBundleToCart() {
    this.addToCart();
    this.productService.getProductBySlug('zah-minimalist-luxe-chronograph-watch').subscribe(watch => {
      if (watch) {
        this.cartService.addToCart(watch, 1);
        this.router.navigate(['/checkout']);
      }
    });
  }

  openQuickView(p: Product) {
    this.quickViewProduct.set(p);
  }
}
