import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'zah-not-found',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="zah-container not-found-page">
      <div class="not-found-card zah-card animate-fade-in">
        <span class="code">404</span>
        <h1>Page Not Found</h1>
        <p>The page or item you are seeking does not exist or may have been relocated.</p>
        <a routerLink="/" class="zah-btn zah-btn-primary">Back to Homepage</a>
      </div>
    </div>
  `,
  styles: [`
    .not-found-page { padding-top: 4rem; padding-bottom: 5rem; display: flex; justify-content: center; }
    .not-found-card { max-width: 500px; width: 100%; padding: 3rem; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 1rem; }
    .code { font-size: 5rem; font-weight: 900; font-family: var(--zah-font-heading); color: var(--zah-accent); line-height: 1; }
    h1 { font-size: 1.75rem; font-weight: 800; margin: 0; }
    p { font-size: 0.95rem; color: var(--zah-text-muted); margin: 0; line-height: 1.5; }
  `]
})
export class NotFoundComponent {}
