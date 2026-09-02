import { Component } from '@angular/core';

type Unit = 'NM' | 'km' | 'Feet' | 'Meters' | 'Knots' | 'km/h' | 'mph' | 'inHg' | 'hPa' | 'Kg' | 'Lb';

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
  imports: [],
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
      value: '0',
      fromUnit: 'NM',
    },
    {
      title: 'Speed Conversion',
      units: ['Knots', 'km/h', 'mph'],
      factor: { Knots: 1, 'km/h': 1.852, mph: 1.150779 },
      base: 'Knots',
      value: '0',
      fromUnit: 'Knots',
    },
    {
      title: 'Pressure Conversion',
      units: ['inHg', 'hPa'],
      factor: { inHg: 1, hPa: 33.86389 },
      base: 'inHg',
      value: '0',
      fromUnit: 'inHg',
    },
    {
      title: 'Weight Conversion',
      units: ['Kg', 'Lb'],
      factor: { Kg: 1, Lb: 2.204623 },
      base: 'Kg',
      value: '0',
      fromUnit: 'Kg',
    },
  ];

  onInput(event: Event, section: ConversionSection): void {
    section.value = (event.target as HTMLInputElement).value;
  }

  resultFor(section: ConversionSection, unit: Unit): string {
    const input = parseFloat(section.value);
    if (isNaN(input)) return '0';
    const factor = (section.factor[section.fromUnit] ?? 1) / (section.factor[unit] ?? 1);
    return this.format(input * factor);
  }

  private format(n: number): string {
    const abs = Math.abs(n);
    if (abs !== 0 && abs < 0.001) return n.toExponential(3);
    if (abs >= 10000) return n.toLocaleString('en-US', { maximumFractionDigits: 0 });
    return n.toLocaleString('en-US', { maximumFractionDigits: 4 });
  }
}
