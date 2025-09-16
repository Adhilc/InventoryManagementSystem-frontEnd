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
  // Using API Gateway
  private baseUrl = 'http://localhost:1016/api/order';

  constructor(private http: HttpClient) { }

  createOrder(product: Product): Observable<string> {
    const token = localStorage.getItem('authToken');
    console.log('Making request to:', `${this.baseUrl}/save`);
    console.log('Product data:', product);
    console.log('Auth token present:', !!token);
    console.log('Auth token (first 20 chars):', token ? token.substring(0, 20) + '...' : 'No token');
    
    return this.http.post(`${this.baseUrl}/save`, product, { responseType: 'text' })
      .pipe(catchError(this.handleError));
  }

  getOrderById(id: number): Observable<any> {
    const token = localStorage.getItem('authToken');
    console.log('Making request to:', `${this.baseUrl}/getByOrderId/${id}`);
    console.log('Auth token present:', !!token);
    console.log('Auth token (first 20 chars):', token ? token.substring(0, 20) + '...' : 'No token');
    console.log('Request will be proxied through:', `http://localhost:4200${this.baseUrl}/getByOrderId/${id}`);
    return this.http.get(`${this.baseUrl}/getByOrderId/${id}`)
      .pipe(catchError(this.handleError));
  }

  getOrdersByCustomerId(customerId: number): Observable<any> {
    const token = localStorage.getItem('authToken');
    console.log('Making request to:', `${this.baseUrl}/getByCustomerId/${customerId}`);
    console.log('Auth token present:', !!token);
    console.log('Auth token (first 20 chars):', token ? token.substring(0, 20) + '...' : 'No token');
    console.log('Request will be proxied through:', `http://localhost:4200${this.baseUrl}/getByCustomerId/${customerId}`);
    return this.http.get(`${this.baseUrl}/getByCustomerId/${customerId}`)
      .pipe(catchError(this.handleError));
  }

  updateOrderStatus(orderId: number, status: string): Observable<string> {
    const token = localStorage.getItem('authToken');
    console.log('Making request to:', `${this.baseUrl}/updateStatus/${orderId}/${status}`);
    console.log('Auth token present:', !!token);
    console.log('Auth token (first 20 chars):', token ? token.substring(0, 20) + '...' : 'No token');
    console.log('Request will be proxied through:', `http://localhost:4200${this.baseUrl}/updateStatus/${orderId}/${status}`);
    
    return this.http.post(`${this.baseUrl}/updateStatus/${orderId}/${status}`, {}, { responseType: 'text' })
      .pipe(catchError(this.handleError));
  }

  getAllOrders(): Observable<any> {
    const token = localStorage.getItem('authToken');
    console.log('Making request to:', `${this.baseUrl}/getAll`);
    console.log('Auth token present:', !!token);
    console.log('Auth token (first 20 chars):', token ? token.substring(0, 20) + '...' : 'No token');
    return this.http.get(`${this.baseUrl}/getAll`)
      .pipe(catchError(this.handleError));
  }

  // Test method to verify JWT token and connectivity
  testConnection(): Observable<any> {
    const token = localStorage.getItem('authToken');
    console.log('=== TESTING ORDER SERVICE CONNECTION ===');
    console.log('Base URL:', this.baseUrl);
    console.log('Full test URL:', `${this.baseUrl}/getAll`);
    console.log('JWT Token present:', !!token);
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('JWT Payload:', payload);
        console.log('User role:', payload.role);
      } catch (e) {
        console.error('Invalid JWT token format');
      }
    }
    console.log('=== END CONNECTION TEST ===');
    return this.getAllOrders();
  }

  // Test specific endpoints
  testEndpoints(): void {
    console.log('=== TESTING ALL ORDER ENDPOINTS ===');
    console.log('1. Create Order:', `POST ${this.baseUrl}/save`);
    console.log('2. Get Order by ID:', `GET ${this.baseUrl}/getByOrderId/{id}`);
    console.log('3. Get Orders by Customer ID:', `GET ${this.baseUrl}/getByCustomerId/{id}`);
    console.log('4. Update Order Status:', `POST ${this.baseUrl}/updateStatus/{orderId}/{status}`);
    console.log('5. Get All Orders:', `GET ${this.baseUrl}/getAll`);
    console.log('=== PROXY URLS ===');
    console.log('All requests will be proxied through localhost:4200 to localhost:1016');
    console.log('=== END ENDPOINT TEST ===');
  }

  // Test a specific order ID to debug issues
  debugOrderById(orderId: number): Observable<any> {
    console.log('=== DEBUG ORDER BY ID ===');
    console.log('Testing Order ID:', orderId);
    console.log('Full URL:', `${this.baseUrl}/getByOrderId/${orderId}`);
    return this.getOrderById(orderId);
  }

  // Test a specific customer ID to debug issues
  debugOrdersByCustomerId(customerId: number): Observable<any> {
    console.log('=== DEBUG ORDERS BY CUSTOMER ID ===');
    console.log('Testing Customer ID:', customerId);
    console.log('Full URL:', `${this.baseUrl}/getByCustomerId/${customerId}`);
    return this.getOrdersByCustomerId(customerId);
  }

  private handleError(error: HttpErrorResponse) {
    console.error('=== ORDER SERVICE ERROR DEBUG ===');
    console.error('Full error object:', error);
    console.error('Error status:', error.status);
    console.error('Error statusText:', error.statusText);
    console.error('Error message:', error.message);
    console.error('Error error:', error.error);
    console.error('Error url:', error.url);
    console.error('JWT Token present:', !!localStorage.getItem('authToken'));
    console.error('=== END ERROR DEBUG ===');
    
    let errorMessage = 'An error occurred';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      // Handle 200 OK responses with HTML error content
      if (error.status === 200 && error.error && typeof error.error === 'string') {
        if (error.error.includes('<html>') || error.error.includes('<!DOCTYPE')) {
          console.log('200 OK with HTML Error Response detected');
          const match = error.error.match(/<pre>(.*?)<\/pre>/s);
          if (match) {
            const htmlDecoded = match[1]
              .replace(/&amp;lt;/g, '<')
              .replace(/&amp;gt;/g, '>')
              .replace(/&amp;quot;/g, '"')
              .replace(/&amp;#39;/g, "'")
              .replace(/&amp;amp;/g, '&');
            console.log('Extracted error message:', htmlDecoded);
            errorMessage = `Routing Error: ${htmlDecoded}`;
          } else {
            errorMessage = 'API Gateway routing error - Endpoint not found or misconfigured';
          }
        } else {
          errorMessage = error.error;
        }
      } else if (error.error && typeof error.error === 'string') {
        // Handle other HTML error responses
        if (error.error.includes('<html>') || error.error.includes('<!DOCTYPE')) {
          console.log('HTML Error Response detected');
          const match = error.error.match(/<pre>(.*?)<\/pre>/s);
          if (match) {
            const htmlDecoded = match[1]
              .replace(/&amp;lt;/g, '<')
              .replace(/&amp;gt;/g, '>')
              .replace(/&amp;quot;/g, '"')
              .replace(/&amp;#39;/g, "'")
              .replace(/&amp;amp;/g, '&');
            console.log('Extracted error message:', htmlDecoded);
            errorMessage = `Backend Error: ${htmlDecoded}`;
          } else {
            errorMessage = 'Server routing error - Check if API Gateway is routing correctly';
          }
        } else {
          try {
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
        errorMessage = 'Unable to connect to server - Check if API Gateway is running on port 1016';
      } else if (error.status === 401) {
        errorMessage = 'Unauthorized - Please login again with valid credentials';
      } else if (error.status === 403) {
        errorMessage = 'Forbidden - You do not have permission for this action. Admin role may be required.';
      } else if (error.status === 404) {
        if (error.url && error.url.includes('getByOrderId')) {
          errorMessage = 'Order not found - Please check the Order ID and try again';
        } else if (error.url && error.url.includes('getByCustomerId')) {
          errorMessage = 'No orders found for this Customer ID';
        } else {
          errorMessage = 'Endpoint not found - Check if OrderManagement service is running';
        }
      } else if (error.status === 500) {
        errorMessage = 'Internal server error - Please check backend service logs';
      } else {
        errorMessage = `Server error: ${error.status} ${error.statusText}`;
      }
    }
    
    return throwError(() => errorMessage);
  }
}