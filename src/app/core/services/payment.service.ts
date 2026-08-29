import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from, map, switchMap, throwError } from 'rxjs';
import { load } from '@cashfreepayments/cashfree-js';
import { CartItem } from '../models/cart.model';
import { Address } from '../models/user.model';
import { environment } from '../../../environments/environment';

interface CreatePaymentResponse {
  success: boolean;
  data: {
    orderId: string;
    orderNumber: string;
    paymentSessionId: string;
    amount: number;
    currency: string;
  };
}

export interface PaymentStatus {
  orderId: string;
  orderNumber: string;
  status: string;
  amount: number;
  currency: string;
}

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/payments`;
  private cashfree: Awaited<ReturnType<typeof load>> | null = null;

  createOrder(items: CartItem[], address: Address, couponCode?: string): Observable<CreatePaymentResponse['data']> {
    const idempotencyKey = crypto.randomUUID();
    return this.http.post<CreatePaymentResponse>(`${this.apiUrl}/create-order`, {
      addressId: address.id,
      items: items.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
        selectedColor: item.selectedColor?.name,
        selectedSize: item.selectedSize
      })),
      couponCode,
      idempotencyKey
    }).pipe(map(response => response.data));
  }

  openCheckout(paymentSessionId: string): Observable<unknown> {
    return from(this.getCashfree()).pipe(
      switchMap(cashfree => cashfree
        ? from(cashfree.checkout({ paymentSessionId, redirectTarget: '_self' }))
        : throwError(() => new Error('Payment checkout is unavailable')))
    );
  }

  getStatus(orderId: string): Observable<PaymentStatus> {
    return this.http.get<{ success: boolean; data: PaymentStatus }>(`${this.apiUrl}/status/${encodeURIComponent(orderId)}`).pipe(
      map(response => response.data)
    );
  }

  private async getCashfree() {
    if (!this.cashfree) {
      const mode = environment.cashfreeEnv || (environment.production ? 'production' : 'sandbox');
      this.cashfree = await load({ mode });
    }
    return this.cashfree;
  }
}
