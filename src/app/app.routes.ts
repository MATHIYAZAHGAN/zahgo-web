import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent) },
  { path: 'products', loadComponent: () => import('./features/products/products.component').then(m => m.ProductsComponent) },
  { path: 'products/:slug', loadComponent: () => import('./features/product-details/product-details.component').then(m => m.ProductDetailsComponent) },
  { path: 'category/:slug', loadComponent: () => import('./features/categories/categories.component').then(m => m.CategoriesComponent) },
  { path: 'search', loadComponent: () => import('./features/search/search.component').then(m => m.SearchComponent) },
  { path: 'cart', loadComponent: () => import('./features/cart/cart.component').then(m => m.CartComponent) },
  { path: 'wishlist', loadComponent: () => import('./features/wishlist/wishlist.component').then(m => m.WishlistComponent) },
  { path: 'checkout', loadComponent: () => import('./features/checkout/checkout.component').then(m => m.CheckoutComponent) },
  { path: 'order-confirmation', loadComponent: () => import('./features/order-confirmation/order-confirmation.component').then(m => m.OrderConfirmationComponent) },
  { path: 'account', loadComponent: () => import('./features/account/account.component').then(m => m.AccountComponent) },
  { path: 'account/orders', loadComponent: () => import('./features/account/account.component').then(m => m.AccountComponent) },
  { path: 'account/addresses', loadComponent: () => import('./features/account/account.component').then(m => m.AccountComponent) },
  { path: 'login', loadComponent: () => import('./features/auth/auth.component').then(m => m.AuthComponent) },
  { path: 'register', loadComponent: () => import('./features/auth/auth.component').then(m => m.AuthComponent) },
  { path: 'forgot-password', loadComponent: () => import('./features/auth/auth.component').then(m => m.AuthComponent) },
  { path: 'offers', loadComponent: () => import('./features/offers/offers.component').then(m => m.OffersComponent) },
  { path: 'support', loadComponent: () => import('./features/support/support.component').then(m => m.SupportComponent) },
  { path: '**', loadComponent: () => import('./features/errors/not-found.component').then(m => m.NotFoundComponent) }
];
