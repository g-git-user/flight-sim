import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ThemeToggleComponent } from './theme-toggle.component';

@Component({
  selector: 'app-placeholder',
  standalone: true,
  imports: [ThemeToggleComponent],
  template: `
    <div class="container">
      <div class="app-header">
        <h1>{{ title }}</h1>
        <app-theme-toggle />
      </div>
      <p class="placeholder">Application under construction...</p>
    </div>
  `,
})
export class PlaceholderComponent {
  private readonly route = inject(ActivatedRoute);
  protected readonly title = this.route.snapshot.data['title'];
}
