import { Routes } from '@angular/router';
import { OrderComponent } from './order/order';
import { LoginComponent } from './login/login';
import { RegisterComponent } from './register/register';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'orders', component: OrderComponent },
  { path: '**', redirectTo: '/login' }
];
