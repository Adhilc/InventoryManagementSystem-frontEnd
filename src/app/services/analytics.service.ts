import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { OrderReportSent } from '../models/order-report.model';
import { SupplierReportSent } from '../models/supplier-report.models';
import { StockDTO, OverAllStock } from '../models/stock.model';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private baseUrl = 'http://localhost:8085/api/report';

  constructor(private http: HttpClient) {}

  getOrderReportsByDate(startDate: string, endDate: string): Observable<OrderReportSent[]> {
    const url = `${this.baseUrl}/getByDate/order/${startDate}/${endDate}`;
    console.log('Making API call to:', url);
    return this.http.get<OrderReportSent[]>(url).pipe(
      tap(data => console.log('API Response:', data)),
      catchError(this.handleError)
    );
  }

  getSupplierReportsByDate(startDate: string, endDate: string): Observable<SupplierReportSent[]> {
    const url = `${this.baseUrl}/getByDate/supplier/${startDate}/${endDate}`;
    console.log('Making API call to:', url);
    return this.http.get<SupplierReportSent[]>(url).pipe(
      tap(data => console.log('API Response:', data)),
      catchError(this.handleError)
    );
  }

  getLowerStocks(): Observable<StockDTO[]> {
    const url = `${this.baseUrl}/getTheLowerStocks`;
    console.log('Making API call to:', url);
    return this.http.get<StockDTO[]>(url).pipe(
      tap(data => console.log('API Response:', data)),
      catchError(this.handleError)
    );
  }

  getAllStocks(): Observable<OverAllStock[]> {
    const url = `${this.baseUrl}/getAllStocks`;
    console.log('Making API call to:', url);
    return this.http.get<OverAllStock[]>(url).pipe(
      tap(data => console.log('API Response:', data)),
      catchError(this.handleError)
    );
  }

  private handleError = (error: HttpErrorResponse) => {
    console.error('API Error:', error);
    if (error.status === 0) {
      console.error('Network error - check if backend is running on port 8085');
    } else {
      console.error(`Backend returned code ${error.status}, body was:`, error.error);
    }
    return throwError(() => error);
  };
}