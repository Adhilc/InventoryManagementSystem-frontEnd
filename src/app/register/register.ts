import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { User } from '../models/auth.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {
  user: User = { username: '', password: '', role: 'USER' };
  confirmPassword: string = '';
  message: string = '';
  isLoading: boolean = false;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  passwordStrength: string = '';
  currentYear: number = new Date().getFullYear();

  constructor(private authService: AuthService, private router: Router) {}

  register() {
    if (!this.validateForm()) {
      return;
    }

    this.clearMessage();
    this.isLoading = true;

    this.authService.register(this.user).subscribe({
      next: (response: string) => {
        this.message = response || 'Registration successful! Redirecting to login...';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
        this.isLoading = false;
      },
      error: (error: any) => {
        this.message = typeof error === 'string' ? error : (error.message || error.error || 'Registration failed');
        this.isLoading = false;
      }
    });
  }

  validateForm(): boolean {
    if (!this.user.username.trim()) {
      this.message = 'Username is required';
      return false;
    }

    if (this.user.username.length < 3) {
      this.message = 'Username must be at least 3 characters long';
      return false;
    }

    if (!this.user.password.trim()) {
      this.message = 'Password is required';
      return false;
    }

    if (this.user.password.length < 6) {
      this.message = 'Password must be at least 6 characters long';
      return false;
    }

    if (this.user.password !== this.confirmPassword) {
      this.message = 'Passwords do not match';
      return false;
    }

    return true;
  }

  checkPasswordStrength(): void {
    const password = this.user.password;
    if (!password) {
      this.passwordStrength = '';
      return;
    }

    // Check for password strength
    const hasLetters = /[a-zA-Z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    if (password.length < 6) {
      this.passwordStrength = 'weak';
    } else if (hasLetters && hasNumbers && hasSpecialChars && password.length >= 10) {
      this.passwordStrength = 'strong';
    } else if ((hasLetters && hasNumbers) || (hasLetters && hasSpecialChars) || (hasNumbers && hasSpecialChars)) {
      this.passwordStrength = 'medium';
    } else {
      this.passwordStrength = 'weak';
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  clearMessage() {
    this.message = '';
  }
}
