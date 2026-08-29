import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { ZahProductCardComponent } from '../../shared/components/zah-product-card.component';
import { ZahQuickViewModalComponent } from '../../shared/components/zah-quick-view-modal.component';
import { MOCK_TESTIMONIALS } from '../../core/constants/mock-data';
import { Product } from '../../core/models/product.model';

@Component({
  selector: 'zah-home',
  standalone: true,
  imports: [CommonModule, RouterModule, ZahProductCardComponent, ZahQuickViewModalComponent],
  template: `
    <!-- Full-Width Edge-to-Edge Hero Slider -->
    <section class="hero-section">
      <div class="hero-slider">
        @for (slide of slides; track slide.id; let i = $index) {
          @if (currentSlideIndex() === i) {
            <div class="hero-slide animate-fade-in" [style.background-image]="'linear-gradient(90deg, rgba(15,23,42,0.88) 0%, rgba(15,23,42,0.35) 100%), url(' + slide.image + ')'">
              <div class="zah-container slide-container">
                <div class="slide-content">
                  <span class="slide-badge">{{ slide.badge }}</span>
                  <h1 class="slide-title">{{ slide.title }}</h1>
                  <p class="slide-subtitle">{{ slide.subtitle }}</p>
                  <div class="slide-actions">
                    <a [routerLink]="slide.ctaLink" class="zah-btn zah-btn-accent zah-btn-lg">
                      {{ slide.ctaText }}
                    </a>
                    <a routerLink="/offers" class="zah-btn zah-btn-outline zah-btn-lg text-white">
                      Explore Deals
                    </a>
                  </div>
                </div>
              </div>
            </div>
          }
        }

        <!-- Carousel Navigation Controls -->
        <button class="slider-arrow prev" (click)="prevSlide()" aria-label="Previous slide">‹</button>
        <button class="slider-arrow next" (click)="nextSlide()" aria-label="Next slide">›</button>

        <div class="slider-dots">
          @for (slide of slides; track slide.id; let i = $index) {
            <button 
              class="dot-btn" 
              [class.active]="currentSlideIndex() === i"
              (click)="setSlide(i)"
              [attr.aria-label]="'Go to slide ' + (i + 1)">
            </button>
          }
        </div>
      </div>
    </section>

    <!-- Multi-Card Category Blocks (Amazon-Style Luxury Feature Blocks) -->
    <section class="feature-blocks-section zah-container">
      <div class="blocks-grid">
        <!-- Block 1: Audio & Tech -->
        <div class="feature-block-card zah-card">
          <h3 class="block-title">Top Audio & Tech</h3>
          <div class="mini-cards-grid">
            <a routerLink="/products/zah-soundpro-wireless-anc-headphones" class="mini-card">
              <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80" alt="Headphones" />
              <span class="mini-title">SoundPro ANC</span>
            </a>
            <a routerLink="/products/zah-airbuds-pro-true-wireless-earbuds" class="mini-card">
              <img src="https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=400&q=80" alt="Earbuds" />
              <span class="mini-title">AirBuds TWS</span>
            </a>
            <a routerLink="/products/zah-horizon-oled-cinema-display-4k" class="mini-card">
              <img src="https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=400&q=80" alt="OLED TV" />
              <span class="mini-title">4K OLED Display</span>
            </a>
            <a routerLink="/products/zah-mechanical-gaming-keyboard-rgb" class="mini-card">
              <img src="https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=400&q=80" alt="Keyboard" />
              <span class="mini-title">RGB Keyboard</span>
            </a>
          </div>
          <a routerLink="/category/electronics" class="block-link">Explore Electronics →</a>
        </div>

        <!-- Block 2: Men Fashion -->
        <div class="feature-block-card zah-card">
          <h3 class="block-title">Couture & Menswear</h3>
          <div class="mini-cards-grid">
            <a routerLink="/products/zah-executive-merino-wool-blazer" class="mini-card">
              <img src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=400&q=80" alt="Blazer" />
              <span class="mini-title">Merino Wool Blazer</span>
            </a>
            <a routerLink="/products/zah-egyptian-cotton-tuxedo-shirt" class="mini-card">
              <img src="https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=400&q=80" alt="Shirt" />
              <span class="mini-title">Egyptian Tux Shirt</span>
            </a>
            <a routerLink="/products/zah-urban-suede-bomber-jacket" class="mini-card">
              <img src="https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=400&q=80" alt="Bomber" />
              <span class="mini-title">Suede Bomber</span>
            </a>
            <a routerLink="/products/zah-velvet-oud-eau-de-parfum-100ml" class="mini-card">
              <img src="https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=400&q=80" alt="Parfum" />
              <span class="mini-title">Velvet Oud Parfum</span>
            </a>
          </div>
          <a routerLink="/category/men-fashion" class="block-link">Explore Men Fashion →</a>
        </div>

        <!-- Block 3: Women Fashion -->
        <div class="feature-block-card zah-card">
          <h3 class="block-title">Silk & Women Fashion</h3>
          <div class="mini-cards-grid">
            <a routerLink="/products/zah-aura-silk-evening-dress" class="mini-card">
              <img src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=400&q=80" alt="Dress" />
              <span class="mini-title">Silk Evening Dress</span>
            </a>
            <a routerLink="/products/zah-cashmere-knit-turtleneck-sweater" class="mini-card">
              <img src="https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=400&q=80" alt="Cashmere" />
              <span class="mini-title">Cashmere Sweater</span>
            </a>
            <a routerLink="/products/zah-linen-resort-wrap-jumpsuit" class="mini-card">
              <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=400&q=80" alt="Jumpsuit" />
              <span class="mini-title">Linen Jumpsuit</span>
            </a>
            <a routerLink="/products/zah-stiletto-leather-pumps" class="mini-card">
              <img src="https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=400&q=80" alt="Pumps" />
              <span class="mini-title">Stiletto Pumps</span>
            </a>
          </div>
          <a routerLink="/category/women-fashion" class="block-link">Explore Women Fashion →</a>
        </div>

        <!-- Block 4: Timepieces & Accessories -->
        <div class="feature-block-card zah-card">
          <h3 class="block-title">Watches & Leather</h3>
          <div class="mini-cards-grid">
            <a routerLink="/products/zah-minimalist-luxe-chronograph-watch" class="mini-card">
              <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80" alt="Watch" />
              <span class="mini-title">Quartz Watch</span>
            </a>
            <a routerLink="/products/zah-italian-full-grain-leather-duffel" class="mini-card">
              <img src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=400&q=80" alt="Duffel" />
              <span class="mini-title">Leather Duffel</span>
            </a>
            <a routerLink="/products/zah-polarized-aviator-sunglasses" class="mini-card">
              <img src="https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=400&q=80" alt="Aviators" />
              <span class="mini-title">Polarized Aviators</span>
            </a>
            <a routerLink="/products/zah-chelsea-goodyear-welted-boots" class="mini-card">
              <img src="https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=400&q=80" alt="Boots" />
              <span class="mini-title">Chelsea Boots</span>
            </a>
          </div>
          <a routerLink="/category/accessories" class="block-link">Explore Accessories →</a>
        </div>
      </div>
    </section>

    <!-- Flash Sale Bar with Live Countdown Timer -->
    <section class="flash-sale-section zah-container">
      <div class="flash-inner zah-card">
        <div class="flash-header">
          <div class="flash-title-group">
            <span class="flash-icon">⚡</span>
            <div>
              <h3 class="flash-title">ZAH Midnight Flash Deals</h3>
              <p class="flash-sub">Limited quantity luxury items refreshed daily</p>
            </div>
          </div>
          <!-- Timer Display -->
          <div class="countdown-timer">
            <div class="time-box"><span>{{ countdown().hours }}</span><label>HRS</label></div>
            <span class="colon">:</span>
            <div class="time-box"><span>{{ countdown().minutes }}</span><label>MIN</label></div>
            <span class="colon">:</span>
            <div class="time-box"><span>{{ countdown().seconds }}</span><label>SEC</label></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Category Showcase Cards Grid -->
    <section class="categories-section zah-container">
      <div class="section-header">
        <div>
          <span class="sub-heading">SHOP BY CATEGORY</span>
          <h2 class="section-title">Explore Curated Collections</h2>
        </div>
        <a routerLink="/products" class="view-link">Browse All →</a>
      </div>

      <div class="categories-grid">
        @for (cat of productService.categories(); track cat.id) {
          <a [routerLink]="['/category', cat.slug]" class="cat-card group">
            <img [src]="cat.image" [alt]="cat.name" loading="lazy" />
            <div class="cat-overlay">
              <span class="cat-item-count">{{ cat.itemCount }} Items</span>
              <h3 class="cat-title">{{ cat.name }}</h3>
              <span class="shop-now-text">Explore Collection →</span>
            </div>
          </a>
        }
      </div>
    </section>

    <!-- Trending Products Showcase Grid (Full Occupy 5-Columns) -->
    <section class="products-section zah-container">
      <div class="section-header">
        <div>
          <span class="sub-heading">POPULAR NOW</span>
          <h2 class="section-title">Trending Styles & Tech</h2>
        </div>
        <a routerLink="/products" class="view-link">View All Products →</a>
      </div>

      <div class="products-grid-5">
        @for (product of trendingProducts(); track product.id) {
          <zah-product-card [product]="product" (quickView)="openQuickView($event)"></zah-product-card>
        }
      </div>
    </section>

    <!-- Luxury Promotional Banner -->
    <section class="promo-banner-section zah-container">
      <div class="promo-banner-card">
        <div class="promo-content">
          <span class="promo-tag">STUDIO SOUND PRO</span>
          <h2>Acoustic Perfection. Wireless Freedom.</h2>
          <p>Experience 40-hour lossless playback with active noise cancellation engineered for audiophiles.</p>
          <a routerLink="/products/zah-soundpro-wireless-anc-headphones" class="zah-btn zah-btn-accent zah-btn-lg">
            Discover SoundPro — ₹4,999
          </a>
        </div>
        <div class="promo-image-box">
          <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80" alt="Headphones Banner" />
        </div>
      </div>
    </section>

    <!-- Best Sellers Section -->
    <section class="products-section zah-container">
      <div class="section-header">
        <div>
          <span class="sub-heading">TOP RATED</span>
          <h2 class="section-title">Best Sellers</h2>
        </div>
        <a routerLink="/products" class="view-link">View All →</a>
      </div>

      <div class="products-grid-5">
        @for (product of bestSellerProducts(); track product.id) {
          <zah-product-card [product]="product" (quickView)="openQuickView($event)"></zah-product-card>
        }
      </div>
    </section>

    <!-- Customer Testimonials -->
    <section class="testimonials-section">
      <div class="zah-container">
        <div class="section-header text-center">
          <span class="sub-heading">WHAT OUR CLIENTS SAY</span>
          <h2 class="section-title">Trusted By Discerning Shoppers</h2>
        </div>

        <div class="testimonials-grid">
          @for (t of testimonials; track t.id) {
            <div class="testimonial-card zah-card">
              <div class="stars">★★★★★</div>
              <p class="quote">"{{ t.text }}"</p>
              <div class="user-info">
                <img [src]="t.avatar" [alt]="t.name" class="avatar" />
                <div>
                  <h4 class="name">{{ t.name }}</h4>
                  <span class="role">{{ t.role }}</span>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- Quick View Popup Modal -->
    <zah-quick-view-modal [product]="quickViewProduct()" (close)="quickViewProduct.set(null)"></zah-quick-view-modal>
  `,
  styles: [`
    .hero-section {
      position: relative;
      width: 100%;
      height: 580px;
      overflow: hidden;

      @media (max-width: 768px) {
        height: 440px;
      }
    }

    .hero-slider {
      position: relative;
      width: 100%;
      height: 100%;
    }

    .hero-slide {
      position: absolute;
      inset: 0;
      background-size: cover;
      background-position: center;
      display: flex;
      align-items: center;
    }

    .slide-container {
      width: 100%;
    }

    .slide-content {
      max-width: 680px;
      color: #ffffff;

      .slide-badge {
        font-size: 0.8125rem;
        font-weight: 700;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: var(--zah-accent);
        background: rgba(212, 175, 55, 0.18);
        padding: 0.35rem 0.85rem;
        border-radius: var(--zah-radius-full);
        display: inline-block;
        margin-bottom: 1rem;
      }

      .slide-title {
        font-size: clamp(2.25rem, 4.5vw, 3.8rem);
        font-weight: 800;
        line-height: 1.1;
        margin-bottom: 1rem;
        color: #ffffff;
      }

      .slide-subtitle {
        font-size: 1.15rem;
        color: #cbd5e1;
        margin-bottom: 2rem;
        line-height: 1.5;
      }

      .slide-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;

        .zah-btn { white-space: normal; }
      }

      @media (max-width: 640px) {
        .slide-actions {
          gap: 0.7rem;

          .zah-btn {
            flex-grow: 1;
            justify-content: center;
            padding-left: 1rem;
            padding-right: 1rem;
          }
        }
      }
    }

    .text-white { color: #ffffff !important; border-color: rgba(255,255,255,0.4) !important; }

    .slider-arrow {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: rgba(15, 23, 42, 0.6);
      backdrop-filter: blur(8px);
      color: #ffffff;
      font-size: 1.8rem;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10;
      border: 1px solid rgba(255,255,255,0.2);
      transition: var(--zah-transition-fast);

      &:hover { background: var(--zah-accent); color: #0f172a; }
      &.prev { left: 1.5rem; }
      &.next { right: 1.5rem; }
    }

    .slider-dots {
      position: absolute;
      bottom: 1.5rem;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 0.5rem;
      z-index: 10;
    }

    .dot-btn {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.4);
      transition: var(--zah-transition-fast);

      &.active {
        width: 32px;
        border-radius: 6px;
        background: var(--zah-accent);
      }
    }

    @media (max-width: 480px) {
      .hero-section { height: 400px; }

      .slide-title {
        font-size: 1.85rem;
        line-height: 1.15;
      }

      .slide-subtitle {
        font-size: 0.95rem;
        margin-bottom: 1.25rem;
      }

      .slider-arrow {
        width: 40px;
        height: 40px;
        font-size: 1.4rem;

        &.prev { left: 0.5rem; }
        &.next { right: 0.5rem; }
      }

      .slider-dots { bottom: 1rem; }

      .feature-blocks-section {
        margin-top: -2rem;
        margin-bottom: 2.5rem;
      }
    }

    /* Amazon-Style Feature Blocks Section */
    .feature-blocks-section {
      margin-top: -3.5rem;
      position: relative;
      z-index: 25;
      margin-bottom: 3.5rem;
    }

    .blocks-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.5rem;

      @media (max-width: 1200px) {
        grid-template-columns: repeat(2, 1fr);
      }

      @media (max-width: 640px) {
        grid-template-columns: 1fr;
      }
    }

    .feature-block-card {
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      background: var(--zah-surface);
      border-radius: var(--zah-radius-md);
      box-shadow: var(--zah-shadow-lg);

      .block-title {
        font-size: 1.15rem;
        font-weight: 800;
        margin: 0 0 1rem 0;
        color: var(--zah-text-primary);
      }

      .block-link {
        font-size: 0.85rem;
        font-weight: 700;
        color: var(--zah-accent);
        margin-top: auto;
        padding-top: 0.75rem;
        &:hover { text-decoration: underline; }
      }
    }

    .mini-cards-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 0.85rem;
      margin-bottom: 0.5rem;
    }

    .mini-card {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;

      img {
        width: 100%;
        height: 105px;
        object-fit: cover;
        border-radius: var(--zah-radius-sm);
        background: var(--zah-surface-secondary);
        transition: transform 0.3s ease;
      }

      &:hover img { transform: scale(1.05); }

      .mini-title {
        font-size: 0.75rem;
        font-weight: 600;
        color: var(--zah-text-secondary);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    .flash-sale-section {
      margin-bottom: 3.5rem;
    }

    .flash-inner {
      padding: 1.25rem 2rem;
      background: var(--zah-surface);
      border-left: 4px solid var(--zah-accent);
      border-radius: var(--zah-radius-lg);
    }

    .flash-header {
      display: flex;
      align-items: center;
      justify-content: space-between;

      @media (max-width: 768px) {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }
    }

    .flash-title-group {
      display: flex;
      align-items: center;
      gap: 1rem;
      .flash-icon { font-size: 2rem; }
      .flash-title { font-size: 1.25rem; font-weight: 800; margin: 0; }
      .flash-sub { font-size: 0.85rem; color: var(--zah-text-muted); margin: 0; }
    }

    .countdown-timer {
      display: flex;
      align-items: center;
      gap: 0.5rem;

      .colon { font-size: 1.5rem; font-weight: 800; color: var(--zah-accent); }
    }

    .time-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      background: var(--zah-primary);
      color: var(--zah-text-inverse);
      padding: 0.4rem 0.75rem;
      border-radius: var(--zah-radius-md);
      min-width: 54px;
      span { font-size: 1.2rem; font-weight: 800; font-family: var(--zah-font-heading); }
      label { font-size: 0.625rem; font-weight: 700; color: var(--zah-accent); }
    }

    .categories-section {
      margin-bottom: 4rem;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 1.75rem;

      .sub-heading { font-size: 0.75rem; font-weight: 700; color: var(--zah-accent); letter-spacing: 0.08em; }
      .section-title { font-size: 1.75rem; font-weight: 800; margin: 0; }
      .view-link { font-size: 0.9rem; font-weight: 600; color: var(--zah-accent); &:hover { text-decoration: underline; } }

      &.text-center { text-align: center; justify-content: center; }
    }

    .categories-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.5rem;

      @media (max-width: 1024px) {
        grid-template-columns: repeat(2, 1fr);
      }

      @media (max-width: 640px) {
        grid-template-columns: 1fr;
      }
    }

    .cat-card {
      position: relative;
      height: 240px;
      border-radius: var(--zah-radius-md);
      overflow: hidden;

      img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }

      &:hover img { transform: scale(1.08); }
    }

    .cat-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(0deg, rgba(15,23,42,0.85) 0%, rgba(15,23,42,0.1) 60%);
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      color: #ffffff;
    }

    .cat-item-count { font-size: 0.75rem; font-weight: 700; color: var(--zah-accent); text-transform: uppercase; }
    .cat-title { font-size: 1.35rem; font-weight: 700; margin: 0.2rem 0; color: #ffffff; }
    .shop-now-text { font-size: 0.85rem; font-weight: 600; color: #e2e8f0; opacity: 0.8; }

    .products-section {
      margin-bottom: 4rem;
    }

    /* 5 Columns Full Occupy Product Grid */
    .products-grid-5 {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 1.5rem;

      @media (max-width: 1400px) {
        grid-template-columns: repeat(4, 1fr);
      }
      @media (max-width: 1024px) {
        grid-template-columns: repeat(3, 1fr);
      }
      @media (max-width: 768px) {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    .promo-banner-section {
      margin-bottom: 4rem;
    }

    .promo-banner-card {
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      border-radius: var(--zah-radius-lg);
      padding: 3.5rem;
      display: grid;
      grid-template-columns: 1.2fr 1fr;
      gap: 2.5rem;
      align-items: center;
      color: #ffffff;

      @media (max-width: 768px) {
        grid-template-columns: 1fr;
        padding: 2rem;
      }
    }

    .promo-content {
      .promo-tag { font-size: 0.75rem; font-weight: 800; color: var(--zah-accent); letter-spacing: 0.1em; }
      h2 { font-size: 2.5rem; font-weight: 800; color: #ffffff; margin: 0.5rem 0 1rem 0; line-height: 1.2; }
      p { font-size: 1.05rem; color: #cbd5e1; margin-bottom: 1.75rem; line-height: 1.6; }
    }

    .promo-image-box {
      img { border-radius: var(--zah-radius-md); box-shadow: var(--zah-shadow-xl); max-height: 380px; width: 100%; object-fit: cover; }
    }

    .testimonials-section {
      background: var(--zah-surface-secondary);
      padding: 4.5rem 0;
      margin-bottom: 2rem;
    }

    .testimonials-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
      margin-top: 2rem;

      @media (max-width: 992px) {
        grid-template-columns: 1fr;
      }
    }

    .testimonial-card {
      padding: 2rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;

      .stars { color: var(--zah-accent); font-size: 1.1rem; }
      .quote { font-size: 0.95rem; font-style: italic; color: var(--zah-text-primary); line-height: 1.6; margin: 0; }

      .user-info {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-top: auto;
        .avatar { width: 44px; height: 44px; border-radius: 50%; object-fit: cover; }
        .name { font-size: 0.95rem; font-weight: 700; margin: 0; }
        .role { font-size: 0.75rem; color: var(--zah-text-muted); }
      }
    }
  `]
})
export class HomeComponent implements OnInit, OnDestroy {
  productService = inject(ProductService);

