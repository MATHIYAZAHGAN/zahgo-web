import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../core/services/product.service';
import { ZahProductCardComponent } from '../../shared/components/zah-product-card.component';
import { ZahQuickViewModalComponent } from '../../shared/components/zah-quick-view-modal.component';
import { ZahEmptyStateComponent } from '../../shared/components/zah-empty-state.component';
import { ZahLoadingSkeletonComponent } from '../../shared/components/zah-loading-skeleton.component';
import { Product } from '../../core/models/product.model';

@Component({
  selector: 'zah-products',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ZahProductCardComponent,
    ZahQuickViewModalComponent,
    ZahEmptyStateComponent,
    ZahLoadingSkeletonComponent
  ],
  template: `
    <div class="zah-container products-page">
      <!-- Breadcrumbs -->
      <div class="breadcrumb-row">
        <a routerLink="/">Home</a>
        <span class="sep">/</span>
        <span class="current">Products Catalog</span>
      </div>

      <!-- Header & Active Filters Bar -->
      <div class="catalog-header">
        <div>
          <h1 class="page-title">Curated Collections</h1>
          <p class="results-count">Showing <strong>{{ productService.filteredProducts().length }}</strong> items</p>
        </div>

        <div class="header-controls">
          <!-- View Switcher -->
          <div class="view-switcher">
            <button [class.active]="gridCols() === 4" (click)="gridCols.set(4)" title="4 Grid View">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="7" height="7" x="3" y="3"/><rect width="7" height="7" x="14" y="3"/><rect width="7" height="7" x="14" y="14"/><rect width="7" height="7" x="3" y="14"/></svg>
            </button>
            <button [class.active]="gridCols() === 3" (click)="gridCols.set(3)" title="3 Grid View">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="5" height="18" x="3" y="3"/><rect width="5" height="18" x="10" y="3"/><rect width="5" height="18" x="17" y="3"/></svg>
            </button>
          </div>

          <!-- Sort Dropdown -->
          <div class="sort-wrapper">
            <label>Sort By:</label>
            <select [ngModel]="productService.filterState().sortBy" (ngModelChange)="onSortChange($event)">
              <option value="popularity">Popularity</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Customer Rating</option>
              <option value="newest">Newest Arrivals</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Main Layout: Sidebar Filters + Products Grid -->
      <div class="catalog-layout">
        <!-- Sidebar Filters Panel -->
        <aside class="filter-sidebar zah-card">
          <div class="filter-header">
            <h3>Filters</h3>
            <button class="reset-btn" (click)="productService.resetFilters()">Reset All</button>
          </div>

          <!-- Category Filter -->
          <div class="filter-group">
            <h4 class="filter-label">Categories</h4>
            <div class="category-options">
              <button 
                class="cat-chip" 
                [class.active]="productService.filterState().category === null"
                (click)="productService.updateFilter({ category: null })">
                All Categories
              </button>
              @for (cat of productService.categories(); track cat.id) {
                <button 
                  class="cat-chip" 
                  [class.active]="productService.filterState().category === cat.slug"
                  (click)="productService.updateFilter({ category: cat.slug })">
                  {{ cat.name }}
                </button>
              }
            </div>
          </div>

          <!-- Price Range Filter -->
          <div class="filter-group">
            <h4 class="filter-label">Price Range</h4>
            <div class="price-slider-box">
              <input 
                type="range" 
                min="0" 
                max="60000" 
                step="1000" 
                [ngModel]="productService.filterState().maxPrice"
                (ngModelChange)="productService.updateFilter({ maxPrice: $event })" 
              />
              <div class="price-val-row">
                <span>Under ₹{{ productService.filterState().maxPrice | number }}</span>
              </div>
            </div>
          </div>

          <!-- Availability & Discount Checkboxes -->
          <div class="filter-group">
            <h4 class="filter-label">Options</h4>
            <label class="checkbox-label">
              <input 
                type="checkbox" 
                [ngModel]="productService.filterState().inStockOnly" 
                (ngModelChange)="productService.updateFilter({ inStockOnly: $event })" 
              />
              <span>In Stock Only</span>
            </label>
            <label class="checkbox-label">
              <input 
                type="checkbox" 
                [ngModel]="productService.filterState().discountOnly" 
                (ngModelChange)="productService.updateFilter({ discountOnly: $event })" 
              />
              <span>Discounted Items</span>
            </label>
          </div>
        </aside>

        <!-- Products Grid Area -->
        <main class="products-container">
          @if (isLoading()) {
            <zah-loading-skeleton type="product-grid" [count]="6"></zah-loading-skeleton>
          } @else if (productService.filteredProducts().length === 0) {
            <zah-empty-state 
              icon="search" 
              title="No matching items found" 
              description="Try broadening your search query or resetting your active filters."
              (click)="productService.resetFilters()">
            </zah-empty-state>
          } @else {
            <div class="products-grid" [style.grid-template-columns]="'repeat(' + gridCols() + ', 1fr)'">
              @for (product of productService.filteredProducts(); track product.id) {
                <zah-product-card [product]="product" (quickView)="openQuickView($event)"></zah-product-card>
              }
            </div>
          }
        </main>
      </div>
    </div>

    <!-- Quick View Popup Modal -->
    <zah-quick-view-modal [product]="quickViewProduct()" (close)="quickViewProduct.set(null)"></zah-quick-view-modal>
  `,
  styles: [`
    .products-page {
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

    .catalog-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 2rem;

      @media (max-width: 768px) {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }
    }

    .page-title {
      font-size: 2rem;
      font-weight: 800;
      margin: 0 0 0.25rem 0;
    }

    .results-count {
      font-size: 0.875rem;
      color: var(--zah-text-muted);
      margin: 0;
    }

    .header-controls {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .view-switcher {
      display: flex;
      border: 1px solid var(--zah-border-strong);
      border-radius: var(--zah-radius-md);
      overflow: hidden;

      button {
        padding: 0.45rem 0.75rem;
        color: var(--zah-text-muted);

        &.active {
          background: var(--zah-primary);
          color: var(--zah-text-inverse);
        }
      }
    }

    .sort-wrapper {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;

      select {
        padding: 0.5rem 0.85rem;
        border-radius: var(--zah-radius-md);
        border: 1px solid var(--zah-border-strong);
        background: var(--zah-surface);
        color: var(--zah-text-primary);
        outline: none;
      }
    }

    .catalog-layout {
      display: grid;
      grid-template-columns: 260px 1fr;
      gap: 2rem;

      @media (max-width: 992px) {
        grid-template-columns: 1fr;
      }
    }

    .filter-sidebar {
      padding: 1.25rem;
      height: fit-content;

      @media (max-width: 992px) {
        display: none; /* Can be toggled on mobile */
      }
    }

    .filter-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.25rem;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid var(--zah-border);

      h3 { font-size: 1.1rem; font-weight: 700; margin: 0; }
      .reset-btn { font-size: 0.75rem; font-weight: 600; color: var(--zah-accent); }
    }

    .filter-group {
      margin-bottom: 1.5rem;
    }

    .filter-label {
      font-size: 0.85rem;
      font-weight: 700;
      color: var(--zah-text-primary);
      margin-bottom: 0.75rem;
    }

    .category-options {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }

    .cat-chip {
      text-align: left;
      padding: 0.4rem 0.65rem;
      font-size: 0.8125rem;
      border-radius: var(--zah-radius-sm);
      color: var(--zah-text-secondary);

      &.active, &:hover {
        background: var(--zah-surface-secondary);
        color: var(--zah-text-primary);
        font-weight: 600;
      }
    }

    .price-slider-box {
      input { width: 100%; accent-color: var(--zah-accent); }
      .price-val-row { font-size: 0.8125rem; font-weight: 700; color: var(--zah-accent); margin-top: 0.25rem; }
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.85rem;
      color: var(--zah-text-secondary);
      margin-bottom: 0.5rem;
      cursor: pointer;

      input { accent-color: var(--zah-accent); }
    }

    .products-grid {
      display: grid;
      gap: 1.5rem;

      @media (max-width: 1024px) {
        grid-template-columns: repeat(2, 1fr) !important;
      }
    }
  `]
})
export class ProductsComponent implements OnInit {
  productService = inject(ProductService);
  private route = inject(ActivatedRoute);

  gridCols = signal(4);
  isLoading = signal(false);
  quickViewProduct = signal<Product | null>(null);

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['category']) {
        this.productService.updateFilter({ category: params['category'] });
      }
    });
  }

  onSortChange(sortBy: any) {
    this.productService.updateFilter({ sortBy });
  }

  openQuickView(product: Product) {
    this.quickViewProduct.set(product);
  }
}
