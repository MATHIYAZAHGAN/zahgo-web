import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { ZahProductCardComponent } from '../../shared/components/zah-product-card.component';
import { ZahQuickViewModalComponent } from '../../shared/components/zah-quick-view-modal.component';
import { ZahEmptyStateComponent } from '../../shared/components/zah-empty-state.component';
import { Product } from '../../core/models/product.model';
import { ZahLoadingSkeletonComponent } from '../../shared/components/zah-loading-skeleton.component';

@Component({
  selector: 'zah-categories',
  standalone: true,
  imports: [CommonModule, RouterModule, ZahProductCardComponent, ZahQuickViewModalComponent, ZahEmptyStateComponent, ZahLoadingSkeletonComponent],
  template: `
    <div class="zah-container categories-page">
      <div class="breadcrumb-row">
        <a routerLink="/">Home</a>
        <span class="sep">/</span>
        <a routerLink="/products">Categories</a>
        <span class="sep">/</span>
        <span class="current">{{ categoryName() }}</span>
      </div>

      <div class="category-hero zah-card">
        <h1 class="hero-title">{{ categoryName() }}</h1>
        <p class="hero-subtitle">Explore curated luxury pieces handpicked for performance, style, and sophistication.</p>
      </div>

      @if (productService.error()) {
        <zah-empty-state
          icon="error"
          title="Products Couldn't Be Loaded"
          [description]="productService.error()!"
          actionButton="Try Again"
          (actionButtonClick)="productService.retryLoad()">
        </zah-empty-state>
      } @else if (productService.isLoading()) {
        <zah-loading-skeleton type="product-grid" [count]="4"></zah-loading-skeleton>
      } @else if (categoryProducts().length === 0) {
        <zah-empty-state
          icon="search"
          title="No Products Found"
          description="We couldn't find any products in this category. Check back soon or browse everything.">
        </zah-empty-state>
      } @else {
        <div class="products-grid">
          @for (product of categoryProducts(); track product.id) {
            <zah-product-card [product]="product" (quickView)="quickViewProduct.set($event)"></zah-product-card>
          }
        </div>
      }

      <zah-quick-view-modal [product]="quickViewProduct()" (close)="quickViewProduct.set(null)"></zah-quick-view-modal>
    </div>
  `,
  styles: [`
    .categories-page { padding-top: 1.5rem; padding-bottom: 4rem; }
    .breadcrumb-row { display: flex; gap: 0.5rem; font-size: 0.8125rem; color: var(--zah-text-muted); margin-bottom: 1.5rem; a:hover { color: var(--zah-accent); } .current { color: var(--zah-text-primary); font-weight: 600; } }
    .category-hero { padding: 2.5rem; background: linear-gradient(135deg, var(--zah-primary) 0%, #1e293b 100%); color: #ffffff; border-radius: var(--zah-radius-lg); margin-bottom: 2.5rem; .hero-title { font-size: 2.25rem; font-weight: 800; color: #ffffff; margin: 0 0 0.5rem 0; } .hero-subtitle { font-size: 1rem; color: #cbd5e1; margin: 0; } }
    .products-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 1.5rem; @media (max-width: 992px) { grid-template-columns: repeat(2, minmax(0, 1fr)); } @media (max-width: 340px) { grid-template-columns: 1fr; gap: 1rem; } }
    @media (max-width: 560px) { .category-hero { padding: 1.5rem; margin-bottom: 1.5rem; } .category-hero .hero-title { font-size: 1.6rem; } }
  `]
})
export class CategoriesComponent implements OnInit {
  productService = inject(ProductService);
  private route = inject(ActivatedRoute);

  categoryName = signal('Category');
  categoryProducts = signal<Product[]>([]);
  quickViewProduct = signal<Product | null>(null);

  ngOnInit() {
    this.route.params.subscribe(params => {
      const slug = params['slug'];
      const cat = this.productService.categories().find(c => c.slug === slug);
      if (cat) {
        this.categoryName.set(cat.name);
        const filtered = this.productService.products().filter(p => p.categoryId === cat.id || p.category.toLowerCase() === cat.name.toLowerCase());
        this.categoryProducts.set(filtered);
      } else {
        this.categoryName.set(slug.toUpperCase());
        this.categoryProducts.set([]);
      }
    });
  }
}
