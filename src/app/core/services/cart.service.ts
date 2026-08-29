import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { CartItem, CartSummary } from '../models/cart.model';
import { Product } from '../models/product.model';
import { Coupon } from '../models/coupon.model';
import { MOCK_COUPONS } from '../constants/mock-data';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private notificationService = inject(NotificationService);

  readonly cartItems = signal<CartItem[]>([]);
  readonly appliedCoupon = signal<Coupon | null>(null);
  readonly isCartDrawerOpen = signal<boolean>(false);

  readonly totalItemCount = computed(() => {
    return this.cartItems().reduce((acc, item) => acc + item.quantity, 0);
  });

  readonly cartSummary = computed<CartSummary>(() => {
    const items = this.cartItems();
    const coupon = this.appliedCoupon();

    const subtotal = items.reduce((acc, item) => acc + item.totalPrice, 0);
    
    let discountAmount = 0;
    if (coupon && subtotal >= coupon.minOrderAmount) {
      const calcDiscount = (subtotal * coupon.discountPercentage) / 100;
      discountAmount = coupon.maxDiscount ? Math.min(calcDiscount, coupon.maxDiscount) : calcDiscount;
    }

    const freeShippingThreshold = 0;
    const shippingFee = subtotal === 0 ? 0 : 1;
    const estimatedTax = Math.round((subtotal - discountAmount) * 0.05); // 5% GST
    const total = Math.max(0, subtotal - discountAmount + shippingFee + estimatedTax);
    const amountForFreeShipping = 0;

    return {
      subtotal,
      discountAmount,
      appliedCouponCode: coupon?.code,
      shippingFee,
      estimatedTax,
      total,
      freeShippingThreshold,
      amountForFreeShipping
    };
  });

  constructor() {
    const saved = localStorage.getItem('zah_cart');
    if (saved) {
      try {
        this.cartItems.set(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load cart state:', e);
      }
    }

    effect(() => {
      localStorage.setItem('zah_cart', JSON.stringify(this.cartItems()));
    });
  }

  addToCart(product: Product, quantity = 1, selectedColor?: { name: string; hex: string }, selectedSize?: string): void {
    const variantId = `${product.id}-${selectedColor?.name || 'default'}-${selectedSize || 'standard'}`;

    this.cartItems.update(items => {
      const index = items.findIndex(i => i.id === variantId);
      if (index > -1) {
        const updated = [...items];
        const newQty = updated[index].quantity + quantity;
        updated[index] = {
          ...updated[index],
          quantity: newQty,
          totalPrice: newQty * updated[index].unitPrice
        };
        return updated;
      } else {
        const newItem: CartItem = {
          id: variantId,
          product,
          selectedColor,
          selectedSize,
          quantity,
          unitPrice: product.price,
          totalPrice: product.price * quantity
        };
        return [...items, newItem];
      }
    });

    this.notificationService.success('Added to Cart', `${product.name} is now in your shopping bag.`);
  }

  updateQuantity(itemId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(itemId);
      return;
    }
    this.cartItems.update(items => {
      return items.map(item => {
        if (item.id === itemId) {
          return {
            ...item,
            quantity,
            totalPrice: item.unitPrice * quantity
          };
        }
        return item;
      });
    });
  }

  removeFromCart(itemId: string): void {
    this.cartItems.update(items => items.filter(i => i.id !== itemId));
    this.notificationService.info('Item Removed', 'Product removed from cart.');
  }

  applyCoupon(code: string): boolean {
    const found = MOCK_COUPONS.find(c => c.code.toUpperCase() === code.trim().toUpperCase());
    if (!found) {
      this.notificationService.error('Invalid Coupon', 'The entered code does not exist.');
      return false;
    }
    const currentSubtotal = this.cartSummary().subtotal;
    if (currentSubtotal < found.minOrderAmount) {
      this.notificationService.warning('Min Amount Not Met', `Minimum order amount for ${found.code} is ₹${found.minOrderAmount}.`);
      return false;
    }
    this.appliedCoupon.set(found);
    this.notificationService.success('Coupon Applied!', `You saved with promo code ${found.code}.`);
    return true;
  }

  removeCoupon(): void {
    this.appliedCoupon.set(null);
    this.notificationService.info('Coupon Removed', 'Promo code removed.');
  }

  clearCart(): void {
    this.cartItems.set([]);
    this.appliedCoupon.set(null);
  }

  openCartDrawer(): void {
    this.isCartDrawerOpen.set(true);
  }

  closeCartDrawer(): void {
    this.isCartDrawerOpen.set(false);
  }

  toggleCartDrawer(): void {
    this.isCartDrawerOpen.update(v => !v);
  }
}
