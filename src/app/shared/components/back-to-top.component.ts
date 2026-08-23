import { Component, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'zah-back-to-top',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isVisible()) {
      <button 
        class="back-to-top-btn animate-slide-up"
        (click)="scrollToTop()"
        aria-label="Back to top">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="m18 15-6-6-6 6"/>
        </svg>
      </button>
    }
  `,
  styles: [`
    .back-to-top-btn {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: var(--zah-accent);
      color: #0f172a;
      box-shadow: 0 4px 12px rgba(212, 175, 55, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 999;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      border: 2px solid rgba(255, 255, 255, 0.3);

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 20px rgba(212, 175, 55, 0.5);
        background: #e5c158;
      }

      &:active {
        transform: translateY(-2px);
      }
    }

    @media (max-width: 640px) {
      .back-to-top-btn {
        bottom: 1.5rem;
        right: 1.5rem;
        width: 44px;
        height: 44px;
      }
    }
  `]
})
export class BackToTopComponent {
  isVisible = signal(false);

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.isVisible.set(scrollPosition > 400);
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}
