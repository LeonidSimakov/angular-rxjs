import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '1', loadComponent: () => import('./first/first.component').then(m => m.FirstComponent) },
  { path: '2', loadComponent: () => import('./second/second.component').then(m => m.SecondComponent) },
  { path: '3', loadComponent: () => import('./third/third.component').then(m => m.ThirdComponent) },
  { path: '4', loadComponent: () => import('./fourth/fourth.component').then(m => m.FourthComponent) },
  { path: '5', loadComponent: () => import('./fifth/fifth.component').then(m => m.FifthComponent) },
  { path: '**', redirectTo: '1' }
];
