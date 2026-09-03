import { Routes } from '@angular/router';
import { AlphabetRadioComponent } from './alphabet-radio/alphabet-radio.component';
import { ConversionComponent } from './conversion/conversion.component';
import { DensityAltitudeComponent } from './density-altitude/density-altitude.component';
import { PlaceholderComponent } from './placeholder.component';
import { RemindersComponent } from './reminders/reminders.component';
import { TopOfDescentComponent } from './top-of-descent/top-of-descent.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'alphabet-radio' },
  { path: 'alphabet-radio', component: AlphabetRadioComponent },
  { path: 'conversion', component: ConversionComponent },
  { path: 'top-of-descent', component: TopOfDescentComponent, data: { title: 'Descent profile' } },
  { path: 'reminders', component: RemindersComponent },
  { path: 'density-altitude', component: DensityAltitudeComponent },
  { path: 'app3', component: PlaceholderComponent, data: { title: 'App 3' } },
  { path: '**', redirectTo: 'alphabet-radio' },
];
