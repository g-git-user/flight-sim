import { Component, ElementRef, ViewChild } from '@angular/core';
import { ThemeToggleComponent } from '../theme-toggle.component';

type Unit = 'NM' | 'km' | 'ft' | 'm' | 'FL' | 'kt' | 'km/h' | 'mph' | 'inHg' | 'hPa' | 'mmHg' | 'kg' | 'lb' | 'gal' | 'L';

interface FuelType {
  name: string;
  factor: Partial<Record<Unit, number>>;
}

interface ConversionSection {
  title: string;
  units: Unit[];
  factor: Partial<Record<Unit, number>>;
  base: Unit;
  value: string;
  fromUnit: Unit;
  fuelTypes?: FuelType[];
  activeFuel?: string;
}

@Component({
  selector: 'app-conversion',
  standalone: true,
  imports: [ThemeToggleComponent],
  templateUrl: './conversion.component.html',
  styleUrl: './conversion.component.css',
})
export class ConversionComponent {
  @ViewChild('fuelIcon') fuelIcon: ElementRef<SVGElement> | undefined;

  readonly sections: ConversionSection[] = [
    {
      title: 'Distance Conversion',
      units: ['NM', 'km'],
      factor: { NM: 1, km: 1.852 },
      base: 'NM',
      value: '1',
      fromUnit: 'NM',
    },
    {
      title: 'Altitude Conversion',
      units: ['ft', 'm', 'FL'],
      factor: { ft: 1, m: 0.3048, FL: 0.01 },
      base: 'ft',
      value: '1000',
      fromUnit: 'ft',
    },
    {
      title: 'Speed Conversion',
      units: ['kt', 'km/h', 'mph'],
      factor: { kt: 1, 'km/h': 1.852, mph: 1.150779 },
      base: 'kt',
      value: '100',
      fromUnit: 'kt',
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
      units: ['kg', 'lb'],
      factor: { kg: 1, lb: 2.204623 },
      base: 'kg',
      value: '1',
      fromUnit: 'kg',
    },
    {
      title: 'Fuel Conversion',
      units: ['gal', 'lb', 'kg', 'L'],
      factor: { gal: 1, lb: 6.0, kg: 2.72155, L: 3.78541 },
      fuelTypes: [
        { name: 'AVGAS', factor: { gal: 1, lb: 6.0, kg: 2.72155, L: 3.78541 } },
        { name: 'Jet A-1', factor: { gal: 1, lb: 6.76, kg: 3.066, L: 3.78541 } },
      ],
      activeFuel: 'AVGAS',
      base: 'gal',
      value: '1',
      fromUnit: 'gal',
    },
  ];

  onInput(event: Event, section: ConversionSection): void {
    section.value = (event.target as HTMLInputElement).value;
  }

  toggleFuel(section: ConversionSection): void {
    if (!section.fuelTypes?.length) return;
    const current = section.fuelTypes.findIndex((f) => f.name === section.activeFuel);
    const next = (current + 1) % section.fuelTypes.length;
    section.activeFuel = section.fuelTypes[next]?.name;

    const el = this.fuelIcon?.nativeElement;
    if (el) {
      el.classList.remove('fuel-spin');
      el.getBoundingClientRect();
      el.classList.add('fuel-spin');
    }
  }

  onFromUnitChange(event: Event, section: ConversionSection): void {
    section.fromUnit = (event.target as HTMLSelectElement).value as Unit;
  }

  factorOf(section: ConversionSection): Partial<Record<Unit, number>> {
    const fuel = section.fuelTypes?.find((f) => f.name === section.activeFuel);
    return fuel?.factor ?? section.factor;
  }

  resultFor(section: ConversionSection, unit: Unit): string {
    const input = parseFloat(section.value);
    if (isNaN(input)) return '0';
    const factor = this.factorOf(section);
    const value = (factor[unit] ?? 1) / (factor[section.fromUnit] ?? 1);
    return this.format(input * value);
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
