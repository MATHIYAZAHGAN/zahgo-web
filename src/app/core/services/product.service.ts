import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap, catchError, of, map, throwError } from 'rxjs';
import { Product, FilterState } from '../models/product.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/products`;
  
  readonly products = signal<Product[]>([]);
  readonly categories = signal<any[]>([]);
  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);
  readonly categoriesError = signal<string | null>(null);
  readonly isCategoriesLoading = signal(false);
  
  readonly recentlyViewed = signal<Product[]>([]);

  readonly filterState = signal<FilterState>({
    category: null,
    brand: [],
    minPrice: 0,
    maxPrice: 60000,
    minRating: 0,
    inStockOnly: false,
    discountOnly: false,
    size: [],
    color: [],
    searchQuery: '',
    sortBy: 'popularity'
  });

  readonly filteredProducts = computed(() => {
    const list = this.products();
    const filter = this.filterState();

    return list.filter(p => {
      // Category filter
      if (filter.category && p.slug !== filter.category && p.category.toLowerCase() !== filter.category.toLowerCase() && p.categoryId !== filter.category) {
        return false;
      }
      // Brand filter
      if (filter.brand.length > 0 && !filter.brand.includes(p.brand)) {
        return false;
      }
      // Price range
      if (p.price < filter.minPrice || p.price > filter.maxPrice) {
        return false;
      }
      // Rating
      if (filter.minRating > 0 && p.rating < filter.minRating) {
        return false;
      }
      // In stock
      if (filter.inStockOnly && !p.inStock) {
        return false;
      }
      // Discount only
      if (filter.discountOnly && p.discountPercentage <= 0) {
        return false;
      }
      // Search query
      if (filter.searchQuery.trim() !== '') {
        const q = filter.searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesBrand = p.brand.toLowerCase().includes(q);
        const matchesCat = p.category.toLowerCase().includes(q);
        if (!matchesName && !matchesBrand && !matchesCat) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (filter.sortBy === 'price-low') return a.price - b.price;
      if (filter.sortBy === 'price-high') return b.price - a.price;
      if (filter.sortBy === 'rating') return b.rating - a.rating;
      if (filter.sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      return b.reviewCount - a.reviewCount; // popularity
    });
  });

  constructor() {
    // Load products and categories on initialization
    this.loadProducts();
    this.loadCategories();
  }

  /**
   * Load all products from backend API
   */
  loadProducts(page: number = 1, pageSize: number = 100): void {
    this.isLoading.set(true);
    this.error.set(null);

    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    this.http.get<any>(this.apiUrl, { params }).pipe(
      tap(response => {
        if (response.success && response.data) {
          this.products.set(response.data.items || []);
        }
        this.isLoading.set(false);
      }),
      catchError(error => {
        console.error('Error loading products:', error);
        this.error.set('We couldn\'t load the products right now. Please check your connection and try again.');
        this.isLoading.set(false);
        return of(null);
      })
    ).subscribe();
  }

  /**
   * Reload products and categories after a failure (manual retry).
   */
  retryLoad(): void {
    this.loadProducts();
    this.loadCategories();
  }

  /**
   * Load all categories from backend API
   */
  loadCategories(): void {
    this.isCategoriesLoading.set(true);
    this.categoriesError.set(null);
    this.http.get<any>(`${environment.apiUrl}/categories`).pipe(
      tap(response => {
        if (response.success && response.data) {
          this.categories.set(response.data);
        }
        this.isCategoriesLoading.set(false);
      }),
      catchError(error => {
        console.error('Error loading categories:', error);
        this.categoriesError.set('Categories are temporarily unavailable.');
        this.isCategoriesLoading.set(false);
        return of(null);
      })
    ).subscribe();
  }

  /**
   * Get a single product by slug from backend API
   */
  getProductBySlug(slug: string): Observable<Product | null> {
    return this.http.get<any>(`${this.apiUrl}/${slug}`).pipe(
      map(response => {
        if (response.success && response.data) {
          this.addRecentlyViewed(response.data);
          return response.data;
        }
        return null;
      }),
      catchError(error => {
        // A genuine 404 means the product is missing — return null.
        if (error?.status === 404) return of(null);
        // Anything else is an infrastructure/server problem — let callers show a friendly message.
        console.error('Error fetching product:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get featured products from backend API
   */
  getFeaturedProducts(): Observable<Product[]> {
    return this.http.get<any>(`${this.apiUrl}/featured`).pipe(
      map(response => {
        if (response.success && response.data) {
          return response.data;
        }
        return [];
      }),
      catchError(error => {
        console.error('Error fetching featured products:', error);
        return of([]);
      })
    );
  }

  /**
   * Add product to recently viewed list
   */
  addRecentlyViewed(product: Product): void {
    this.recentlyViewed.update(prev => {
      const filtered = prev.filter(p => p.id !== product.id);
      return [product, ...filtered].slice(0, 8);
    });
  }

  /**
   * Update filter state
   */
  updateFilter(partial: Partial<FilterState>): void {
    this.filterState.update(current => ({ ...current, ...partial }));
  }

  /**
   * Reset all filters to default
   */
  resetFilters(): void {
    this.filterState.set({
      category: null,
      brand: [],
      minPrice: 0,
      maxPrice: 60000,
      minRating: 0,
      inStockOnly: false,
      discountOnly: false,
      size: [],
      color: [],
      searchQuery: '',
      sortBy: 'popularity'
    });
  }
}
