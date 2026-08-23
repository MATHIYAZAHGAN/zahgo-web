import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'zah-support',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="zah-container support-page">
      <div class="support-hero zah-card">
        <h1>ZAH Concierge & Help Center</h1>
        <p>How can we assist you today? Search our knowledge base or get in touch with our team.</p>

        <div class="faq-search">
          <input type="text" placeholder="Search FAQ (e.g. shipping, returns, warranty)..." [(ngModel)]="searchQuery" />
        </div>
      </div>

      <!-- FAQ Categories Grid -->
      <div class="faq-section">
        <h2>Frequently Asked Questions</h2>
        <div class="faq-grid">
          @for (faq of filteredFaqs(); track faq.q) {
            <div class="faq-card zah-card">
              <h4>{{ faq.q }}</h4>
              <p>{{ faq.a }}</p>
            </div>
          }
        </div>
      </div>

      <!-- Contact Form -->
      <div class="contact-card zah-card">
        <h3>Need Further Assistance?</h3>
        <p>Our concierge team responds within 2 business hours.</p>
        <form (ngSubmit)="sendQuery()" class="contact-form">
          <input type="text" placeholder="Your Name" [(ngModel)]="contactName" name="name" required />
          <input type="email" placeholder="Your Email" [(ngModel)]="contactEmail" name="email" required />
          <textarea placeholder="Describe your inquiry..." [(ngModel)]="contactMsg" name="msg" rows="4" required></textarea>
          <button type="submit" class="zah-btn zah-btn-primary">Submit Ticket</button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .support-page { padding-top: 2rem; padding-bottom: 4rem; display: flex; flex-direction: column; gap: 2.5rem; }
    .support-hero { padding: 3rem 2rem; background: linear-gradient(135deg, var(--zah-primary) 0%, #1e293b 100%); color: #ffffff; border-radius: var(--zah-radius-lg); text-align: center; h1 { font-size: 2.25rem; font-weight: 800; color: #ffffff; margin-bottom: 0.5rem; } p { color: #cbd5e1; font-size: 1rem; margin-bottom: 1.5rem; } }
    .faq-search { max-width: 500px; margin: 0 auto; input { width: 100%; padding: 0.75rem 1rem; border-radius: var(--zah-radius-full); border: none; font-size: 0.95rem; } }
    .faq-section { h2 { font-size: 1.5rem; font-weight: 800; margin-bottom: 1.5rem; } }
    .faq-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; @media (max-width: 768px) { grid-template-columns: 1fr; } }
    .faq-card { padding: 1.5rem; h4 { font-size: 1.05rem; font-weight: 700; margin: 0 0 0.5rem 0; color: var(--zah-text-primary); } p { font-size: 0.9rem; color: var(--zah-text-secondary); line-height: 1.5; margin: 0; } }
    .contact-card { padding: 2rem; max-width: 600px; margin: 0 auto; width: 100%; h3 { font-size: 1.35rem; font-weight: 800; margin: 0 0 0.35rem 0; } p { font-size: 0.875rem; color: var(--zah-text-muted); margin-bottom: 1.25rem; } }
    .contact-form { display: flex; flex-direction: column; gap: 1rem; input, textarea { padding: 0.65rem 0.85rem; border-radius: var(--zah-radius-md); border: 1px solid var(--zah-border-strong); background: var(--zah-surface); color: var(--zah-text-primary); font-size: 0.9rem; } }
  `]
})
export class SupportComponent {
  notificationService = inject(NotificationService);

  searchQuery = '';
  contactName = '';
  contactEmail = '';
  contactMsg = '';

  faqs = [
    { q: 'How long does Express Shipping take?', a: 'Standard orders are delivered within 2–3 business days. VIP Air Delivery arrives the next morning by 10:30 AM.' },
    { q: 'What is the ZAH Return & Exchange policy?', a: 'We offer a 30-day hassle-free doorstep pick up for returns and size exchanges on all unwashed items.' },
    { q: 'Are all ZAH Audio products covered by warranty?', a: 'Yes, all ZAH SoundPro wireless audio products come with a 2-Year International Replacement Warranty.' },
    { q: 'Can I change my delivery address after placing an order?', a: 'Addresses can be updated within 2 hours of order placement by calling our concierge team.' }
  ];

  filteredFaqs() {
    if (!this.searchQuery.trim()) return this.faqs;
    const q = this.searchQuery.toLowerCase();
    return this.faqs.filter(f => f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q));
  }

  sendQuery() {
    if (this.contactEmail && this.contactMsg) {
      this.notificationService.success('Ticket Submitted', 'Our concierge team will respond shortly.');
      this.contactName = '';
      this.contactEmail = '';
      this.contactMsg = '';
    }
  }
}
