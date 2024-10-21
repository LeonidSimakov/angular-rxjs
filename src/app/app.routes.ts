import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '1', loadComponent: () => import('./intro/intro.component').then(m => m.IntroComponent) },
  { path: '2', loadComponent: () => import('./unsubscribe/unsubscribe.component').then(m => m.UnsubscribeComponent) },
  { path: '3', loadComponent: () => import('./improved-input/improved-input.component').then(m => m.ImprovedInputComponent) },
  { path: '4', loadComponent: () => import('./high-order-observable/high-order-observable.component').then(m => m.HighOrderObservableComponent) },
  { path: '5', loadComponent: () => import('./multicast/multicast.component').then(m => m.MulticastComponent) },
  { path: '6', loadComponent: () => import('./query-subject-demo/query-subject-demo.component').then(m => m.QuerySubjectDemoComponent) },
  { path: '**', redirectTo: '1' }
];
