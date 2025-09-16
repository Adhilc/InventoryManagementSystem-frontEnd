import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
 
@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  private baseUrl = 'http://localhost:1016/api/supplier';
 
  constructor(private http: HttpClient) { }
 
  getAllSuppliers(): Observable<SupplierDTO[]> {
    console.log('Making request to:', `${this.baseUrl}/viewAllSupplier`);
    console.log('Auth token:', localStorage.getItem('authToken'));
   
    return this.http.get<SupplierDTO[]>(`${this.baseUrl}/viewAllSupplier`)
      .pipe(catchError(this.handleError));
  }
 
  getSupplier(id: number): Observable<SupplierDTO> {
    return this.http.get<SupplierDTO>(`${this.baseUrl}/supplierInfoById/${id}`)
      .pipe(catchError(this.handleError));
  }
 
  addSupplier(supplier: SupplierDTO): Observable<string> {
    return this.http.post(`${this.baseUrl}/add`, supplier, { responseType: 'text' })
      .pipe(catchError(this.handleError));
  }
 
  updateSupplier(id: number, supplier: SupplierDTO): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/updateSupplier/${id}`, supplier)
      .pipe(catchError(this.handleError));
  }
 
  deleteSupplier(id: number): Observable<string> {
    return this.http.delete(`${this.baseUrl}/deleteSupplier/${id}`, { responseType: 'text' })
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
 
export interface SupplierDTO {
  supplierID: number;
  name: string;
  contactInfo: number;
  productsSupplied: string;
  quantity: number;
  date: string;
}