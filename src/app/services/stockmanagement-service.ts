// Import Injectable decorator to make this class available for DI
import { Injectable } from '@angular/core';
// Import HttpClient for making HTTP calls and HttpErrorResponse for error typing
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
// Import Observable for async streams and throwError to rethrow errors
import { Observable, throwError } from 'rxjs';
// Import catchError operator to handle errors in observables
import { catchError } from 'rxjs/operators';
 
// Define the Stock model returned by backend
export interface Stock {
  // Unique product identifier
  productID: number;
  // Product name
  name: string;
  // Current quantity in stock
  quantity: number;
  // Threshold for low stock alerts
  reorderLevel: number;
}
 
// Define a DTO for creating/saving stock entries
export interface StockDTO {
  // Unique product identifier
  productID: number;
  // Product name
  name: string;
  // Quantity to set or save
  quantity: number;
}
 
// Mark this service as injectable and provided in the root injector
@Injectable({
  // Provide this service at the application root scope
  providedIn: 'root'
})
export class StockmanagementService {
  // Base URL for the stock API endpoints
  private baseUrl = 'http://localhost:1016/api/stock';
 
  // Inject HttpClient to perform HTTP operations
  constructor(private http: HttpClient) {}
 
  // Fetch stock information for a specific product ID
  getStockByProductId(productId: number): Observable<Stock> {
    const url = `${this.baseUrl}/${productId}`;
    console.log('Service: Calling API:', url);
    console.log('Service: Making GET request to:', url);
    // Perform GET request and attach error handler
    return this.http.get<Stock>(url).pipe(
      // Normalize and propagate errors via catchError
      catchError((error) => {
        console.error('Service: HTTP Error occurred:', error);
        return this.handleError(error);
      })
    );
  }
 
  // Increase stock for a product by a specified amount
  increaseStock(productId: number, amount: number): Observable<Stock> {
    // Log the outgoing request for debugging
    console.log('Calling API:', `${this.baseUrl}/${productId}/increase`, { amount });
    // Perform PUT request with body and attach error handler
    return this.http.put<Stock>(`${this.baseUrl}/${productId}/increase`, { amount }).pipe(
      // Normalize and propagate errors via catchError
      catchError((error) => this.handleError(error))
    );
  }
 
  // Decrease stock for a product by a specified amount
  decreaseStock(productId: number, amount: number): Observable<Stock> {
    // Log the outgoing request for debugging
    console.log('Calling API:', `${this.baseUrl}/${productId}/decrease`, { amount });
    // Perform PUT request with body and attach error handler
    return this.http.put<Stock>(`${this.baseUrl}/${productId}/decrease`, { amount }).pipe(
      // Normalize and propagate errors via catchError
      catchError((error) => this.handleError(error))
    );
  }
 
  // Retrieve a list of items that are low in stock
  getLowStockReport(): Observable<Stock[]> {
    const url = `${this.baseUrl}/low-stock-report`;
    console.log('Service: Calling low stock API:', url);
    console.log('Service: Making GET request to:', url);
    // Perform GET request and attach error handler
    return this.http.get<Stock[]>(url).pipe(
      // Normalize and propagate errors via catchError
      catchError((error) => {
        console.error('Service: Low stock HTTP Error:', error);
        return this.handleError(error);
      })
    );
  }
 
  // Save a stock record using the provided DTO
  saveStock(stockDto: StockDTO): Observable<string> {
    // Perform POST request with body and attach error handler
    return this.http.post<string>(`${this.baseUrl}/save`, stockDto).pipe(
      // Normalize and propagate errors via catchError
      catchError((error) => this.handleError(error))
    );
  }
 
  // Centralized error normalization for all HTTP calls
  private handleError(error: HttpErrorResponse) {
    console.error('=== DETAILED ERROR DEBUG ===');
    console.error('Error object:', error);
    console.error('Error status:', error?.status);
    console.error('Error statusText:', error?.statusText);
    console.error('Error url:', error?.url);
    console.error('Error message:', error?.message);
    console.error('Error error:', error?.error);
    console.error('Error type:', error?.type);
    console.error('Error name:', error?.name);
    console.error('=== END ERROR DEBUG ===');
 
    const status = error?.status;
    const backend = error?.error;
 
    let message = 'Request failed';
    // Check for specific error types
    if (status === 0) {
      message = 'Cannot connect to server. Check if backend is running on port 1016';
    } else if (status === 404) {
      message = 'API endpoint not found';
    } else if (status === 500) {
      message = 'Server error';
    } else if (typeof backend === 'string' && backend.trim().length > 0) {
      message = backend;
    } else if (backend && typeof backend === 'object') {
      if (typeof backend.message === 'string' && backend.message.trim().length > 0) {
        message = backend.message;
      } else if (typeof backend.error === 'string' && backend.error.trim().length > 0) {
        message = backend.error;
      } else if (typeof backend.detail === 'string' && backend.detail.trim().length > 0) {
        message = backend.detail;
      }
    } else if (typeof error?.message === 'string' && error.message.trim().length > 0) {
      message = error.message;
    }
 
    return throwError(() => ({ status, message, error: backend ?? error }));
  }
}