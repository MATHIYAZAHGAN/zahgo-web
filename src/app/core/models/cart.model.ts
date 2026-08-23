import { Product } from './product.model';

export interface CartItem {
  id: string; // unique item id (product.id + variant)
  product: Product;
  selectedColor?: { name: string; hex: string };
  selectedSize?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface CartSummary {
  subtotal: number;
  discountAmount: number;
  appliedCouponCode?: string;
  shippingFee: number;
  estimatedTax: number;
  total: number;
  freeShippingThreshold: number;
  amountForFreeShipping: number;
}
