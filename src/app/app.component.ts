import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeService } from './theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  host: {
    '[class.dark]': 'theme.isDark()',
  },
})
export class AppComponent {
  readonly theme = inject(ThemeService);

  readonly apps = [
    { path: 'alphabet-radio', label: 'Radio Alphabet', icon: '✈' },
    { path: 'conversion', label: 'Conversion', icon: '⇄' },
    { path: 'top-of-descent', label: 'Top of Descent', icon: '↓' },
    { path: 'app1', label: 'App 1', icon: '1' },
    { path: 'app2', label: 'App 2', icon: '2' },
    { path: 'app3', label: 'App 3', icon: '3' },
  ];
}
