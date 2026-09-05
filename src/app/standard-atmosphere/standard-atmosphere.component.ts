import { Component } from '@angular/core';
import { ThemeToggleComponent } from '../theme-toggle.component';

type InputMode = 'temperature' | 'offset';
type AltUnit = 'ft' | 'm';
type TempUnit = 'C' | 'F';
type PressureUnit = 'hPa' | 'inHg';
type SpeedUnit = 'ms' | 'fts' | 'kmh' | 'mph' | 'kt';

// 1976 U.S. Standard Atmosphere layer parameters
const LAYERS = [
  { hb: 0, Lb: -0.0065, Tb: 288.15, Pb: 101325 },
  { hb: 11000, Lb: 0, Tb: 216.65, Pb: 22632.1 },
  { hb: 20000, Lb: 0.001, Tb: 216.65, Pb: 5474.89 },
  { hb: 32000, Lb: 0.0028, Tb: 228.65, Pb: 868.019 },
  { hb: 47000, Lb: 0, Tb: 270.65, Pb: 110.906 },
  { hb: 51000, Lb: -0.0028, Tb: 270.65, Pb: 66.9389 },
  { hb: 71000, Lb: -0.002, Tb: 214.65, Pb: 3.95642 },
  { hb: 84852, Lb: 0, Tb: 186.87, Pb: 0.37338 },
];

const G0 = 9.80665;
const R = 287.05287;
const GAMMA = 1.4;
const R_VISC = 1.458e-6;
const S_VISC = 110.4;

@Component({
  selector: 'app-standard-atmosphere',
  standalone: true,
  imports: [ThemeToggleComponent],
  templateUrl: './standard-atmosphere.component.html',
  styleUrl: './standard-atmosphere.component.css',
})
export class StandardAtmosphereComponent {
  mode: InputMode = 'temperature';
  altitude = '1000';
  altUnit: AltUnit = 'ft';
  temperature = '20';
  tempUnit: TempUnit = 'C';
  offset = '0';
  offsetUnit: TempUnit = 'C';

  tempResultUnit: TempUnit = 'C';
  altResultUnit: AltUnit = 'ft';
  pressResultUnit: PressureUnit = 'hPa';
  speedUnit: SpeedUnit = 'ms';

  get temperatureC(): string {
    const t = this.computeTemperatureC();
    if (t === null) return '-';
    return this.tempResultUnit === 'C' ? t.toFixed(1) : this.celsiusToFahrenheit(t).toFixed(1);
  }

  get densityAltitude(): string {
    const da = this.computeDensityAltitudeFt();
    if (da === null) return '-';
    return this.altResultUnit === 'ft' ? Math.round(da).toString() : Math.round(da * 0.3048).toString();
  }

  get pressure(): string {
    const p = this.computePressureHpa();
    if (p === null) return '-';
    return this.pressResultUnit === 'hPa' ? p.toFixed(1) : (p / 33.86388).toFixed(2);
  }

  get airDensity(): string {
    const d = this.computeAirDensity();
    if (d === null) return '-';
    return d.toFixed(4);
  }

  get relativeDensity(): string {
    const d = this.computeRelativeDensity();
    if (d === null) return '-';
    return d.toFixed(4);
  }

  get speedOfSound(): string {
    const v = this.computeSpeedOfSound();
    if (v === null) return '-';
    return this.convertSpeed(v).toFixed(1);
  }

  get viscosity(): string {
    const v = this.computeViscosity();
    if (v === null) return '-';
    return v.toExponential(4);
  }

  get isaTemperatureLabel(): string {
    const t = this.computeIsaTemperatureC();
    if (t === null) return '';
    const value = this.tempResultUnit === 'C' ? t.toFixed(1) : this.celsiusToFahrenheit(t).toFixed(1);
    const unit = this.tempResultUnit === 'C' ? '°C' : '°F';
    return `ISA: ${value}${unit}`;
  }

  onInput(event: Event, field: 'altitude' | 'temperature' | 'offset'): void {
    this[field] = (event.target as HTMLInputElement).value;
  }

  onModeChange(mode: InputMode): void {
    if (mode === this.mode) return;
    if (mode === 'offset') {
      const t = this.computeIsaTemperatureC();
      if (t !== null) {
        this.offset = t.toFixed(1);
      }
    }
    this.mode = mode;
  }

  onAltUnitChange(unit: AltUnit): void {
    if (unit === this.altUnit) return;
    const value = parseFloat(this.altitude);
    if (this.altitude === '' || isNaN(value)) {
      this.altUnit = unit;
      return;
    }
    this.altitude = (unit === 'ft' ? value / 0.3048 : value * 0.3048).toFixed(0);
    this.altUnit = unit;
  }

