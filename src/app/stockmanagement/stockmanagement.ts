import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StockmanagementService, Stock } from '../services/stockmanagement-service';
import { RoleNavComponent } from '../navigation/role-nav';
 
@Component({
  selector: 'stockmanagement',
  standalone: true,
  imports: [CommonModule, FormsModule, RoleNavComponent],
  templateUrl: './stockmanagement.html',
  styleUrl: './stockmanagement.css'
})
export class Stockmanagement implements OnInit {
  productId: number = 0;
  amount: number = 0;
  currentStock: Stock | null = null;
  lowStockItems: Stock[] = [];
  loading = false;
  message = '';
  messageType: 'success' | 'error' = 'success';
 
  constructor(private stockService: StockmanagementService) {
    console.log('StockmanagementService injected:', this.stockService);
  }
 
  ngOnInit() {
    console.log('Stock Management component initialized');
   
    // Set JWT token for testing
    const testToken = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJWYW1zaXlwYWxhIiwicm9sZSI6IkFETUlOIiwiaWF0IjoxNzU3OTk2NTI3LCJleHAiOjE3NTgwMzI1Mjd9.4G0uBU9h3Xu5fSdxAifeYZGtOxxZF1yJ1e6UjkqAOvA';
    localStorage.setItem('authToken', testToken);
    console.log('JWT token set in localStorage for testing');
   
    this.loadLowStockItems();
  }
 
  searchStock() {
    if (!this.productId) {
      this.showMessage('Please enter a valid Product ID', 'error');
      return;
    }
 
    console.log('Searching for product ID:', this.productId);
    this.loading = true;
    this.stockService.getStockByProductId(this.productId).subscribe({
      next: (stock) => {
        console.log('Stock data received:', stock);
        this.currentStock = stock;
        this.loading = false;
        this.showMessage('Stock information loaded successfully', 'success');
      },
      error: (error) => {
        this.loading = false;
        console.error('Search error - Full error object:', error);
        console.error('Error status:', error.status);
        console.error('Error message:', error.message);
        const backendMsg = this.extractErrorMessage(error);
        this.showMessage(backendMsg || `Error: ${error.status || ''} - ${error.message || 'Request failed'}`, 'error');
      }
    });
  }
 
  increaseStock() {
    if (!this.currentStock || !this.amount || this.amount <= 0) {
      this.showMessage('Please enter a valid amount to increase', 'error');
      return;
    }
 
    this.loading = true;
    this.stockService.increaseStock(this.currentStock.productID, this.amount).subscribe({
      next: (updatedStock) => {
        this.currentStock = updatedStock;
        this.amount = 0;
        this.loading = false;
        this.showMessage('Stock increased successfully', 'success');
        this.loadLowStockItems();
      },
      error: (error) => {
        this.loading = false;
        const backendMsg = this.extractErrorMessage(error);
        this.showMessage(backendMsg || 'Error increasing stock', 'error');
        console.error('Error increasing stock:', error);
      }
    });
  }
 
  decreaseStock() {
    if (!this.currentStock || !this.amount || this.amount <= 0) {
      this.showMessage('Please enter a valid amount to decrease', 'error');
      return;
    }
 
    this.loading = true;
    this.stockService.decreaseStock(this.currentStock.productID, this.amount).subscribe({
      next: (updatedStock) => {
        this.currentStock = updatedStock;
        this.amount = 0;
        this.loading = false;
        this.showMessage('Stock decreased successfully', 'success');
        this.loadLowStockItems();
      },
      error: (error) => {
        this.loading = false;
        const backendMsg = this.extractErrorMessage(error);
        this.showMessage(backendMsg || 'Error decreasing stock', 'error');
        console.error('Error decreasing stock:', error);
      }
    });
  }
 
  loadLowStockItems() {
    console.log('Loading low stock items...');
    this.stockService.getLowStockReport().subscribe({
      next: (items) => {
        console.log('Low stock items received:', items);
        this.lowStockItems = items;
      },
      error: (error) => {
        console.error('Error loading low stock items:', error);
        const backendMsg = this.extractErrorMessage(error);
        this.showMessage(backendMsg || 'Error loading low stock items', 'error');
      }
    });
  }
 
  private showMessage(text: string, type: 'success' | 'error') {
    this.message = text;
    this.messageType = type;
    setTimeout(() => {
      this.message = '';
    }, 3000);
  }
 
  selectProduct(productId: number) {
    this.productId = productId;
    this.searchStock();
  }
 
  trackByProductId(index: number, item: Stock): number {
    return item.productID;
  }
 
  private extractErrorMessage(error: any): string {
    if (!error) return 'An unexpected error occurred';
   
    const statusPrefix = error?.status ? `Error ${error.status}: ` : '';
    const err = error?.error;
 
    // Handle different error response formats
    if (typeof err === 'string' && err.trim()) {
      return `${statusPrefix}${err}`;
    }
 
    if (err && typeof err === 'object') {
      if (err.message && typeof err.message === 'string') {
        return `${statusPrefix}${err.message}`;
      }
      if (err.error && typeof err.error === 'string') {
        return `${statusPrefix}${err.error}`;
      }
      if (err.detail && typeof err.detail === 'string') {
        return `${statusPrefix}${err.detail}`;
      }
    }
 
    if (error?.message && typeof error.message === 'string') {
      return `${statusPrefix}${error.message}`;
    }
 
    // Provide user-friendly messages based on status codes
    switch (error?.status) {
      case 404:
        return 'Product not found. Please check the Product ID and try again.';
      case 400:
        return 'Invalid request. Please check your input and try again.';
      case 500:
        return 'Server error. Please try again later or contact support.';
      case 0:
        return 'Unable to connect to server. Please check your internet connection.';
      default:
        return statusPrefix ? `${statusPrefix}Request failed` : 'Request failed. Please try again.';
    }
  }
}