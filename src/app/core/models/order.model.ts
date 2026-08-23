import { CartItem } from './cart.model';
import { Address } from './user.model';

export type OrderStatus = 'PLACED' | 'CONFIRMED' | 'SHIPPED' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  items: CartItem[];
  shippingAddress: Address;
  paymentMethod: 'UPI' | 'CARD' | 'NETBANKING' | 'COD';
  paymentStatus: 'PAID' | 'PENDING' | 'FAILED';
  status: OrderStatus;
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  tax: number;
  totalAmount: number;
  estimatedDeliveryDate: string;
  trackingNumber?: string;
  timeline: {
    status: OrderStatus;
    title: string;
    description: string;
    timestamp: string;
    completed: boolean;
  }[];
}
