import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { AuthService } from '../../core/services/auth.service';
import { ProductService } from '../../core/services/product.service';

@Component({
  selector: 'zah-mobile-nav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- Sticky Bottom Navigation Bar (Mobile Only) -->
    <nav class="mobile-bottom-bar">
      <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        <span>Home</span>
      </a>

      <button (click)="isDrawerOpen.set(true)" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
        <span>Categories</span>
      </button>

      <a routerLink="/search" routerLinkActive="active" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        <span>Search</span>
      </a>

      <a routerLink="/wishlist" routerLinkActive="active" class="nav-item pos-rel">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
        <span>Wishlist</span>
        @if (wishlistService.count() > 0) {
          <span class="nav-badge">{{ wishlistService.count() }}</span>
        }
      </a>

      <button (click)="cartService.toggleCartDrawer()" class="nav-item pos-rel">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
        <span>Cart</span>
        @if (cartService.totalItemCount() > 0) {
          <span class="nav-badge accent">{{ cartService.totalItemCount() }}</span>
        }
      </button>

      <a [routerLink]="authService.isAuthenticated() ? '/account' : '/login'" routerLinkActive="active" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        <span>Account</span>
      </a>
    </nav>

    <!-- Slide-Out Mobile Navigation Drawer -->
    @if (isDrawerOpen()) {
      <div class="drawer-overlay animate-fade-in" (click)="isDrawerOpen.set(false)">
        <div class="drawer-panel animate-slide-up" (click)="$event.stopPropagation()">
          <div class="drawer-header">
            <span class="brand-title">ZAH Categories</span>
            <button class="close-btn" (click)="isDrawerOpen.set(false)">×</button>
          </div>

          <div class="drawer-body">
            <div class="category-list">
              @for (cat of productService.categories(); track cat.id) {
                <a [routerLink]="['/category', cat.slug]" class="cat-item" (click)="isDrawerOpen.set(false)">
                  <img [src]="cat.image" [alt]="cat.name" class="cat-thumb" />
                  <div class="cat-info">
                    <span class="cat-name">{{ cat.name }}</span>
                    <span class="cat-count">{{ cat.itemCount }} items</span>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
                </a>
              }
            </div>

            <hr class="drawer-divider" />

            <div class="drawer-quick-links">
              <a routerLink="/offers" (click)="isDrawerOpen.set(false)">⚡ Exclusive Deals & Offers</a>
              <a routerLink="/support" (click)="isDrawerOpen.set(false)">💬 Customer Support</a>
              <a routerLink="/account/orders" (click)="isDrawerOpen.set(false)">📦 Track My Orders</a>
            </div>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .mobile-bottom-bar {
      display: none;
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 950;
      height: var(--zah-mobile-nav-height);
      background: var(--zah-glass-bg);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border-top: 1px solid var(--zah-border);
      justify-content: space-around;
      align-items: center;
      padding: 0 0.5rem;

      @media (max-width: 768px) {
        display: flex;
      }
    }

    .nav-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.2rem;
      font-size: 0.6875rem;
      font-weight: 600;
      color: var(--zah-text-muted);
      width: 16%;
      height: 100%;

      &.active, &:hover {
        color: var(--zah-accent);
      }
    }

    .pos-rel { position: relative; }

    .nav-badge {
      position: absolute;
      top: 4px;
      right: 12px;
      background: var(--zah-primary);
      color: var(--zah-text-inverse);
      font-size: 0.65rem;
      font-weight: 700;
      min-width: 16px;
      height: 16px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;

      &.accent {
        background: var(--zah-accent);
        color: #0f172a;
      }
    }

    .drawer-overlay {
      position: fixed;
      inset: 0;
      z-index: 999;
      background: var(--zah-overlay-bg);
      backdrop-filter: blur(4px);
      display: flex;
      justify-content: flex-start;
    }

    .drawer-panel {
      width: 320px;
      max-width: 85vw;
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
      border-bottom: 1px solid var(--zah-border);

      .brand-title {
        font-family: var(--zah-font-heading);
        font-size: 1.15rem;
        font-weight: 700;
      }

      .close-btn {
        font-size: 1.5rem;
        color: var(--zah-text-muted);
      }
    }

    .drawer-body {
      padding: 1rem;
      overflow-y: auto;
      flex-grow: 1;
    }

    .category-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .cat-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.6rem 0.75rem;
      border-radius: var(--zah-radius-md);
      &:hover { background: var(--zah-surface-secondary); }
    }

    .cat-thumb {
      width: 44px;
      height: 44px;
      border-radius: var(--zah-radius-sm);
      object-fit: cover;
    }

    .cat-info {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      .cat-name { font-size: 0.9rem; font-weight: 600; color: var(--zah-text-primary); }
      .cat-count { font-size: 0.75rem; color: var(--zah-text-muted); }
    }

    .drawer-divider { border: none; border-top: 1px solid var(--zah-border); margin: 1rem 0; }

    .drawer-quick-links {
      display: flex;
      flex-direction: column;
      gap: 0.65rem;
      a {
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--zah-text-secondary);
        padding: 0.4rem 0.75rem;
        border-radius: var(--zah-radius-sm);
        &:hover { background: var(--zah-surface-secondary); color: var(--zah-text-primary); }
      }
    }
  `]
})
export class ZahMobileNavComponent {
  cartService = inject(CartService);
  wishlistService = inject(WishlistService);
  authService = inject(AuthService);
  productService = inject(ProductService);

  isDrawerOpen = signal(false);
}
