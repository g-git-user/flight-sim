import { Component } from '@angular/core';
import { ThemeToggleComponent } from '../theme-toggle.component';

interface Formula {
  title: string;
  lines: string[];
}

@Component({
  selector: 'app-reminders',
  standalone: true,
  imports: [ThemeToggleComponent],
  templateUrl: './reminders.component.html',
  styleUrl: './reminders.component.css',
})
export class RemindersComponent {
  readonly formulas: Formula[] = [
    {
      title: 'CALCULATE TOD (3°)',
      lines: [
        'Distance (NM) = (Δ_AltitudeFeet / 1000) x 3',
        'Vertical Speed (fpm) = 5 x Ground Speed (kt)',
      ],
    },
  ];
}
