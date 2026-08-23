import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { Product } from '../models/product.model';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private notificationService = inject(NotificationService);

  readonly wishlistItems = signal<Product[]>([]);

  readonly count = computed(() => this.wishlistItems().length);

  constructor() {
    const saved = localStorage.getItem('zah_wishlist');
    if (saved) {
      try {
        this.wishlistItems.set(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load wishlist:', e);
      }
    }

    effect(() => {
      localStorage.setItem('zah_wishlist', JSON.stringify(this.wishlistItems()));
    });
  }

  isInWishlist(productId: string): boolean {
    return this.wishlistItems().some(p => p.id === productId);
  }

  toggleWishlist(product: Product): void {
    if (this.isInWishlist(product.id)) {
      this.wishlistItems.update(list => list.filter(p => p.id !== product.id));
      this.notificationService.info('Removed from Wishlist', `${product.name} removed from saved items.`);
    } else {
      this.wishlistItems.update(list => [...list, product]);
      this.notificationService.success('Added to Wishlist', `${product.name} saved to your wishlist.`);
    }
  }

  removeFromWishlist(productId: string): void {
    this.wishlistItems.update(list => list.filter(p => p.id !== productId));
    this.notificationService.info('Wishlist Updated', 'Item removed.');
  }

  clearWishlist(): void {
    this.wishlistItems.set([]);
  }
}
