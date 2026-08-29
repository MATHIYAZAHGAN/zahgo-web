import { Component, HostListener, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';
import { Product } from '../../core/models/product.model';

@Component({
  selector: 'zah-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <!-- Top Announcement Bar -->
    <div class="announcement-bar">
      <div class="zah-container inner-bar">
        <span class="announce-text">⚡ <strong>FREE EXPRESS SHIPPING</strong> ON ORDERS OVER ₹1,999 | USE CODE: <strong>ZAHGO10</strong></span>
        <div class="announcement-links">
          <a routerLink="/offers">Offers</a>
          <a routerLink="/support">24/7 Support</a>
          <button class="theme-toggle-btn" (click)="themeService.toggleTheme()" [title]="'Switch to ' + (themeService.currentTheme() === 'light' ? 'Dark' : 'Light') + ' Mode'">
            @if (themeService.currentTheme() === 'dark') {
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
            } @else {
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1 -9 -9Z"/></svg>
            }
            {{ themeService.currentTheme() === 'dark' ? 'Light' : 'Dark' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Main Navigation Header -->
    <header class="main-header" [class.scrolled]="isScrolled">
      <div class="zah-container header-inner">
        <!-- Logo -->
        <a routerLink="/" class="zah-logo">
          <span class="logo-mark">ZAH</span>
          <span class="logo-suffix">go</span>
        </a>

        <nav class="desktop-nav">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Home</a>
          <a routerLink="/category/men-fashion" routerLinkActive="active">Men</a>
          <a routerLink="/category/women-fashion" routerLinkActive="active">Women</a>
          <a routerLink="/category/electronics" routerLinkActive="active">Electronics</a>
          <a routerLink="/category/home-living" routerLinkActive="active">Home</a>
          <a routerLink="/category/accessories" routerLinkActive="active">Accessories</a>
          <a routerLink="/category/footwear" routerLinkActive="active">Footwear</a>
          <a routerLink="/category/beauty-fragrance" routerLinkActive="active">Beauty</a>
          <a routerLink="/category/sports-fitness" routerLinkActive="active">Fitness</a>
          <a routerLink="/offers" class="offers-link" routerLinkActive="active">
            <span>Offers</span>
            <span class="pulse-dot"></span>
          </a>
        </nav>

        <!-- Search Bar with Predictive Dropdown -->
        <div class="search-box-wrapper">
          <div class="search-input-group">
            <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input 
              type="text" 
              placeholder="Search products, brands, categories..." 
              [(ngModel)]="searchQuery" 
              (input)="onSearchInput()"
              (focus)="isSearchFocused.set(true)"
              (keydown.enter)="executeSearch()"
            />
            @if (searchQuery) {
              <button class="clear-search" (click)="searchQuery = ''; onSearchInput()">×</button>
            }
          </div>

          <!-- Auto-suggestions Dropdown Overlay -->
          @if (isSearchFocused() && searchQuery.trim().length > 0) {
            <div class="search-dropdown zah-card animate-slide-up">
              @if (searchResults().length > 0) {
                <div class="dropdown-section">
                  <div class="section-label">Suggested Products</div>
                  @for (prod of searchResults(); track prod.id) {
                    <a [routerLink]="['/products', prod.slug]" class="search-item" (click)="isSearchFocused.set(false)">
                      <img [src]="prod.images[0]" [alt]="prod.name" class="item-thumb" />
                      <div class="item-info">
                        <span class="item-title">{{ prod.name }}</span>
                        <span class="item-price">₹{{ prod.price | number }}</span>
                      </div>
                    </a>
                  }
                </div>
              } @else {
                <div class="no-suggestions">No results for "{{ searchQuery }}"</div>
              }
              <button class="view-all-results" (click)="executeSearch()">View All Results →</button>
            </div>
          }
        </div>

        <!-- Right Header Utility Actions -->
        <div class="header-actions">
          <!-- Mobile Search Trigger (shows below 640px) -->
          <button class="icon-action-btn show-on-mobile" (click)="openMobileSearch()" title="Search" aria-label="Search">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </button>

          <!-- Wishlist -->
          <a routerLink="/wishlist" class="icon-action-btn" title="Wishlist">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
            @if (wishlistService.count() > 0) {
              <span class="badge-count">{{ wishlistService.count() }}</span>
            }
          </a>

          <!-- Cart Drawer Trigger -->
          <button class="icon-action-btn" (click)="cartService.toggleCartDrawer()" title="Cart">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
            @if (cartService.totalItemCount() > 0) {
              <span class="badge-count badge-accent">{{ cartService.totalItemCount() }}</span>
            }
          </button>

          <!-- User Account Menu -->
          <div class="account-dropdown-wrapper">
            @if (authService.isAuthenticated()) {
              <button class="user-avatar-btn" (click)="toggleUserMenu()">
                <img [src]="authService.currentUser()?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'" alt="Avatar" />
              </button>

              @if (isUserMenuOpen()) {
                <div class="user-menu zah-card animate-slide-up">
                  <div class="menu-header">
                    <strong class="user-name">{{ authService.currentUser()?.name }}</strong>
                    <span class="user-email">{{ authService.currentUser()?.email }}</span>
                  </div>
                  <hr class="menu-divider" />
                  <a routerLink="/account" (click)="closeUserMenu()">Dashboard</a>
                  <a routerLink="/account/orders" (click)="closeUserMenu()">My Orders</a>
                  <a routerLink="/account/addresses" (click)="closeUserMenu()">Addresses</a>
                  <a routerLink="/wishlist" (click)="closeUserMenu()">Wishlist</a>
                  <hr class="menu-divider" />
                  <button (click)="logout()">Sign Out</button>
                </div>
              }
            } @else {
              <a routerLink="/login" class="zah-btn zah-btn-sm zah-btn-primary">Sign In</a>
            }
          </div>
        </div>
      </div>
    </header>

    <!-- Mobile Search Overlay (below 640px) -->
    <div class="mobile-search-overlay" [class.open]="isMobileSearchOpen()">
      <div class="mobile-search-bar">
        <button class="ms-back-btn" (click)="closeMobileSearch()" aria-label="Back">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <div class="ms-input-group">
          <svg class="ms-search-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input
            type="search"
            placeholder="Search products, brands, categories..."
            [(ngModel)]="searchQuery"
            (input)="onSearchInput()"
            (keydown.enter)="executeSearch()"
            autocomplete="off"
            #mobileSearchInput
          />
          @if (searchQuery) {
            <button class="clear-search" (click)="searchQuery = ''; onSearchInput()">×</button>
          }
        </div>
        <button class="ms-go-btn" (click)="executeSearch()">Go</button>
      </div>

      <!-- Suggestions inside mobile overlay -->
      @if (searchQuery.trim().length > 0) {
        <div class="ms-suggestions">
          @if (searchResults().length > 0) {
            @for (prod of searchResults(); track prod.id) {
              <a [routerLink]="['/products', prod.slug]" class="ms-suggestion-item" (click)="closeMobileSearch()">
                <img [src]="prod.images[0]" [alt]="prod.name" class="ms-item-thumb" />
                <div class="ms-item-info">
                  <span class="ms-item-title">{{ prod.name }}</span>
                  <span class="ms-item-price">₹{{ prod.price | number }}</span>
                </div>
              </a>
            }
            <button class="ms-view-all" (click)="executeSearch()">View All Results →</button>
          } @else {
            <div class="ms-no-results">No results for "{{ searchQuery }}"</div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .announcement-bar {
      background-color: var(--zah-primary);
      color: var(--zah-text-inverse);
      font-size: 0.775rem;
      padding: 0.4rem 0;
      border-bottom: 1px solid var(--zah-glass-border);
    }

    .inner-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
    }

    .announce-text {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    @media (max-width: 640px) {
      .announcement-bar { font-size: 0.62rem; }
      .announce-text {
        white-space: normal;
        line-height: 1.35;
      }
      .announcement-links { display: none; }
    }

    .announcement-links {
      display: flex;
      align-items: center;
      gap: 1.25rem;

      a { color: var(--zah-text-inverse); opacity: 0.9; &:hover { opacity: 1; text-decoration: underline; } }
    }

    .theme-toggle-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--zah-accent);
      background: rgba(255, 255, 255, 0.1);
      padding: 0.15rem 0.55rem;
      border-radius: var(--zah-radius-full);
      &:hover { background: rgba(255, 255, 255, 0.2); }
    }

    .main-header {
      position: sticky;
      top: 0;
      z-index: 900;
      background: var(--zah-glass-bg);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border-bottom: 1px solid var(--zah-border);
      transition: var(--zah-transition-base);

      &.scrolled {
        box-shadow: var(--zah-shadow-md);
      }
    }

    .header-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: var(--zah-header-height);
      gap: 1.5rem;
    }

    .zah-logo {
      display: flex;
      align-items: center;
      gap: 0.35rem;
      font-family: var(--zah-font-heading);

      .logo-mark {
        font-size: 1.85rem;
        font-weight: 800;
        letter-spacing: 0.08em;
        background: linear-gradient(135deg, var(--zah-text-primary) 0%, var(--zah-accent) 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .logo-suffix {
        font-size: 1.1rem;
        font-weight: 600;
        color: var(--zah-text-muted);
        margin-left: -0.15rem;
        margin-top: 0.3rem;
      }
    }

    .desktop-nav {
      display: flex;
      align-items: center;
      gap: 1.5rem;

      a {
        font-size: 0.9375rem;
        font-weight: 600;
        color: var(--zah-text-secondary);
        position: relative;
        padding: 0.5rem 0;
        transition: var(--zah-transition-fast);

        &:hover, &.active {
          color: var(--zah-text-primary);
        }

        &.active::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background-color: var(--zah-accent);
          border-radius: 2px;
        }
      }

      .offers-link {
        color: var(--zah-accent);
        display: flex;
        align-items: center;
        gap: 0.35rem;
      }

      .pulse-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background-color: var(--zah-danger);
        box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
        animation: pulse 1.5s infinite;
      }
    }

    @keyframes pulse {
      0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
      70% { box-shadow: 0 0 0 6px rgba(239, 68, 68, 0); }
      100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
    }

    @media (max-width: 992px) {
      .desktop-nav { display: none; }
    }

    .search-box-wrapper {
      position: relative;
      flex-grow: 1;
      max-width: 560px;
    }

    @media (max-width: 640px) {
      .search-box-wrapper { display: none; }
      .header-inner { height: 60px; gap: 0.5rem; padding-left: 0.75rem; padding-right: 0.75rem; }
      .zah-logo .logo-mark { font-size: 1.45rem; }
      .zah-logo .logo-suffix { font-size: 0.85rem; }
      .header-actions { gap: 0.15rem; }
      .icon-action-btn { width: var(--zah-touch-target); height: var(--zah-touch-target); }
      .user-avatar-btn { width: 42px; height: 42px; }
    }

    .search-input-group {
      position: relative;
      display: flex;
      align-items: center;

      .search-icon {
        position: absolute;
        left: 0.85rem;
        color: var(--zah-text-muted);
      }

      input {
        width: 100%;
        padding: 0.55rem 2.25rem 0.55rem 2.5rem;
        font-size: 0.875rem;
        border-radius: var(--zah-radius-full);
        border: 1px solid var(--zah-border-strong);
        background: var(--zah-surface);
        color: var(--zah-text-primary);
        outline: none;
        transition: var(--zah-transition-fast);

        &:focus {
          border-color: var(--zah-accent);
          box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.15);
        }
      }

      .clear-search {
        position: absolute;
        right: 0.75rem;
        font-size: 1.2rem;
        color: var(--zah-text-muted);
      }
    }

    .search-dropdown {
      position: absolute;
      top: 110%;
      left: 0;
      right: 0;
      background: var(--zah-surface);
      border-radius: var(--zah-radius-md);
      box-shadow: var(--zah-shadow-xl);
      padding: 0.75rem;
      z-index: 1000;
    }

    .dropdown-section {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .section-label {
      font-size: 0.725rem;
      font-weight: 700;
      color: var(--zah-text-muted);
      text-transform: uppercase;
    }

    .search-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.4rem;
      border-radius: var(--zah-radius-sm);
      &:hover { background: var(--zah-surface-secondary); }
    }

    .item-thumb {
      width: 40px;
      height: 40px;
      border-radius: 4px;
      object-fit: cover;
    }

    .item-info {
      display: flex;
      flex-direction: column;
      .item-title { font-size: 0.85rem; font-weight: 600; color: var(--zah-text-primary); }
      .item-price { font-size: 0.8rem; font-weight: 700; color: var(--zah-accent); }
    }

    .view-all-results {
      width: 100%;
      margin-top: 0.5rem;
      padding: 0.4rem;
      text-align: center;
      font-size: 0.8125rem;
      font-weight: 600;
      color: var(--zah-accent);
      border-top: 1px solid var(--zah-border);
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 1.15rem;
    }

    .icon-action-btn {
      position: relative;
      color: var(--zah-text-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      width: var(--zah-touch-target);
      height: var(--zah-touch-target);
      border-radius: 50%;
      transition: var(--zah-transition-fast);

      &:hover { background: var(--zah-surface-secondary); }
    }

    .badge-count {
      position: absolute;
      top: 2px;
      right: 2px;
      min-width: 18px;
      height: 18px;
      border-radius: 9px;
      background: var(--zah-primary);
      color: var(--zah-text-inverse);
      font-size: 0.6875rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 4px;

      &.badge-accent {
        background: var(--zah-accent);
        color: #0f172a;
      }
    }

    .account-dropdown-wrapper {
      position: relative;
    }

    .user-avatar-btn {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      overflow: hidden;
      border: 2px solid var(--zah-accent);
      img { width: 100%; height: 100%; object-fit: cover; }
    }

    .user-menu {
      position: absolute;
      top: 115%;
      right: 0;
      width: 220px;
      background: var(--zah-surface);
      padding: 0.75rem 0;
      border-radius: var(--zah-radius-md);
      box-shadow: var(--zah-shadow-xl);
      z-index: 1000;
      display: flex;
      flex-direction: column;

      .menu-header {
        padding: 0.5rem 1rem;
        display: flex;
        flex-direction: column;
        .user-name { font-size: 0.9rem; color: var(--zah-text-primary); }
        .user-email { font-size: 0.75rem; color: var(--zah-text-muted); }
      }

      .menu-divider { border: none; border-top: 1px solid var(--zah-border); margin: 0.4rem 0; }

      a, button {
        padding: 0.5rem 1rem;
        font-size: 0.875rem;
        color: var(--zah-text-secondary);
        text-align: left;
        &:hover { background: var(--zah-surface-secondary); color: var(--zah-text-primary); }
      }
    }

    /* Mobile Search Overlay */
    .mobile-search-overlay {
      position: fixed;
      top: var(--zah-safe-top);
      left: 0;
      right: 0;
      z-index: 980;
      background: var(--zah-surface);
      border-bottom: 1px solid var(--zah-border);
      box-shadow: var(--zah-shadow-lg);
      max-height: 55vh;
      display: flex;
      flex-direction: column;
      transform: translateY(-110%);
      transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      visibility: hidden;

      &.open {
        transform: translateY(0);
        visibility: visible;
      }
    }

    .mobile-search-bar {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem;

      .ms-back-btn {
        width: var(--zah-touch-target);
        height: var(--zah-touch-target);
        border-radius: var(--zah-radius-full);
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--zah-text-primary);
        &:active { background: var(--zah-surface-secondary); }
      }

      .ms-input-group {
        position: relative;
        flex-grow: 1;
        display: flex;
        align-items: center;

        .ms-search-icon {
          position: absolute;
          left: 0.85rem;
          color: var(--zah-text-muted);
        }

        input {
          width: 100%;
          padding: 0.6rem 2.25rem;
          font-size: 16px;
          color: var(--zah-text-primary);
          background: var(--zah-surface-secondary);
          border: 1px solid transparent;
          border-radius: var(--zah-radius-full);
          outline: none;
          -webkit-appearance: none;
          appearance: none;

          &:focus {
            border-color: var(--zah-accent);
            background: var(--zah-surface);
            box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.15);
          }
        }

        .clear-search {
          position: absolute;
          right: 0.75rem;
          font-size: 1.3rem;
          color: var(--zah-text-muted);
        }
      }

      .ms-go-btn {
        padding: 0.6rem 1.1rem;
        font-weight: 700;
        border-radius: var(--zah-radius-full);
        background: var(--zah-primary);
        color: var(--zah-text-inverse);
      }
    }

    .ms-suggestions {
      flex-grow: 1;
      overflow-y: auto;
      padding: 0.5rem 0.75rem 0.875rem;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .ms-suggestion-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.5rem;
      border-radius: var(--zah-radius-sm);
      &:hover, &:active { background: var(--zah-surface-secondary); }

      .ms-item-thumb {
        width: 44px;
        height: 44px;
        border-radius: var(--zah-radius-sm);
        object-fit: cover;
        background: var(--zah-surface-secondary);
      }

      .ms-item-info {
        display: flex;
        flex-direction: column;
        overflow: hidden;
        .ms-item-title {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--zah-text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .ms-item-price { font-size: 0.8rem; font-weight: 700; color: var(--zah-accent); }
      }
    }

    .ms-view-all {
      margin-top: 0.5rem;
      padding: 0.65rem;
      text-align: center;
      font-size: 0.85rem;
      font-weight: 700;
      color: var(--zah-accent);
      border-top: 1px solid var(--zah-border);
    }

    .ms-no-results {
      text-align: center;
      padding: 1rem;
      font-size: 0.875rem;
      color: var(--zah-text-muted);
    }
  `]
})
export class ZahHeaderComponent {
  productService = inject(ProductService);
  cartService = inject(CartService);
  wishlistService = inject(WishlistService);
  authService = inject(AuthService);
  themeService = inject(ThemeService);
  private router = inject(Router);

  isScrolled = false;
  searchQuery = '';
  isSearchFocused = signal(false);
  searchResults = signal<Product[]>([]);
  isUserMenuOpen = signal(false);
  isMobileSearchOpen = signal(false);

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 20;
  }

  @HostListener('window:keydown.escape', [])
  onEscape() {
    if (this.isMobileSearchOpen()) {
      this.closeMobileSearch();
    }
    this.closeUserMenu();
  }

  toggleUserMenu() {
    this.isUserMenuOpen.update(v => !v);
  }

  closeUserMenu() {
    this.isUserMenuOpen.set(false);
  }

  openMobileSearch() {
    this.isMobileSearchOpen.set(true);
    setTimeout(() => {
      const inputEl = document.querySelector<HTMLInputElement>('.mobile-search-overlay input');
      inputEl?.focus();
    }, 60);
  }

  closeMobileSearch() {
    this.isMobileSearchOpen.set(false);
    this.isSearchFocused.set(false);
  }

  logout() {
    this.authService.logout();
    this.closeUserMenu();
  }

  onSearchInput() {
    if (this.searchQuery.trim().length > 0) {
      const q = this.searchQuery.toLowerCase();
      const results = this.productService.products().filter(p =>
        p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
      ).slice(0, 5);
      this.searchResults.set(results);
    } else {
      this.searchResults.set([]);
    }
  }

  executeSearch() {
    if (this.searchQuery.trim()) {
      this.productService.updateFilter({ searchQuery: this.searchQuery.trim() });
      this.isSearchFocused.set(false);
      this.isMobileSearchOpen.set(false);
      this.router.navigate(['/search'], { queryParams: { q: this.searchQuery.trim() } });
    }
  }
}
