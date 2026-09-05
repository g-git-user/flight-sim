import { Component } from '@angular/core';
import { ThemeToggleComponent } from '../theme-toggle.component';

type AltUnit = 'ft' | 'm';
type TempUnit = 'C' | 'F';
type QnhUnit = 'hPa' | 'inHg';
@Component({
  selector: 'app-density-altitude',
  standalone: true,
  imports: [ThemeToggleComponent],
  templateUrl: './density-altitude.component.html',
  styleUrl: './density-altitude.component.css',
})
export class DensityAltitudeComponent {
  altitude = '2000';
  altUnit: AltUnit = 'ft';
  temperature = '20';
  tempUnit: TempUnit = 'C';
  dewPoint = '5';
  dewPointUnit: TempUnit = 'C';
  dryAir = false;
  qnh = '1013';
  qnhUnit: QnhUnit = 'hPa';
  paUnit: AltUnit = 'ft';
  daUnit: AltUnit = 'ft';

  get pressureAltitude(): string {
    const pa = this.computePressureAltitudeFt();
    if (pa === null) return '-';
    return this.formatAlt(this.toResultUnit(pa, this.paUnit));
  }

  get densityAltitude(): string {
    const da = this.computeDensityAltitudeFt();
    if (da === null) return '-';
    return this.formatAlt(this.toResultUnit(da, this.daUnit));
  }

  get airDensity(): string {
    const density = this.computeAirDensity();
    if (density === null) return '-';
    return density.toFixed(3);
  }

  onInput(event: Event, field: 'altitude' | 'temperature' | 'dewPoint' | 'qnh'): void {
    this[field] = (event.target as HTMLInputElement).value;
  }

  onDryAirChange(event: Event): void {
    this.dryAir = (event.target as HTMLInputElement).checked;
  }

  onQnhUnitChange(unit: QnhUnit): void {
    if (unit === this.qnhUnit) return;
    const value = parseFloat(this.qnh);
    if (this.qnh === '' || isNaN(value)) {
      this.qnhUnit = unit;
      return;
    }
    const inHg = this.qnhUnit === 'hPa' ? value / 33.86388 : value;
    this.qnh = (unit === 'hPa' ? inHg * 33.86388 : inHg).toFixed(2);
    this.qnhUnit = unit;
  }

  onTempUnitChange(unit: TempUnit): void {
    this.convertTemp('temperature', this.tempUnit, unit);
    this.tempUnit = unit;
  }

  onDewPointUnitChange(unit: TempUnit): void {
    this.convertTemp('dewPoint', this.dewPointUnit, unit);
    this.dewPointUnit = unit;
  }

  private convertTemp(field: 'temperature' | 'dewPoint', from: TempUnit, to: TempUnit): void {
    if (to === from) return;
    const value = parseFloat(this[field]);
    if (this[field] === '' || isNaN(value)) return;
    const c = from === 'C' ? value : ((value - 32) * 5) / 9;
    this[field] = (to === 'C' ? c : (c * 9) / 5 + 32).toFixed(2);
  }

  private computePressureAltitudeFt(): number | null {
    const hFt = this.altitudeToFt(this.altitude);
    const qnhHpa = this.qnhToHpa(this.qnh);
    if (this.altitude === '' || this.qnh === '') return null;
    if (isNaN(hFt) || isNaN(qnhHpa)) return null;
    return hFt + 145366.45 * (1 - Math.pow(qnhHpa / 1013.25, 0.190284));
  }

  private computeDensityAltitudeFt(): number | null {
    const density = this.computeAirDensity();
    if (density === null) return null;
    return 44330.8 * (1 - Math.pow(density / 1.225, 0.234969)) * 3.28084;
  }

  private computeAirDensity(): number | null {
    if (this.temperature === '' || this.altitude === '' || this.qnh === '') return null;
    const tC = this.tempToC(this.temperature, this.tempUnit);
    const hM = this.altitudeToFt(this.altitude) * 0.3048;
    const qnhHpa = this.qnhToHpa(this.qnh);
    if (isNaN(tC) || isNaN(hM) || isNaN(qnhHpa)) return null;

    const paHpa = Math.pow(
      Math.pow(qnhHpa, 0.190263) - 8.417286e-5 * hM,
      1 / 0.190263
    );

    let pvHpa = 0;
    if (!this.dryAir) {
      if (this.dewPoint === '') return null;
      const tdpC = this.tempToC(this.dewPoint, this.dewPointUnit);
      if (isNaN(tdpC)) return null;
      pvHpa = 6.1078 * Math.pow(10, (7.5 * tdpC) / (237.3 + tdpC));
    }

    const pdHpa = paHpa - pvHpa;
    const tK = tC + 273.15;
    return (pdHpa * 100) / (287.058 * tK) + (pvHpa * 100) / (461.495 * tK);
  }

  private altitudeToFt(v: string): number {
    const n = parseFloat(v);
    if (isNaN(n)) return NaN;
    return this.altUnit === 'ft' ? n : n / 0.3048;
  }

  private tempToC(v: string, unit: TempUnit): number {
    const n = parseFloat(v);
    if (isNaN(n)) return NaN;
    return unit === 'C' ? n : ((n - 32) * 5) / 9;
  }

  private qnhToHpa(v: string): number {
    const n = parseFloat(v);
    if (isNaN(n)) return NaN;
    return this.qnhUnit === 'hPa' ? n : n * 33.86388;
  }

  private toResultUnit(ft: number, unit: AltUnit): number {
    return unit === 'ft' ? ft : ft * 0.3048;
  }

  private formatAlt(n: number): string {
    return Math.round(n).toString();
  }
}
