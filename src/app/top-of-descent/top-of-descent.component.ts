import { Component } from '@angular/core';
import { ThemeToggleComponent } from '../theme-toggle.component';

@Component({
  selector: 'app-top-of-descent',
  standalone: true,
  imports: [ThemeToggleComponent],
  templateUrl: './top-of-descent.component.html',
  styleUrl: './top-of-descent.component.css',
})
export class TopOfDescentComponent {
  currentAltitude = '';
  targetAltitude = '';
  groundSpeed = '';
  descentAngle = '3';

  get todDistance(): string {
    return this.computeDistance();
  }

  get descentRate(): string {
    return this.computeDescentRate();
  }

  get timeToDescend(): string {
    const rate = this.computeDescentRate();
    if (rate === '-') return '-';
    const delta = parseFloat(this.currentAltitude) - parseFloat(this.targetAltitude);
    const minutes = delta / parseFloat(rate);
    return this.format(minutes);
  }

  private computeDistance(): string {
    const delta = parseFloat(this.currentAltitude) - parseFloat(this.targetAltitude);
    const angle = parseFloat(this.descentAngle);
    if (this.currentAltitude === '' || this.targetAltitude === '' || this.descentAngle === '') return '-';
    if (isNaN(delta) || isNaN(angle) || angle === 0) return '-';
    const rad = (angle * Math.PI) / 180;
    return this.format(delta / (Math.tan(rad) * 6076.12));
  }

  private computeDescentRate(): string {
    const gs = parseFloat(this.groundSpeed);
    const angle = parseFloat(this.descentAngle);
    if (this.groundSpeed === '' || this.descentAngle === '') return '-';
    if (isNaN(gs) || isNaN(angle)) return '-';
    const rad = (angle * Math.PI) / 180;
    return this.format(gs * Math.sin(rad) * (6076.12 / 60));
  }

  onInput(event: Event, field: keyof this): void {
    (this as any)[field] = (event.target as HTMLInputElement).value;
  }

  private format(n: number): string {
    const abs = Math.abs(n);
    if (isNaN(n) || !isFinite(n)) return '0';
    if (abs !== 0 && abs < 0.01) return n.toExponential(2);
    return parseFloat(n.toFixed(1)).toString();
  }
}
