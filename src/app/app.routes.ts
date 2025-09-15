import { Routes } from '@angular/router';
import { OrderComponent } from './order/order';
import { LoginComponent } from './login/login';
import { RegisterComponent } from './register/register';
import { Supplier } from './supplier/supplier';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'orders', component: OrderComponent },
  { path: 'supplier', component: Supplier },
  { path: '**', redirectTo: '/login' }
];