  onTempUnitChange(unit: TempUnit): void {
    if (unit === this.tempUnit) return;
    const value = parseFloat(this.temperature);
    if (this.temperature !== '' && !isNaN(value)) {
      this.temperature = (unit === 'C' ? this.fahrenheitToCelsius(value) : this.celsiusToFahrenheit(value)).toFixed(1);
    }
    this.tempUnit = unit;
  }

  onOffsetUnitChange(unit: TempUnit): void {
    if (unit === this.offsetUnit) return;
    const value = parseFloat(this.offset);
    if (this.offset !== '' && !isNaN(value)) {
      this.offset = (unit === 'C' ? this.fahrenheitToCelsius(value) : this.celsiusToFahrenheit(value)).toFixed(1);
    }
    this.offsetUnit = unit;
  }

  onTempResultUnitChange(unit: TempUnit): void {
    this.tempResultUnit = unit;
  }

  onAltResultUnitChange(unit: AltUnit): void {
    this.altResultUnit = unit;
  }

  onPressResultUnitChange(unit: PressureUnit): void {
    this.pressResultUnit = unit;
  }

  onSpeedUnitChange(unit: SpeedUnit): void {
    this.speedUnit = unit;
  }

  private getAltitudeM(): number | null {
    const n = parseFloat(this.altitude);
    if (this.altitude === '' || isNaN(n)) return null;
    return this.altUnit === 'ft' ? n * 0.3048 : n;
  }

  private getTemperatureC(): number | null {
    const n = parseFloat(this.temperature);
    if (this.temperature === '' || isNaN(n)) return null;
    return this.tempUnit === 'C' ? n : this.fahrenheitToCelsius(n);
  }

  private getOffsetC(): number | null {
    const n = parseFloat(this.offset);
    if (this.offset === '' || isNaN(n)) return null;
    return this.offsetUnit === 'C' ? n : this.fahrenheitToCelsius(n);
  }

  private computeTemperatureC(): number | null {
    const isa = this.computeIsaTemperatureC();
    if (isa === null) return null;
    if (this.mode === 'temperature') {
      const t = this.getTemperatureC();
      return t !== null ? t : isa;
    }
    const offset = this.getOffsetC();
    if (offset === null) return isa;
    return isa + offset;
  }

  private computeIsaTemperatureC(): number | null {
    const hM = this.getAltitudeM();
    if (hM === null) return null;
    return this.isaTemperature(hM) - 273.15;
  }

  private isaTemperature(hM: number): number {
    for (const layer of LAYERS) {
      if (hM <= layer.hb + 20000) {
        return layer.Lb === 0
          ? layer.Tb
          : layer.Tb + layer.Lb * (hM - layer.hb);
      }
    }
    return LAYERS[LAYERS.length - 1].Tb;
  }

  private computePressureHpa(): number | null {
    const hM = this.getAltitudeM();
    if (hM === null) return null;
    return this.isaPressure(hM) / 100;
  }

  private isaPressure(hM: number): number {
    for (const layer of LAYERS) {
      if (hM <= layer.hb + 20000) {
        if (layer.Lb === 0) {
          return layer.Pb * Math.exp((-G0 * (hM - layer.hb)) / (R * layer.Tb));
        }
        const T = layer.Tb + layer.Lb * (hM - layer.hb);
        return layer.Pb * Math.pow(T / layer.Tb, -G0 / (layer.Lb * R));
      }
    }
    const last = LAYERS[LAYERS.length - 1];
    return last.Pb * Math.exp((-G0 * (hM - last.hb)) / (R * last.Tb));
  }

  private computeAirDensity(): number | null {
    const t = this.computeTemperatureC();
    const p = this.computePressureHpa();
    if (t === null || p === null) return null;
    return (p * 100) / (R * (t + 273.15));
  }

  private computeRelativeDensity(): number | null {
    const d = this.computeAirDensity();
    return d !== null ? d / 1.225 : null;
  }

  private computeSpeedOfSound(): number | null {
    const t = this.computeTemperatureC();
    if (t === null) return null;
    return Math.sqrt(GAMMA * R * (t + 273.15));
  }

  private computeViscosity(): number | null {
    const t = this.computeTemperatureC();
    if (t === null) return null;
    const tK = t + 273.15;
    return (R_VISC * Math.pow(tK, 1.5)) / (tK + S_VISC);
  }

  private computeDensityAltitudeFt(): number | null {
    const d = this.computeAirDensity();
    if (d === null) return null;
    return 44330.8 * (1 - Math.pow(d / 1.225, 0.234969)) * 3.28084;
  }

  private convertSpeed(ms: number): number {
    switch (this.speedUnit) {
      case 'ms': return ms;
      case 'fts': return ms * 3.28084;
      case 'kmh': return ms * 3.6;
      case 'mph': return ms * 2.23694;
      case 'kt': return ms * 1.94384;
    }
  }

  private celsiusToFahrenheit(c: number): number {
    return (c * 9) / 5 + 32;
  }

  private fahrenheitToCelsius(f: number): number {
    return ((f - 32) * 5) / 9;
  }
}
