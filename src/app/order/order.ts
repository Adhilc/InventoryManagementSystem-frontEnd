import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../services/order.service';
import { Order, Product } from '../models/order.model';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './order.html',
  styleUrls: ['./order.css']
})
export class OrderComponent {
  orders: Order[] = [];
  allOrders: Order[] = [];
  selectedOrder: Order | null = null;

  // Form models
  newProduct: Product = { productId: 0, quantity: 0 };
  searchOrderId: number = 0;
  searchCustomerId: number = 0;
  updateOrderId: number = 0;
  updateStatus: string = '';

  // UI state
  activeTab: string = 'create';
  message: string = '';
  isLoading: boolean = false;

  constructor(private orderService: OrderService) {}


  private normalizeMessage(m: any): string {
    if (m === null || m === undefined) return '';
    if (typeof m === 'string') return m;
    if (typeof m === 'object') {
      if (m.message) return String(m.message);
      if (m.error) return typeof m.error === 'string' ? m.error : JSON.stringify(m.error);
      return JSON.stringify(m);
    }
    return String(m);
  }

  get messageClass(): string {
    const m = (this.message || '').toLowerCase();
    if (!m) return 'alert alert-info alert-dismissible fade show';
    if (m.includes('error') || m.includes('not found') || m.includes('failed')) {
      return 'alert alert-danger alert-dismissible fade show';
    }
    if (m.includes('success') || m.includes('created') || m.includes('updated') || m.includes('found')) {
      return 'alert alert-success alert-dismissible fade show';
    }
    return 'alert alert-info alert-dismissible fade show';
  }

  createOrder() {
    if (this.newProduct.productId <= 0 || this.newProduct.quantity <= 0) {
      this.message = 'Please enter valid product ID and quantity';
      return;
    }

    this.clearMessage();
    this.isLoading = true;

    this.orderService.createOrder(this.newProduct).subscribe({
      next: (response: string) => {
        this.message = this.normalizeMessage(response || 'Order created successfully!');
        this.newProduct = { productId: 0, quantity: 0 };
        this.isLoading = false;
      },
      error: (error: any) => {
        this.message = this.normalizeMessage(error);
        this.isLoading = false;
      }
    });
  }

  searchOrderById() {
    if (this.searchOrderId <= 0) {
      this.message = 'Please enter a valid order ID';
      return;
    }

    this.clearMessage();
    this.isLoading = true;

    this.orderService.getOrderById(this.searchOrderId).subscribe({
      next: (order: Order) => {
        this.selectedOrder = order;
        this.message = 'Order found successfully!';
        this.isLoading = false;
      },
      error: (error: any) => {
        this.selectedOrder = null;
        this.message = this.normalizeMessage(error);
        this.isLoading = false;
      }
    });
  }

  searchOrdersByCustomerId() {
    if (this.searchCustomerId <= 0) {
      this.message = 'Please enter a valid customer ID';
      return;
    }

    this.clearMessage();
    this.isLoading = true;

    this.orderService.getOrdersByCustomerId(this.searchCustomerId).subscribe({
      next: (orders: Order[]) => {
        this.orders = orders || [];
        this.message = `Found ${this.orders.length} orders for customer ${this.searchCustomerId}`;
        this.isLoading = false;
      },
      error: (error: any) => {
        this.orders = [];
        this.message = this.normalizeMessage(error);
        this.isLoading = false;
      }
    });
  }

  loadAllOrders() {
    this.clearMessage();
    this.isLoading = true;

    this.orderService.getAllOrders().subscribe({
      next: (orders: Order[]) => {
        this.allOrders = orders || [];
        this.message = `Found ${this.allOrders.length} orders`;
        this.isLoading = false;
      },
      error: (error: any) => {
        this.allOrders = [];
        this.message = this.normalizeMessage(error);
        this.isLoading = false;
      }
    });
  }

  updateOrderStatus() {
    if (this.updateOrderId <= 0 || !this.updateStatus.trim()) {
      this.message = 'Please enter valid order ID and status';
      return;
    }

    this.clearMessage();
    this.isLoading = true;

    this.orderService.updateOrderStatus(this.updateOrderId, this.updateStatus).subscribe({
      next: (response: string) => {
        this.message = this.normalizeMessage(response || 'Order status updated successfully!');
        this.updateOrderId = 0;
        this.updateStatus = '';
        this.isLoading = false;
      },
      error: (error: any) => {
        this.message = this.normalizeMessage(error);
        this.isLoading = false;
      }
    });
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
    this.clearMessage();
    this.selectedOrder = null;
    this.orders = [];
    this.allOrders = [];
  }

  clearMessage() {
    this.message = '';
  }
}
