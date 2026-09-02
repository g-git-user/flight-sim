import { Component, inject } from '@angular/core';
import { ThemeService } from './theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [],
  template: `
    <button
      class="theme"
      (click)="theme.toggle()"
      [attr.aria-label]="theme.isDark() ? 'Light mode' : 'Dark mode'"
    >
      @if (theme.isDark()) {
        <img src="icons/sun.svg" alt="Light mode" />
      } @else {
        <img src="icons/moon.svg" alt="Dark mode" />
      }
    </button>
  `,
})
export class ThemeToggleComponent {
  readonly theme = inject(ThemeService);
}
