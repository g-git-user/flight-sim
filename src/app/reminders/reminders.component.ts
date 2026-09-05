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
        'Formula: Distance (NM) = (Δ-Altitude (ft) / 1000) x 3',
        'Formula: Vertical Speed (fpm) = 5 x Ground Speed (kt)',
      ],
    },
    {
      title: 'VOR RANGE',
      lines: [
        'Formula: Range (NM) ≈ 1.23 x √Altitude (ft)',
        'Formula: Range (km) ≈ 3.57 x √Altitude (m)',
        '<em>> where altitude is AGL</em>',
      ],
    },
    {
      title: 'CONVERT CLIMB GRADIENT (ft/NM) TO FPM',
      lines: [
        'Formula: ft/NM requirement x NM per minute = FPM',
        '<em>> Example: A departure procedure requires 300 ft/NM climb. At 120 KT ground speed</em>',
      ],
    },
    {
      title: 'DESCENT RATE',
      lines: [
        'Formula: (Altitude to lose (ft) ÷ Distance to descend (NM)) x (Groundspeed (kt) ÷ 60) = FPM',
        '<em>> Example: You need to descend 6,000 feet over 20 NM. Groundspeed = 120 kt</em>',
      ],
    },
    {
      title: 'GROUND SPEED FROM TIME AND DISTANCE',
      lines: [
        'Formula: Distance (NM) ÷ Time (hours) = Groundspeed (kt)',
        '<em>> Example: Covering 45 NM in 0.5 hours</em>',
      ],
    },
  ];
}
