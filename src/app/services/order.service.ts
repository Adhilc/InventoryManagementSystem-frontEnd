// src/app/services/order.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Order, Product, OrderReport, OrderReportSent } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  // Using proxy configuration
  private baseUrl = 'http://localhost:1016/api/order';

  constructor(private http: HttpClient) { }

  createOrder(product: Product): Observable<string> {
    console.log('Making request to:', `${this.baseUrl}/save`);
    console.log('Product data:', product);
    console.log('Auth token:', localStorage.getItem('authToken'));
    
    return this.http.post(`${this.baseUrl}/save`, product, { responseType: 'text' })
      .pipe(catchError(this.handleError));
  }

  getOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.baseUrl}/getByOrderId/${id}`)
      .pipe(catchError(this.handleError));
  }

  getOrdersByCustomerId(customerId: number): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}/getByCustomerId/${customerId}`)
      .pipe(catchError(this.handleError));
  }

  updateOrderStatus(orderId: number, status: string): Observable<string> {
  return this.http.post(`${this.baseUrl}/updateStatus/${orderId}/${status}`, {}, { responseType: 'text' })
    .pipe(catchError(this.handleError));
  }

  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}/getAll`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    console.error('HTTP Error:', error);
    console.error('Error status:', error.status);
    console.error('Error message:', error.message);
    console.error('Error error:', error.error);
    
    let errorMessage = 'An error occurred';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      if (error.error && typeof error.error === 'string') {
        try {
          const decodedError = error.error.replace(/&quot;/g, '"').replace(/&amp;/g, '&');
          const errorObj = JSON.parse(decodedError);
          errorMessage = errorObj.message || decodedError;
        } catch {
          errorMessage = error.error;
        }
      } else if (error.error && typeof error.error === 'object' && error.error.message) {
        errorMessage = error.error.message;
      } else if (error.status === 0) {
        errorMessage = 'Unable to connect to server - Check if API Gateway is running on port 1016';
      } else {
        errorMessage = `Server error: ${error.status} ${error.statusText}`;
      }
    }
    
    return throwError(() => errorMessage);
  }
}
