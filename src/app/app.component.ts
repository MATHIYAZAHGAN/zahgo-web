import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ZahHeaderComponent } from './layout/header/header.component';
import { ZahFooterComponent } from './layout/footer/footer.component';
import { ZahMobileNavComponent } from './layout/mobile-nav/mobile-nav.component';
import { ZahCartDrawerComponent } from './shared/components/zah-cart-drawer.component';
import { ZahToastComponent } from './shared/components/zah-toast.component';
import { BackToTopComponent } from './shared/components/back-to-top.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    ZahHeaderComponent,
    ZahFooterComponent,
    ZahMobileNavComponent,
    ZahCartDrawerComponent,
    ZahToastComponent,
    BackToTopComponent
  ],
  template: `
    <div class="app-layout">
      <!-- Sticky Header -->
      <zah-header></zah-header>

      <!-- Main Content Router Outlet -->
      <main class="app-main-content">
        <router-outlet></router-outlet>
      </main>

      <!-- Footer -->
      <zah-footer></zah-footer>

      <!-- Mobile Sticky Bottom Navigation -->
      <zah-mobile-nav></zah-mobile-nav>

      <!-- Slide-over Cart Drawer -->
      <zah-cart-drawer></zah-cart-drawer>

      <!-- Global Toast Notifications -->
      <zah-toast></zah-toast>

      <!-- Back to Top Button -->
      <zah-back-to-top></zah-back-to-top>
    </div>
  `,
  styles: [`
    .app-layout {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .app-main-content {
      flex-grow: 1;
    }
  `]
})
export class AppComponent {
  title = 'ZAH go — Modern Enterprise E-Commerce Platform';
}
