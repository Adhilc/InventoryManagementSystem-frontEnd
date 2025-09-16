import { Routes } from '@angular/router';
import { OrderComponent } from './order/order';
import { LoginComponent } from './login/login';
import { RegisterComponent } from './register/register';
import { Supplier } from './supplier/supplier';
import { Stockmanagement } from './stockmanagement/stockmanagement';
import { Products } from './products/products';
import { Dashboard } from './dashboard/dashboard';
import { authGuard, adminGuard, userGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'orders', component: OrderComponent, canActivate: [userGuard] },
  { path: 'supplier', component: Supplier, canActivate: [adminGuard] },
  { path: 'stockmanagement', component: Stockmanagement, canActivate: [adminGuard] },
  { path: 'products', component: Products, canActivate: [userGuard] },
  { path: 'dashboard', component: Dashboard, canActivate: [userGuard] },
  { path: '**', redirectTo: '/login' },
];
