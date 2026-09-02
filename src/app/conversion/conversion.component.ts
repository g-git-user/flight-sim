import { Component } from '@angular/core';
import { ThemeToggleComponent } from '../theme-toggle.component';

type Unit = 'NM' | 'km' | 'Feet' | 'Meters' | 'Knots' | 'km/h' | 'mph' | 'inHg' | 'hPa' | 'mmHg' | 'Kg' | 'Lb';

interface ConversionSection {
  title: string;
  units: Unit[];
  factor: Partial<Record<Unit, number>>;
  base: Unit;
  value: string;
  fromUnit: Unit;
}

@Component({
  selector: 'app-conversion',
  standalone: true,
  imports: [ThemeToggleComponent],
  templateUrl: './conversion.component.html',
  styleUrl: './conversion.component.css',
})
export class ConversionComponent {
  readonly sections: ConversionSection[] = [
    {
      title: 'Distance Conversion',
      units: ['NM', 'km', 'Feet', 'Meters'],
      factor: { NM: 1, km: 1.852, Feet: 6076.115, Meters: 1852 },
      base: 'NM',
      value: '1',
      fromUnit: 'NM',
    },
    {
      title: 'Speed Conversion',
      units: ['Knots', 'km/h', 'mph'],
      factor: { Knots: 1, 'km/h': 1.852, mph: 1.150779 },
      base: 'Knots',
      value: '100',
      fromUnit: 'Knots',
    },
    {
      title: 'Pressure Conversion',
      units: ['inHg', 'hPa', 'mmHg'],
      factor: { inHg: 1, hPa: 33.86389, mmHg: 25.4 },
      base: 'inHg',
      value: '30',
      fromUnit: 'inHg',
    },
    {
      title: 'Weight Conversion',
      units: ['Kg', 'Lb'],
      factor: { Kg: 1, Lb: 2.204623 },
      base: 'Kg',
      value: '1',
      fromUnit: 'Kg',
    },
  ];

  onInput(event: Event, section: ConversionSection): void {
    section.value = (event.target as HTMLInputElement).value;
  }

  resultFor(section: ConversionSection, unit: Unit): string {
    const input = parseFloat(section.value);
    if (isNaN(input)) return '0';
    const factor = (section.factor[unit] ?? 1) / (section.factor[section.fromUnit] ?? 1);
    return this.format(input * factor);
  }

  private format(n: number): string {
    const abs = Math.abs(n);
    if (abs !== 0 && abs < 0.001) return n.toExponential(3);
    const trimmed = parseFloat(n.toFixed(3));
    const [int, dec] = trimmed.toString().split('.');
    const intWithSpaces = int.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return dec ? `${intWithSpaces}.${dec}` : intWithSpaces;
  }
}
