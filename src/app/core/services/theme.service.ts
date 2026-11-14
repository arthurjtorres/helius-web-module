import { computed, effect, Injectable, signal } from '@angular/core';

export type ThemeMode = 'system' | 'light' | 'dark';
const KEY = 'helius_theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly media = window.matchMedia('(prefers-color-scheme: dark)');
  private readonly systemDark = signal(this.media.matches);

  readonly mode = signal<ThemeMode>(this.read());
  readonly isDark = computed(
    () => this.mode() === 'dark' || (this.mode() === 'system' && this.systemDark())
  );

  constructor() {
    this.media.addEventListener('change', (e) => this.systemDark.set(e.matches));

    effect(() => {
      const mode = this.mode();
      const root = document.documentElement;
      if (mode === 'system') root.removeAttribute('data-theme');
      else root.dataset['theme'] = mode;
      localStorage.setItem(KEY, mode);
    });
  }

  set(mode: ThemeMode) { this.mode.set(mode); }
  toggle() { this.mode.set(this.isDark() ? 'light' : 'dark'); }

  
  private read(): ThemeMode {
    const v = localStorage.getItem(KEY);
    if (v === 'light' || v === 'dark' || v === 'system') return v;
    return localStorage.getItem('helius_dark_mode') === 'true' ? 'dark' : 'system';
  }
}