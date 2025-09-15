import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User, AuthRequest } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = '/auth';

  constructor(private http: HttpClient) { }

  login(authRequest: AuthRequest): Observable<string> {
  return this.http
    .post(`${this.baseUrl}/login`, authRequest, { responseType: 'text' })
    .pipe(catchError(this.handleError));
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
}