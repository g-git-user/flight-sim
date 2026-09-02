import { Routes } from '@angular/router';
import { AlphabetRadioComponent } from './alphabet-radio/alphabet-radio.component';
import { ConversionComponent } from './conversion/conversion.component';
import { PlaceholderComponent } from './placeholder.component';
import { TopOfDescentComponent } from './top-of-descent/top-of-descent.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'alphabet-radio' },
  { path: 'alphabet-radio', component: AlphabetRadioComponent },
  { path: 'conversion', component: ConversionComponent },
  { path: 'top-of-descent', component: TopOfDescentComponent, data: { title: 'Top of Descent' } },
  { path: 'app1', component: PlaceholderComponent, data: { title: 'App 1' } },
  { path: 'app2', component: PlaceholderComponent, data: { title: 'App 2' } },
  { path: 'app3', component: PlaceholderComponent, data: { title: 'App 3' } },
  { path: '**', redirectTo: 'alphabet-radio' },
];
