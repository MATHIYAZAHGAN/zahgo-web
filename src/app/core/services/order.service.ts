import { Injectable, signal, inject } from '@angular/core';
import { Order, OrderStatus } from '../models/order.model';
import { CartItem, CartSummary } from '../models/cart.model';
import { Address } from '../models/user.model';
import { NotificationService } from './notification.service';
import { CartService } from './cart.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private notificationService = inject(NotificationService);
  private cartService = inject(CartService);

  readonly orders = signal<Order[]>([
    {
      id: 'ord-9021',
      orderNumber: 'ZAH-2026-9021',
      date: '14 Aug 2026',
      items: [
        {
          id: 'item-1',
          product: {
            id: 'zah-p1',
            name: 'ZAH SoundPro Wireless ANC Headphones',
            slug: 'zah-soundpro-wireless-anc-headphones',
            brand: 'ZAH Audio',
            category: 'Electronics',
            categoryId: 'cat-1',
            price: 4999,
            originalPrice: 7999,
            discountPercentage: 38,
            rating: 4.8,
            reviewCount: 342,
            images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'],
            description: '',
            shortDescription: '',
            inStock: true,
            stockCount: 10
          },
          quantity: 1,
          unitPrice: 4999,
          totalPrice: 4999
        }
      ],
      shippingAddress: {
        id: 'addr-1',
        fullName: 'Siddharth V.',
        phone: '+91 98765 43210',
        streetAddress: 'Flat 402, Highline Luxury Towers, Bandra West',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400050',
        type: 'HOME',
        isDefault: true
      },
      paymentMethod: 'CARD',
      paymentStatus: 'PAID',
      status: 'SHIPPED',
      subtotal: 4999,
      discountAmount: 500,
      shippingFee: 0,
      tax: 225,
      totalAmount: 4724,
      estimatedDeliveryDate: '17 Aug 2026',
      trackingNumber: 'ZAH-EXP-7782190',
      timeline: [
        { status: 'PLACED', title: 'Order Placed', description: 'Order submitted successfully', timestamp: '14 Aug 2026, 10:30 AM', completed: true },
        { status: 'CONFIRMED', title: 'Order Confirmed', description: 'Payment verified and inventory reserved', timestamp: '14 Aug 2026, 10:35 AM', completed: true },
        { status: 'SHIPPED', title: 'Shipped from Warehouse', description: 'Handed over to Express Courier', timestamp: '15 Aug 2026, 08:15 AM', completed: true },
        { status: 'OUT_FOR_DELIVERY', title: 'Out for Delivery', description: 'Driver en route to destination', timestamp: 'Pending', completed: false },
        { status: 'DELIVERED', title: 'Delivered', description: 'Package handed to customer', timestamp: 'Pending', completed: false }
      ]
    }
  ]);

  getOrderById(id: string): Order | undefined {
    return this.orders().find(o => o.id === id || o.orderNumber === id);
  }

  placeOrder(
    items: CartItem[],
    summary: CartSummary,
    address: Address,
    paymentMethod: Order['paymentMethod']
  ): Order {
    const orderNum = `ZAH-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      items: [...items],
      shippingAddress: address,
      paymentMethod,
      paymentStatus: paymentMethod === 'COD' ? 'PENDING' : 'PAID',
      status: 'PLACED',
      subtotal: summary.subtotal,
      discountAmount: summary.discountAmount,
      shippingFee: summary.shippingFee,
      tax: summary.estimatedTax,
      totalAmount: summary.total,
      estimatedDeliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      trackingNumber: `ZAH-TRK-${Math.floor(1000000 + Math.random() * 9000000)}`,
      timeline: [
        { status: 'PLACED', title: 'Order Placed', description: 'Your order has been received', timestamp: 'Just now', completed: true },
        { status: 'CONFIRMED', title: 'Order Confirmed', description: 'Processing items', timestamp: 'Pending', completed: false },
        { status: 'SHIPPED', title: 'Shipped', description: 'Courier dispatch', timestamp: 'Pending', completed: false },
        { status: 'OUT_FOR_DELIVERY', title: 'Out for Delivery', description: 'Local courier delivery', timestamp: 'Pending', completed: false },
        { status: 'DELIVERED', title: 'Delivered', description: 'Handover complete', timestamp: 'Pending', completed: false }
      ]
    };

    this.orders.update(list => [newOrder, ...list]);
    this.cartService.clearCart();
    this.notificationService.success('Order Placed Successfully!', `Order reference: ${orderNum}`);
    return newOrder;
  }
}
