import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../core/services/product.service';
import { ZahProductCardComponent } from '../../shared/components/zah-product-card.component';
import { ZahQuickViewModalComponent } from '../../shared/components/zah-quick-view-modal.component';
import { ZahEmptyStateComponent } from '../../shared/components/zah-empty-state.component';
import { Product } from '../../core/models/product.model';

@Component({
  selector: 'zah-search',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ZahProductCardComponent, ZahQuickViewModalComponent, ZahEmptyStateComponent],
  template: `
    <div class="zah-container search-page">
      <div class="search-hero zah-card">
        <h1 class="page-title">Search ZAH Catalog</h1>
        <div class="search-bar-row">
          <input type="text" placeholder="Search for headphones, watches, silk dresses..." [(ngModel)]="searchQuery" (keydown.enter)="onSearch()" />
          <button class="zah-btn zah-btn-accent" (click)="onSearch()">Search</button>
        </div>
      </div>

      <div class="results-header">
        <h2>Results for "{{ searchQuery }}" ({{ searchResults().length }})</h2>
      </div>

      @if (searchResults().length > 0) {
        <div class="products-grid">
          @for (product of searchResults(); track product.id) {
            <zah-product-card [product]="product" (quickView)="quickViewProduct.set($event)"></zah-product-card>
          }
        </div>
      } @else {
        <zah-empty-state icon="search" title="No results found" description="We couldn't find any products matching your search terms." actionLink="/products" actionLabel="Browse All Products"></zah-empty-state>
      }

      <zah-quick-view-modal [product]="quickViewProduct()" (close)="quickViewProduct.set(null)"></zah-quick-view-modal>
    </div>
  `,
  styles: [`
    .search-page { padding-top: 2rem; padding-bottom: 4rem; }
    .search-hero { padding: 2rem; background: var(--zah-surface); border-radius: var(--zah-radius-lg); margin-bottom: 2rem; text-align: center; }
    .page-title { font-size: 1.75rem; font-weight: 800; margin-bottom: 1rem; }
    .search-bar-row { display: flex; max-width: 600px; margin: 0 auto; gap: 0.5rem; input { flex-grow: 1; padding: 0.75rem 1rem; border-radius: var(--zah-radius-md); border: 1px solid var(--zah-border-strong); background: var(--zah-surface); color: var(--zah-text-primary); font-size: 0.95rem; } }
    .results-header { margin-bottom: 1.5rem; h2 { font-size: 1.25rem; font-weight: 700; } }
    .products-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 1.5rem; @media (max-width: 992px) { grid-template-columns: repeat(2, minmax(0, 1fr)); } @media (max-width: 560px) { grid-template-columns: 1fr; gap: 1rem; } }
    @media (max-width: 560px) { .search-hero { padding: 1.25rem; } .search-bar-row { flex-direction: column; } .search-bar-row .zah-btn { width: 100%; } }
  `]
})
export class SearchComponent implements OnInit {
  productService = inject(ProductService);
  private route = inject(ActivatedRoute);

  searchQuery = '';
  searchResults = signal<Product[]>([]);
  quickViewProduct = signal<Product | null>(null);

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['q'] || '';
      this.executeSearch();
    });
  }

  onSearch() {
    this.executeSearch();
  }

  executeSearch() {
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      const results = this.productService.products().filter(p =>
        p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
      );
      this.searchResults.set(results);
    } else {
      this.searchResults.set(this.productService.products());
    }
  }
}
