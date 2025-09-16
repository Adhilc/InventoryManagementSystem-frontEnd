import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User, AuthRequest } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = '/auth';
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Check if user is already logged in on service initialization
    const token = localStorage.getItem('authToken');
    if (token) {
      const userInfo = this.decodeToken(token);
      this.currentUserSubject.next(userInfo);
    }
  }

  login(authRequest: AuthRequest): Observable<string> {
    return this.http
      .post(`${this.baseUrl}/login`, authRequest, { responseType: 'text' })
      .pipe(
        tap(token => {
          if (token) {
            localStorage.setItem('authToken', token);
            const userInfo = this.decodeToken(token);
            this.currentUserSubject.next(userInfo);
          }
        }),
        catchError(this.handleError)
      );
  }

 register(user: User): Observable<string> {
  return this.http
    .post(`${this.baseUrl}/register`, user, { responseType: 'text' })
    .pipe(catchError(this.handleError));
 }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      if (error.error && typeof error.error === 'string') {
        // Check if it's HTML error response
        if (error.error.includes('<html>') || error.error.includes('<!DOCTYPE')) {
          // Extract error message from HTML
          const match = error.error.match(/<pre>(.*?)<\/pre>/s);
          if (match) {
            errorMessage = match[1].trim();
          } else {
            errorMessage = 'Server routing error - Check if services are running';
          }
        } else {
          try {
            // Try to decode HTML entities and parse JSON
            const decodedError = error.error.replace(/&quot;/g, '"').replace(/&amp;/g, '&');
            const errorObj = JSON.parse(decodedError);
            errorMessage = errorObj.message || decodedError;
          } catch {
            errorMessage = error.error;
          }
        }
      } else if (error.error && typeof error.error === 'object' && error.error.message) {
        errorMessage = error.error.message;
      } else if (error.status === 0) {
        errorMessage = 'Unable to connect to server';
      } else if (error.status === 404) {
        errorMessage = 'API endpoint not found - Check if services are running';
      } else {
        errorMessage = `Server error: ${error.status} ${error.statusText}`;
      }
    }
    
    return throwError(() => errorMessage);
  }

  decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      const decodedPayload = atob(payload);
      return JSON.parse(decodedPayload);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  getCurrentUser(): any {
    return this.currentUserSubject.value;
  }

  getUserRole(): string {
    const user = this.getCurrentUser();
    return user?.role || 'USER';
  }

  isAdmin(): boolean {
    return this.getUserRole() === 'ADMIN';
  }

  isUser(): boolean {
    return this.getUserRole() === 'USER';
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('authToken');
    return !!token;
  }

  logout(): void {
    localStorage.removeItem('authToken');
    this.currentUserSubject.next(null);
  }
}