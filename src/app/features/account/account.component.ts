import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { OrderService } from '../../core/services/order.service';
import { WishlistService } from '../../core/services/wishlist.service';

@Component({
  selector: 'zah-account',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="zah-container account-page">
      <div class="account-header zah-card">
        <img [src]="authService.currentUser()?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'" alt="Avatar" class="avatar" />
        <div class="user-meta">
          <h2>{{ authService.currentUser()?.name }}</h2>
          <p>{{ authService.currentUser()?.email }} • {{ authService.currentUser()?.phone }}</p>
        </div>
        <div class="reward-box">
          <span class="points-val">{{ authService.currentUser()?.rewardPoints }}</span>
          <span class="points-label">ZAH Reward Points</span>
        </div>
      </div>

      <!-- Account Navigation Tabs -->
      <div class="account-tabs">
        <button [class.active]="activeTab() === 'overview'" (click)="activeTab.set('overview')">Overview</button>
        <button [class.active]="activeTab() === 'orders'" (click)="activeTab.set('orders')">My Orders ({{ orderService.orders().length }})</button>
        <button [class.active]="activeTab() === 'addresses'" (click)="activeTab.set('addresses')">Saved Addresses</button>
      </div>

      <!-- Tab Content Area -->
      <div class="tab-content">
        <!-- Overview Tab -->
        @if (activeTab() === 'overview') {
          <div class="overview-grid">
            <div class="stat-card zah-card">
              <span class="stat-icon">📦</span>
              <h3>{{ orderService.orders().length }}</h3>
              <p>Total Orders Placed</p>
            </div>
            <div class="stat-card zah-card">
              <span class="stat-icon">❤️</span>
              <h3>{{ wishlistService.count() }}</h3>
              <p>Wishlist Saved Items</p>
            </div>
            <div class="stat-card zah-card">
              <span class="stat-icon">📍</span>
              <h3>{{ authService.currentUser()?.addresses?.length || 0 }}</h3>
              <p>Saved Delivery Addresses</p>
            </div>
          </div>
        }

        <!-- Orders Tab with Visual Timeline Stepper -->
        @if (activeTab() === 'orders') {
          <div class="orders-list">
            @for (order of orderService.orders(); track order.id) {
              <div class="order-card zah-card">
                <div class="order-header">
                  <div>
                    <strong>Order Ref: {{ order.orderNumber }}</strong>
                    <span class="date">{{ order.date }}</span>
                  </div>
                  <span class="status-badge" [class]="order.status.toLowerCase()">{{ order.status }}</span>
                </div>

                <div class="items-preview">
                  @for (item of order.items; track item.id) {
                    <div class="item">
                      <img [src]="item.product.images[0]" [alt]="item.product.name" />
                      <span>{{ item.product.name }} (x{{ item.quantity }})</span>
                      <strong class="item-price">₹{{ item.totalPrice | number }}</strong>
                    </div>
                  }
                </div>

                <!-- Visual Stepper -->
                <div class="timeline-stepper">
                  @for (step of order.timeline; track step.title) {
                    <div class="t-step" [class.completed]="step.completed">
                      <div class="dot"></div>
                      <span class="t-title">{{ step.title }}</span>
                    </div>
                  }
                </div>
              </div>
            }
          </div>
        }

        <!-- Addresses Tab -->
        @if (activeTab() === 'addresses') {
          <div class="addresses-section">
            <div class="add-bar">
              <button class="zah-btn zah-btn-primary" (click)="showNewAddrForm.set(true)">+ Add New Address</button>
            </div>

            @if (showNewAddrForm()) {
              <div class="new-addr-form zah-card">
                <h3>Add New Address</h3>
                <div class="form-grid">
                  <input type="text" placeholder="Full Name" [(ngModel)]="newAddr.fullName" />
                  <input type="text" placeholder="Phone Number" [(ngModel)]="newAddr.phone" />
                  <input type="text" placeholder="Street Address" [(ngModel)]="newAddr.streetAddress" class="full" />
                  <input type="text" placeholder="City" [(ngModel)]="newAddr.city" />
                  <input type="text" placeholder="State" [(ngModel)]="newAddr.state" />
                  <input type="text" placeholder="Pincode" [(ngModel)]="newAddr.pincode" />
                </div>
                <div class="form-actions">
                  <button class="zah-btn zah-btn-ghost" (click)="showNewAddrForm.set(false)">Cancel</button>
                  <button class="zah-btn zah-btn-primary" (click)="saveAddress()">Save Address</button>
                </div>
              </div>
            }

            <div class="addr-grid">
              @for (addr of authService.currentUser()?.addresses || []; track addr.id) {
                <div class="addr-card zah-card">
                  <div class="top">
                    <span class="type">{{ addr.type }}</span>
                    <button class="del-btn" (click)="authService.deleteAddress(addr.id)">Delete</button>
                  </div>
                  <strong>{{ addr.fullName }}</strong>
                  <p>{{ addr.phone }}</p>
                  <p>{{ addr.streetAddress }}, {{ addr.city }}, {{ addr.state }} - {{ addr.pincode }}</p>
                </div>
              }
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .account-page { padding-top: 2rem; padding-bottom: 4rem; }

    .account-header {
      padding: 2rem;
      display: flex;
      align-items: center;
      gap: 1.5rem;
      margin-bottom: 2rem;

      .avatar { width: 72px; height: 72px; border-radius: 50%; object-fit: cover; border: 2px solid var(--zah-accent); }
      .user-meta { flex-grow: 1; h2 { margin: 0; font-size: 1.5rem; font-weight: 800; } p { margin: 0.25rem 0 0 0; color: var(--zah-text-muted); font-size: 0.9rem; } }
      .reward-box { background: var(--zah-accent-light); padding: 0.75rem 1.25rem; border-radius: var(--zah-radius-md); text-align: center; .points-val { font-size: 1.5rem; font-weight: 800; color: var(--zah-accent); display: block; } .points-label { font-size: 0.725rem; font-weight: 700; text-transform: uppercase; } }
    }

    .account-tabs {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
      border-bottom: 1px solid var(--zah-border);

      button {
        padding: 0.85rem 1.5rem;
        font-size: 0.95rem;
        font-weight: 600;
        color: var(--zah-text-secondary);
        border-bottom: 2px solid transparent;

        &.active {
          color: var(--zah-text-primary);
          border-bottom-color: var(--zah-accent);
        }
      }
    }

    .overview-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;

      .stat-card {
        padding: 2rem;
        text-align: center;
        .stat-icon { font-size: 2.5rem; display: block; margin-bottom: 0.5rem; }
        h3 { font-size: 2rem; font-weight: 800; margin: 0; }
        p { color: var(--zah-text-muted); font-size: 0.9rem; margin: 0.25rem 0 0 0; }
      }
    }

    .orders-list { display: flex; flex-direction: column; gap: 1.5rem; }

    .order-card {
      padding: 1.5rem;

      .order-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 1rem;
        border-bottom: 1px solid var(--zah-border);

        .date { color: var(--zah-text-muted); font-size: 0.85rem; margin-left: 0.75rem; }
        .status-badge { font-size: 0.75rem; font-weight: 700; padding: 0.2rem 0.6rem; border-radius: 4px; background: var(--zah-surface-tertiary); }
      }
    }

    .items-preview {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      padding: 1rem 0;

      .item { display: flex; align-items: center; gap: 1rem; img { width: 44px; height: 44px; border-radius: 4px; object-fit: cover; } span { flex-grow: 1; font-size: 0.9rem; } .item-price { font-weight: 700; } }
    }

    .timeline-stepper {
      display: flex;
      justify-content: space-between;
      padding-top: 1rem;
      border-top: 1px solid var(--zah-border);

      .t-step {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.775rem;
        color: var(--zah-text-muted);

        .dot { width: 10px; height: 10px; border-radius: 50%; background: var(--zah-border); }

        &.completed {
          color: var(--zah-success);
          .dot { background: var(--zah-success); }
        }
      }
    }

    .addresses-section { display: flex; flex-direction: column; gap: 1.5rem; }
    .add-bar { display: flex; justify-content: flex-end; }
    .new-addr-form { padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; .full { grid-column: span 2; } input { padding: 0.6rem; border-radius: var(--zah-radius-sm); border: 1px solid var(--zah-border-strong); } } .form-actions { display: flex; justify-content: flex-end; gap: 0.75rem; } }
    .addr-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.25rem; }
    .addr-card { padding: 1.25rem; display: flex; flex-direction: column; gap: 0.35rem; .top { display: flex; justify-content: space-between; .type { font-size: 0.7rem; font-weight: 700; background: var(--zah-primary); color: var(--zah-text-inverse); padding: 0.15rem 0.4rem; border-radius: 4px; } .del-btn { font-size: 0.75rem; color: var(--zah-danger); } } }
    @media (max-width: 640px) {
      .account-page { padding-top: 1.25rem; }
      .account-header { padding: 1.25rem; align-items: flex-start; flex-wrap: wrap; gap: 1rem; }
      .user-meta { min-width: 0; }
      .reward-box { margin-left: 88px; }
      .account-tabs { gap: 0; overflow-x: auto; margin-bottom: 1.25rem; }
      .account-tabs button { flex: 0 0 auto; padding: 0.75rem 1rem; white-space: nowrap; }
      .overview-grid, .addr-grid { grid-template-columns: 1fr; gap: 1rem; }
      .new-addr-form { padding: 1rem; }
      .new-addr-form .form-grid { grid-template-columns: 1fr; }
      .new-addr-form .form-grid .full { grid-column: auto; }
      .new-addr-form .form-actions { flex-direction: column-reverse; }
      .new-addr-form .form-actions .zah-btn { width: 100%; }
      .order-card { padding: 1rem; }
      .order-card .order-header { align-items: flex-start; flex-direction: column; gap: 0.5rem; }
      .timeline-stepper { overflow-x: auto; gap: 1rem; justify-content: flex-start; }
      .timeline-stepper .t-step { flex: 0 0 auto; }
    }
  `]
})
export class AccountComponent {
  authService = inject(AuthService);
  orderService = inject(OrderService);
  wishlistService = inject(WishlistService);

  activeTab = signal<'overview' | 'orders' | 'addresses'>('overview');
  showNewAddrForm = signal(false);

  newAddr = {
    fullName: '',
    phone: '',
    streetAddress: '',
    city: '',
    state: '',
    pincode: '',
    type: 'HOME' as const,
    isDefault: false
  };

  saveAddress() {
    if (this.newAddr.fullName && this.newAddr.streetAddress) {
      this.authService.addAddress(this.newAddr).subscribe(address => {
        if (address) this.showNewAddrForm.set(false);
      });
      this.newAddr = { fullName: '', phone: '', streetAddress: '', city: '', state: '', pincode: '', type: 'HOME', isDefault: false };
    }
  }
}
