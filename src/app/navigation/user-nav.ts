import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-user-nav',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">
          <i class="fas fa-shopping-bag me-2"></i>
          IMS User Portal
        </a>
        
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <a class="nav-link" (click)="navigate('/products')" style="cursor: pointer;">
                <i class="fas fa-box me-1"></i>View Products
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" (click)="navigate('/orders')" style="cursor: pointer;">
                <i class="fas fa-shopping-cart me-1"></i>My Orders
              </a>
            </li>
          </ul>
          
          <ul class="navbar-nav">
            <li class="nav-item">
              <span class="nav-link">
                <i class="fas fa-user me-1"></i>User
              </span>
            </li>
            <li class="nav-item">
              <button class="btn btn-outline-light btn-sm" (click)="logout()">
                <i class="fas fa-sign-out-alt me-1"></i>Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar-brand {
      font-weight: bold;
    }
    .nav-link {
      transition: color 0.3s ease;
    }
    .nav-link:hover {
      color: #ffc107 !important;
    }
    .btn-outline-light {
      margin-left: 10px;
      transition: all 0.3s ease;
    }
    .btn-outline-light:hover {
      background-color: #dc3545;
      border-color: #dc3545;
      color: white;
    }
  `]
})
export class UserNavComponent {
  constructor(private router: Router, private authService: AuthService) {}

  navigate(route: string) {
    this.router.navigate([route]);
  }

  logout() {
    // Clear all localStorage data
    localStorage.clear();
    // Use auth service logout
    this.authService.logout();
    // Navigate to login
    this.router.navigate(['/login']);
  }
}