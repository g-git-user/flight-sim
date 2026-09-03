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

  profile: ProfileInputs = {
    currentAltitude: '',
    targetAltitude: '',
    distance: '',
    groundSpeed: '',
  };

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

  get requiredVerticalSpeed(): string {
    return this.computeRequiredVerticalSpeed();
  }

  get requiredDescentAngle(): string {
    return this.computeRequiredAngle();
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

  private computeRequiredVerticalSpeed(): string {
    const angle = this.computeRequiredAngleNumber();
    const gs = parseFloat(this.profile.groundSpeed);
    if (angle === null || isNaN(gs)) return '-';
    const rad = (angle * Math.PI) / 180;
    return this.formatInt(gs * Math.sin(rad) * (6076.12 / 60));
  }

  private computeRequiredAngleNumber(): number | null {
    const delta =
      parseFloat(this.profile.currentAltitude) - parseFloat(this.profile.targetAltitude);
    const distance = parseFloat(this.profile.distance);
    const { currentAltitude, targetAltitude, distance: dist } = this.profile;
    if (currentAltitude === '' || targetAltitude === '' || dist === '') return null;
    if (isNaN(delta) || isNaN(distance) || delta <= 0 || distance <= 0) return null;
    return (Math.atan(delta / (distance * 6076.12)) * 180) / Math.PI;
  }

  private computeRequiredAngle(): string {
    const angle = this.computeRequiredAngleNumber();
    return angle === null ? '-' : this.format(angle);
  }

  onInput(event: Event, field: keyof this): void {
    (this as any)[field] = (event.target as HTMLInputElement).value;
  }

  onProfileInput(event: Event, field: keyof ProfileInputs): void {
    this.profile[field] = (event.target as HTMLInputElement).value;
  }

  private format(n: number): string {
    const abs = Math.abs(n);
    if (isNaN(n) || !isFinite(n)) return '0';
    if (abs !== 0 && abs < 0.01) return n.toExponential(2);
    return parseFloat(n.toFixed(1)).toString();
  }

  private formatInt(n: number): string {
    if (isNaN(n) || !isFinite(n)) return '0';
    return Math.round(n).toString();
  }
}

interface ProfileInputs {
  currentAltitude: string;
  targetAltitude: string;
  distance: string;
  groundSpeed: string;
}
