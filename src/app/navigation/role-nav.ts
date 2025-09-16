import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AdminNavComponent } from './admin-nav';
import { UserNavComponent } from './user-nav';

@Component({
  selector: 'app-role-nav',
  standalone: true,
  imports: [CommonModule, AdminNavComponent, UserNavComponent],
  template: `
    <div *ngIf="isLoggedIn">
      <app-admin-nav *ngIf="isAdmin"></app-admin-nav>
      <app-user-nav *ngIf="isUser"></app-user-nav>
    </div>
    <div *ngIf="!isLoggedIn" class="alert alert-info m-3">
      <i class="fas fa-info-circle me-2"></i>
      Please log in to access the system.
      <button class="btn btn-primary btn-sm ms-2" (click)="goToLogin()">
        <i class="fas fa-sign-in-alt me-1"></i>Login
      </button>
    </div>
  `
})
export class RoleNavComponent implements OnInit {
  isLoggedIn = false;
  isAdmin = false;
  isUser = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.isLoggedIn = this.authService.isLoggedIn();
      this.isAdmin = this.authService.isAdmin();
      this.isUser = this.authService.isUser();
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}