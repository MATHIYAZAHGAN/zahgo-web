import { Component, inject, signal, computed, OnInit, OnDestroy, HostListener } from '@angular/core';
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
          <!-- Mobile Filter Toggle (below 992px) -->
          <button class="zah-btn zah-btn-outline filter-toggle-btn" (click)="openFilterSheet()">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 3H2l8 9.46V19l4 2v-8.54Z"/></svg>
            Filters
            @if (activeFilterCount() > 0) {
              <span class="filter-count-badge">{{ activeFilterCount() }}</span>
            }
          </button>

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
          @if (productService.error()) {
            <zah-empty-state
              icon="error"
              title="Products Couldn't Be Loaded"
              description="{{ productService.error() }}"
              [actionButton]="'Try Again'"
              (actionButtonClick)="productService.retryLoad()">
            </zah-empty-state>
          } @else if (isLoading()) {
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

    <!-- Mobile Filter Bottom Sheet (below 992px) -->
    @if (isFilterSheetOpen()) {
      <div class="filter-sheet-overlay animate-fade-in" (click)="closeFilterSheet()">
        <div class="filter-sheet animate-slide-up" (click)="$event.stopPropagation()">
          <div class="sheet-handle"></div>
          <div class="sheet-header">
            <h3>Filters</h3>
            <button class="sheet-reset" (click)="productService.resetFilters()">Reset All</button>
            <button class="sheet-close" (click)="closeFilterSheet()" aria-label="Close">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>

          <div class="sheet-body">
            <!-- Category Filter -->
            <div class="filter-group">
              <h4 class="filter-label">Categories</h4>
              <div class="category-options category-chips">
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
              <h4 class="filter-label">Maximum Price</h4>
              <div class="price-slider-box">
                <input
                  type="range"
                  min="0"
                  max="60000"
                  step="1000"
                  [ngModel]="productService.filterState().maxPrice"
                  (ngModelChange)="productService.updateFilter({ maxPrice: $event })"
                />
                <div class="price-val-row">Under ₹{{ productService.filterState().maxPrice | number }}</div>
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
          </div>

          <div class="sheet-footer safe-area-bottom">
            <button class="zah-btn zah-btn-accent sheet-apply-btn" (click)="closeFilterSheet()">
              Apply & Show {{ productService.filteredProducts().length }} Items
            </button>
          </div>
        </div>
      </div>
    }
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
      flex-wrap: wrap;
    }

    .filter-toggle-btn {
      display: none;
      position: relative;

      @media (max-width: 992px) {
        display: inline-flex;
        width: 100%;
        padding: 0.7rem 1rem;
        justify-content: center;
        gap: 0.45rem;
        border-radius: var(--zah-radius-full);
        background: var(--zah-surface);
        color: var(--zah-text-primary);
        box-shadow: var(--zah-shadow-sm);

        &:active {
          background: var(--zah-surface-secondary);
        }
      }

      .filter-count-badge {
        min-width: 20px;
        height: 20px;
        padding: 0 6px;
        border-radius: 10px;
        background: var(--zah-accent);
        color: #0f172a;
        font-size: 0.7rem;
        font-weight: 800;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }
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

      &.category-chips {
        flex-direction: row;
        flex-wrap: wrap;
      }
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

    .category-chips .cat-chip {
      border: 1px solid var(--zah-border-strong);
      border-radius: var(--zah-radius-full);
      padding: 0.5rem 1rem;
      min-height: 40px;

      &.active {
        border-color: var(--zah-accent);
        background: var(--zah-accent-light);
        color: var(--zah-text-primary);
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

      @media (max-width: 680px) {
        grid-template-columns: repeat(2, 1fr) !important;
        gap: 0.75rem;
      }

      @media (max-width: 420px) {
        grid-template-columns: 1fr 1fr !important;
      }

      @media (max-width: 340px) {
        grid-template-columns: 1fr !important;
      }
    }

    /* Mobile Filter Bottom Sheet */
    .filter-sheet-overlay {
      position: fixed;
      inset: 0;
      z-index: 1000;
      background: var(--zah-overlay-bg);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: flex-end;
    }

    .filter-sheet {
      width: 100%;
      max-height: 88vh;
      background: var(--zah-surface);
      border-radius: var(--zah-radius-xl) var(--zah-radius-xl) 0 0;
      display: flex;
      flex-direction: column;
      box-shadow: var(--zah-shadow-xl);
    }

    .sheet-handle {
      width: 40px;
      height: 4px;
      border-radius: 2px;
      background: var(--zah-border-strong);
      margin: 0.6rem auto 0;
    }

    .sheet-header {
      display: flex;
      align-items: center;
      padding: 1rem 1.25rem;
      border-bottom: 1px solid var(--zah-border);

      h3 { margin: 0; flex-grow: 1; font-size: 1.1rem; font-weight: 700; }
      .sheet-reset { font-size: 0.8125rem; font-weight: 700; color: var(--zah-accent); margin-right: 0.75rem; }
      .sheet-close {
        width: var(--zah-touch-target);
        height: var(--zah-touch-target);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--zah-text-secondary);
        &:active { background: var(--zah-surface-secondary); }
      }
    }

    .sheet-body {
      flex-grow: 1;
      overflow-y: auto;
      padding: 1.25rem;
    }

    .sheet-footer {
      padding: 0.75rem 1.25rem;
      border-top: 1px solid var(--zah-border);
      background: var(--zah-surface);

      .sheet-apply-btn {
        width: 100%;
        padding: 0.9rem;
        font-size: 1rem;
        font-weight: 700;
      }
    }

    @media (max-width: 680px) {
      .catalog-header { margin-bottom: 1rem; }
    }
  `]
})
export class ProductsComponent implements OnInit, OnDestroy {
  productService = inject(ProductService);
  private route = inject(ActivatedRoute);

  gridCols = signal(4);
  isLoading = signal(false);
  quickViewProduct = signal<Product | null>(null);
  isFilterSheetOpen = signal(false);

  readonly activeFilterCount = computed(() => {
    const f = this.productService.filterState();
    let count = 0;
    if (f.category) count++;
    if (f.maxPrice < 60000) count++;
    if (f.inStockOnly) count++;
    if (f.discountOnly) count++;
    return count;
  });

  openFilterSheet() {
    this.isFilterSheetOpen.set(true);
    document.body.style.overflow = 'hidden';
  }

  closeFilterSheet() {
    this.isFilterSheetOpen.set(false);
    document.body.style.overflow = '';
  }

  @HostListener('window:keydown.escape', [])
  onEscape() {
    if (this.isFilterSheetOpen()) {
      this.closeFilterSheet();
    }
  }

  ngOnDestroy() {
    document.body.style.overflow = '';
  }

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
