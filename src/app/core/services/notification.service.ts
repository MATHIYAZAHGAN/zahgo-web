import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
  id: string;
  type: 'success' | 'warning' | 'danger' | 'info';
  title: string;
  message: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  readonly toasts = signal<ToastMessage[]>([]);

  show(type: ToastMessage['type'], title: string, message: string, duration = 3500): void {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`;
    const toast: ToastMessage = { id, type, title, message, duration };
    
    this.toasts.update(list => [...list, toast]);

    if (duration > 0) {
      setTimeout(() => {
        this.dismiss(id);
      }, duration);
    }
  }

  success(title: string, message: string): void {
    this.show('success', title, message);
  }

  error(title: string, message: string): void {
    this.show('danger', title, message);
  }

  warning(title: string, message: string): void {
    this.show('warning', title, message);
  }

  info(title: string, message: string): void {
    this.show('info', title, message);
  }

  dismiss(id: string): void {
    this.toasts.update(list => list.filter(t => t.id !== id));
  }
}
