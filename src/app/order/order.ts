import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../services/order.service';
import { AuthService } from '../services/auth.service';
import { Order, Product } from '../models/order.model';
import { RoleNavComponent } from '../navigation/role-nav';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule, FormsModule, RoleNavComponent],
  templateUrl: './order.html',
  styleUrls: ['./order.css']
})
export class OrderComponent implements OnInit {
  orders: Order[] = [];
  allOrders: Order[] = [];
  selectedOrder: Order | null = null;

  // Form models
  newProduct: Product = { productId: 0, quantity: 0 };
  searchOrderId: number = 0;
  searchCustomerId: number = 0;
  updateOrderId: number = 0;
  updateStatus: string = '';
  selectedProductName: string = '';

  // UI state
  activeTab: string = 'create';
  message: string = '';
  isLoading: boolean = false;

  // Role-based permissions
  isAdmin = false;
  isUser = false;
  userRole = '';

  constructor(private orderService: OrderService, private authService: AuthService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.checkUserRole();
    this.authService.currentUser$.subscribe(() => {
      this.checkUserRole();
    });
    
    // Test endpoints for debugging
    this.orderService.testEndpoints();
    
    // Handle query parameters for product ordering
    this.route.queryParams.subscribe(params => {
      if (params['productId']) {
        this.newProduct.productId = +params['productId'];
        this.selectedProductName = params['productName'] || '';
        this.activeTab = 'create'; // Switch to create order tab
        this.message = `Ready to create order for: ${this.selectedProductName}`;
      }
    });
  }

  checkUserRole() {
    this.isAdmin = this.authService.isAdmin();
    this.isUser = this.authService.isUser();
    this.userRole = this.authService.getUserRole();
  }

  canUpdateStatus(): boolean {
    return this.isAdmin;
  }

  canViewAllOrders(): boolean {
    return this.isAdmin;
  }

  canSearchByCustomerId(): boolean {
    return this.isAdmin;
  }


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
    console.log('Searching for order ID:', this.searchOrderId);

    this.orderService.getOrderById(this.searchOrderId).subscribe({
      next: (response: any) => {
        console.log('Order response:', response);
        try {
          // Handle both JSON object and string responses
          const order = typeof response === 'string' ? JSON.parse(response) : response;
          this.selectedOrder = order;
          this.message = 'Order found successfully!';
        } catch (e) {
          console.error('Error parsing order response:', e);
          this.message = 'Error parsing order data';
        }
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error searching order by ID:', error);
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
    console.log('Searching for customer ID:', this.searchCustomerId);

    this.orderService.getOrdersByCustomerId(this.searchCustomerId).subscribe({
      next: (response: any) => {
        console.log('Customer orders response:', response);
        try {
          // Handle both JSON array and string responses
          const orders = typeof response === 'string' ? JSON.parse(response) : response;
          this.orders = Array.isArray(orders) ? orders : [];
          this.message = `Found ${this.orders.length} orders for customer ${this.searchCustomerId}`;
        } catch (e) {
          console.error('Error parsing customer orders response:', e);
          this.orders = [];
          this.message = 'Error parsing orders data';
        }
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error searching orders by customer ID:', error);
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
      next: (response: any) => {
        console.log('All orders response:', response);
        try {
          // Handle both JSON array and string responses
          const orders = typeof response === 'string' ? JSON.parse(response) : response;
          this.allOrders = Array.isArray(orders) ? orders : [];
          this.message = `Found ${this.allOrders.length} orders`;
        } catch (e) {
          console.error('Error parsing all orders response:', e);
          this.allOrders = [];
          this.message = 'Error parsing orders data';
        }
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
    console.log('Updating order status:', this.updateOrderId, 'to', this.updateStatus);

    this.orderService.updateOrderStatus(this.updateOrderId, this.updateStatus).subscribe({
      next: (response: string) => {
        console.log('Order status update response:', response);
        this.message = this.normalizeMessage(response || 'Order status updated successfully!');
        this.updateOrderId = 0;
        this.updateStatus = '';
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error updating order status:', error);
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
