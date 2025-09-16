import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AuthRequest } from '../models/auth.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  authRequest: AuthRequest = { username: '', password: '' };
  message: string = '';
  isLoading: boolean = false;
  showPassword: boolean = false;
  currentYear: number = new Date().getFullYear();

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    if (!this.authRequest.username.trim() || !this.authRequest.password.trim()) {
      this.message = 'Please enter both username and password';
      return;
    }

    this.clearMessage();
    this.isLoading = true;

    this.authService.login(this.authRequest).subscribe({
      next: (token: string) => {
        this.message = 'Login successful! Redirecting...';
        setTimeout(() => {
          // Redirect based on user role
          const userRole = this.authService.getUserRole();
          if (userRole === 'ADMIN') {
            this.router.navigate(['/dashboard']);
          } else {
            this.router.navigate(['/products']);
          }
        }, 1500);
      },
      error: (error: any) => {
        let errorMessage = 'Login failed. Please try again.';
        
        if (typeof error === 'string') {
          errorMessage = error;
        } else if (error?.error?.message) {
          errorMessage = error.error.message;
        } else if (error?.message) {
          errorMessage = error.message;
        } else if (error?.error) {
          errorMessage = typeof error.error === 'string' ? error.error : 'Authentication failed';
        }
        
        // More specific error messages for common issues
        if (error?.status === 401) {
          errorMessage = 'Invalid username or password';
        } else if (error?.status === 0) {
          errorMessage = 'Unable to connect to the server. Please check your internet connection.';
        } else if (error?.status >= 500) {
          errorMessage = 'Server error. Please try again later.';
        }
        
        this.message = errorMessage;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }

  clearMessage() {
    this.message = '';
  }
}