  slides = [
    {
      id: 1,
      badge: 'AUTUMN COUTURE 2026',
      title: 'Redefining Modern Luxury',
      subtitle: 'Discover hand-tailored apparel, sapphire timepieces, and studio-grade acoustics.',
      ctaText: 'Shop New Arrivals',
      ctaLink: '/products',
      image: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?auto=format&fit=crop&w=1600&q=80'
    },
    {
      id: 2,
      badge: 'AUDIO INNOVATION',
      title: 'Pure Studio Acoustics',
      subtitle: 'ZAH SoundPro ANC Wireless Headphones crafted for true sound purity.',
      ctaText: 'Explore SoundPro',
      ctaLink: '/products/zah-soundpro-wireless-anc-headphones',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1600&q=80'
    },
    {
      id: 3,
      badge: 'SAPPHIRE TIMEPIECES',
      title: 'Precision & Elegance',
      subtitle: 'Handcrafted Japanese quartz movement housed in sapphire crystal casing.',
      ctaText: 'Discover Timepieces',
      ctaLink: '/products/zah-minimalist-luxe-chronograph-watch',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1600&q=80'
    }
  ];

  currentSlideIndex = signal(0);
  quickViewProduct = signal<Product | null>(null);
  testimonials = MOCK_TESTIMONIALS;

