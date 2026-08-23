import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { WishlistService } from '../../core/services/wishlist.service';
import { ZahProductCardComponent } from '../../shared/components/zah-product-card.component';
import { ZahQuickViewModalComponent } from '../../shared/components/zah-quick-view-modal.component';
import { ZahEmptyStateComponent } from '../../shared/components/zah-empty-state.component';
import { Product } from '../../core/models/product.model';
import { signal } from '@angular/core';

@Component({
  selector: 'zah-wishlist',
  standalone: true,
  imports: [CommonModule, RouterModule, ZahProductCardComponent, ZahQuickViewModalComponent, ZahEmptyStateComponent],
  template: `
    <div class="zah-container wishlist-page">
      <div class="header-row">
        <h1 class="page-title">Saved Items ({{ wishlistService.count() }})</h1>
        @if (wishlistService.count() > 0) {
          <button class="clear-btn" (click)="wishlistService.clearWishlist()">Clear All</button>
        }
      </div>

      @if (wishlistService.count() > 0) {
        <div class="products-grid">
          @for (product of wishlistService.wishlistItems(); track product.id) {
            <zah-product-card [product]="product" (quickView)="quickViewProduct.set($event)"></zah-product-card>
          }
        </div>
      } @else {
        <zah-empty-state icon="heart" title="Your Wishlist is Empty" description="Save items you love by clicking the heart icon on any product." actionLink="/products" actionLabel="Start Shopping"></zah-empty-state>
      }

      <zah-quick-view-modal [product]="quickViewProduct()" (close)="quickViewProduct.set(null)"></zah-quick-view-modal>
    </div>
  `,
  styles: [`
    .wishlist-page { padding-top: 2rem; padding-bottom: 4rem; }
    .header-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
    .page-title { font-size: 2rem; font-weight: 800; margin: 0; }
    .clear-btn { font-size: 0.85rem; font-weight: 600; color: var(--zah-danger); }
    .products-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; @media (max-width: 992px) { grid-template-columns: repeat(2, 1fr); } }
  `]
})
export class WishlistComponent {
  wishlistService = inject(WishlistService);
  quickViewProduct = signal<Product | null>(null);
}
