import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly darkMode = signal<boolean>(localStorage.getItem('theme') === 'dark');

  isDark = this.darkMode.asReadonly();

  toggle(): void {
    this.darkMode.update((v) => !v);
    localStorage.setItem('theme', this.darkMode() ? 'dark' : 'light');
  }
}
