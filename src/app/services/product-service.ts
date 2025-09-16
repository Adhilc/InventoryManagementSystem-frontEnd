import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Define the Product class to match your data structure
export class Product {
  constructor(
    public productID: number,
    public name: string,
    public price: number,
    public stockLevel: number,
    public description: string
  ) {}
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  // Using API Gateway
  private apiUrl = '/api/product';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    const getUrl = "viewAllAvailable";
    return this.http.get<Product[]>(`${this.apiUrl}/${getUrl}`);
  }

  deleteProduct(id: number): Observable<string> {
    const del = "deleteById";
    const deleteUrl = `${this.apiUrl}/${del}/${id}`;
    // Specify the response type as 'text'
    return this.http.delete(deleteUrl, { responseType: 'text' });
  }

  addProduct(product: Product): Observable<string> {
    const addUrl = "add";
    // Specify the response type as 'text' for the POST request
    return this.http.post(`${this.apiUrl}/${addUrl}`, product, { responseType: 'text' });
  }

  updateProduct(product: Product): Observable<string> {
    const updateUrl = "update";
    // Send a PUT request with the updated product data
    return this.http.put(`${this.apiUrl}/${updateUrl}`, product, { responseType: 'text' });
  }
}