import { Injectable, signal, effect } from '@angular/core';

export type ThemeMode = 'light' | 'dark' | 'system';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  readonly currentTheme = signal<ThemeMode>('light');

  constructor() {
    const savedTheme = (localStorage.getItem('zah_theme') as ThemeMode) || 'light';
    this.currentTheme.set(savedTheme);

    effect(() => {
      const mode = this.currentTheme();
      localStorage.setItem('zah_theme', mode);
      
      const root = document.documentElement;
      if (mode === 'dark') {
        root.setAttribute('data-theme', 'dark');
      } else if (mode === 'light') {
        root.setAttribute('data-theme', 'light');
      } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        root.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
      }
    });
  }

  toggleTheme(): void {
    this.currentTheme.update(current => (current === 'light' ? 'dark' : 'light'));
  }

  setTheme(mode: ThemeMode): void {
    this.currentTheme.set(mode);
  }
}
