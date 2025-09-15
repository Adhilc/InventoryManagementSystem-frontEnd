import { Routes } from '@angular/router';
import { Supplier } from './supplier/supplier';

export const routes: Routes = [
  { path: 'suppliers', component: Supplier },
  { path: '', redirectTo: '/suppliers', pathMatch: 'full' }
];
