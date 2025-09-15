import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  private baseUrl = 'http://localhost:1016/api/supplier';

  constructor(private http: HttpClient) { }

  getAllSuppliers(): Observable<SupplierDTO[]> {
    return this.http.get<SupplierDTO[]>(`${this.baseUrl}/viewAllSupplier`);
  }

  getSupplier(id: number): Observable<SupplierDTO> {
    return this.http.get<SupplierDTO>(`${this.baseUrl}/supplierInfoById/${id}`);
  }

  addSupplier(supplier: SupplierDTO): Observable<string> {
    const headers = { 'Content-Type': 'application/json' };
    return this.http.post<string>(`${this.baseUrl}/add`, supplier, { headers, responseType: 'text' as 'json' });
  }

  updateSupplier(id: number, supplier: SupplierDTO): Observable<SupplierDTO> {
    return this.http.put<SupplierDTO>(`${this.baseUrl}/updateSupplier/${id}`, supplier);
  }

  deleteSupplier(id: number): Observable<string> {
    return this.http.delete<string>(`${this.baseUrl}/deleteSupplier/${id}`, { responseType: 'text' as 'json' });
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