  countdown = signal({ hours: '08', minutes: '42', seconds: '19' });
  private timerInterval: any;

  trendingProducts = signal<Product[]>([]);
  bestSellerProducts = signal<Product[]>([]);

  ngOnInit() {
    const all = this.productService.products();
    this.trendingProducts.set(all.filter(p => p.isTrending || p.isFlashSale));
    this.bestSellerProducts.set(all.filter(p => p.isBestSeller));

    this.startCountdown();
  }

  ngOnDestroy() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  setSlide(index: number) {
    this.currentSlideIndex.set(index);
  }

  nextSlide() {
    this.currentSlideIndex.update(i => (i + 1) % this.slides.length);
  }

  prevSlide() {
    this.currentSlideIndex.update(i => (i - 1 + this.slides.length) % this.slides.length);
  }

  openQuickView(product: Product) {
    this.quickViewProduct.set(product);
  }

  startCountdown() {
    let totalSeconds = 8 * 3600 + 42 * 60 + 19;
    this.timerInterval = setInterval(() => {
      totalSeconds--;
      if (totalSeconds < 0) totalSeconds = 24 * 3600;
      const h = Math.floor(totalSeconds / 3600);
      const m = Math.floor((totalSeconds % 3600) / 60);
      const s = totalSeconds % 60;
      this.countdown.set({
        hours: h.toString().padStart(2, '0'),
        minutes: m.toString().padStart(2, '0'),
        seconds: s.toString().padStart(2, '0')
      });
    }, 1000);
  }
}
