import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart, registerables } from 'chart.js';
import { AnalyticsService } from '../services/analytics.service';
import { OrderReportSent } from '../models/order-report.model';
import { SupplierReportSent } from '../models/supplier-report.models';
import { StockDTO, OverAllStock } from '../models/stock.model';
import { RoleNavComponent } from '../navigation/role-nav';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule, RoleNavComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit, AfterViewInit {
  orderStartDate: string = '';
  orderEndDate: string = '';
  supplierStartDate: string = '';
  supplierEndDate: string = '';
  
  orderReports: OrderReportSent[] = [];
  supplierReports: SupplierReportSent[] = [];
  lowStocks: StockDTO[] = [];
  allStocks: OverAllStock[] = [];
  
  orderChart: Chart | null = null;
  supplierChart: Chart | null = null;
  stockChart: Chart | null = null;
  lowStockChart: Chart | null = null;
  
  loading = false;

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit() {
    // Initialize component
  }

  ngAfterViewInit() {
    // Load data after view is initialized
    setTimeout(() => this.loadInitialData(), 200);
  }

  // Fallback sample data for testing
  loadSampleData() {
    this.allStocks = [
      { productID: 1, name: 'Product A', quantity: 150 },
      { productID: 2, name: 'Product B', quantity: 75 },
      { productID: 3, name: 'Product C', quantity: 200 },
      { productID: 4, name: 'Product D', quantity: 50 },
      { productID: 5, name: 'Product E', quantity: 100 }
    ];
    
    this.lowStocks = [
      { productID: 2, name: 'Product B', quantity: 5 },
      { productID: 4, name: 'Product D', quantity: 8 },
      { productID: 6, name: 'Product F', quantity: 3 }
    ];
    
    setTimeout(() => {
      this.createStockChart();
      this.createLowStockChart();
    }, 300);
  }

  // Load sample order data for testing
  loadSampleOrderData() {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    this.orderReports = [
      { productId: 1, date: today.toISOString().split('T')[0], quantity: 25 },
      { productId: 2, date: today.toISOString().split('T')[0], quantity: 15 },
      { productId: 3, date: yesterday.toISOString().split('T')[0], quantity: 30 },
      { productId: 1, date: yesterday.toISOString().split('T')[0], quantity: 20 },
      { productId: 4, date: today.toISOString().split('T')[0], quantity: 10 }
    ];
    
    setTimeout(() => this.createOrderChart(), 100);
  }

  getTotalQuantity(): number {
    return this.allStocks.reduce((total, stock) => total + stock.quantity, 0);
  }

  getAverageStock(): number {
    if (this.allStocks.length === 0) return 0;
    return Math.round(this.getTotalQuantity() / this.allStocks.length);
  }

  isLowStock(stock: any): boolean {
    return this.lowStocks.some(lowStock => lowStock.productID === stock.productID);
  }

  trackByProductId(index: number, stock: any): number {
    return stock.productID;
  }



  // Format date for API (YYYY-MM-DD format)
  formatDateForAPI(dateString: string, isEndDate: boolean = false): string {
    // Simply return the date string as is since input type="date" already gives YYYY-MM-DD format
    return dateString;
  }

  // Format datetime for API (ISO format)
  formatDateTimeForAPI(dateTimeString: string): string {
    const date = new Date(dateTimeString);
    return date.toISOString();
  }

  loadInitialData() {
    this.loading = true;
    this.analyticsService.getLowerStocks().subscribe({
      next: (data) => {
        this.lowStocks = data;
        if (data && data.length >= 0) {
          setTimeout(() => this.createLowStockChart(), 100);
        }
      },
      error: (error) => {
        console.error('Error loading low stocks:', error);
        // Low stocks will be handled by sample data if needed
      }
    });

    this.analyticsService.getAllStocks().subscribe({
      next: (data) => {
        this.allStocks = data;
        if (data && data.length > 0) {
          setTimeout(() => this.createStockChart(), 100);
        } else {
          console.warn('No stock data received, loading sample data');
          this.loadSampleData();
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading all stocks:', error);
        console.log('Loading sample data for demonstration');
        this.loadSampleData();
        this.loading = false;
      }
    });
  }

  loadOrderReports() {
    if (!this.orderStartDate || !this.orderEndDate) {
      alert('Please select both start and end dates');
      return;
    }
    
    console.log('Loading orders from:', this.orderStartDate, 'to:', this.orderEndDate);
    
    this.loading = true;
    this.analyticsService.getOrderReportsByDate(this.orderStartDate, this.orderEndDate).subscribe({
      next: (data) => {
        console.log('Order reports received:', data);
        this.orderReports = data || [];
        setTimeout(() => this.createOrderChart(), 100);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading order reports:', error);
        alert('Failed to load order reports. Please check the console for details.');
        this.loading = false;
      }
    });
  }

  loadSupplierReports() {
    if (!this.supplierStartDate || !this.supplierEndDate) {
      alert('Please select both start and end date/time');
      return;
    }
    
    console.log('Loading suppliers from:', this.supplierStartDate, 'to:', this.supplierEndDate);
    
    this.loading = true;
    this.analyticsService.getSupplierReportsByDate(this.supplierStartDate, this.supplierEndDate).subscribe({
      next: (data) => {
        console.log('Supplier reports received:', data);
        this.supplierReports = data || [];
        setTimeout(() => this.createSupplierChart(), 100);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading supplier reports:', error);
        this.loading = false;
      }
    });
  }

  createOrderChart() {
    if (this.orderChart) {
      this.orderChart.destroy();
    }

    const ctx = document.getElementById('orderChart') as HTMLCanvasElement;
    if (!ctx) {
      console.error('Order chart canvas not found');
      return;
    }

    if (this.orderReports.length === 0) {
      // Add text message to chart container
      const container = ctx.parentElement;
      if (container) {
        container.innerHTML = `
          <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: #7f8c8d; text-align: center;">
            <div style="font-size: 3rem; margin-bottom: 16px;">📦</div>
            <div style="font-size: 1.2rem; font-weight: 600; margin-bottom: 8px;">No Order Data</div>
            <div style="font-size: 0.9rem; opacity: 0.8;">Select date range and click Load Reports</div>
          </div>
          <canvas id="orderChart"></canvas>
        `;
      }
      return;
    }

    const productQuantities = this.orderReports.reduce((acc, order) => {
      acc[order.productId] = (acc[order.productId] || 0) + order.quantity;
      return acc;
    }, {} as {[key: number]: number});

    const colors = [
      'rgba(54, 162, 235, 0.8)', 'rgba(255, 99, 132, 0.8)', 'rgba(255, 205, 86, 0.8)',
      'rgba(75, 192, 192, 0.8)', 'rgba(153, 102, 255, 0.8)', 'rgba(255, 159, 64, 0.8)'
    ];

    this.orderChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Object.keys(productQuantities).map(id => `Product ${id}`),
        datasets: [{
          label: 'Order Quantities',
          data: Object.values(productQuantities),
          backgroundColor: colors.slice(0, Object.keys(productQuantities).length),
          borderColor: colors.slice(0, Object.keys(productQuantities).length).map(color => color.replace('0.8', '1')),
          borderWidth: 2,
          borderRadius: 8,
          borderSkipped: false,
          hoverBackgroundColor: colors.slice(0, Object.keys(productQuantities).length).map(color => color.replace('0.8', '0.9')),
          hoverBorderWidth: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
          mode: 'index'
        },
        animation: {
          duration: 1000,
          easing: 'easeOutQuart'
        },
        plugins: {
          title: {
            display: true,
            text: `Order Reports (${this.orderStartDate} to ${this.orderEndDate})`,
            font: { size: 16, weight: 'bold' },
            padding: 20
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: 'white',
            bodyColor: 'white',
            borderColor: 'rgba(255, 255, 255, 0.2)',
            borderWidth: 1,
            cornerRadius: 8,
            callbacks: {
              label: (context: any) => {
                return `${context.label}: ${context.parsed.y} units ordered`;
              }
            }
          },
          legend: {
            display: true,
            position: 'top',
            labels: {
              usePointStyle: true,
              padding: 20
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Quantity Ordered',
              font: { size: 14, weight: 'bold' }
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Products',
              font: { size: 14, weight: 'bold' }
            },
            grid: {
              display: false
            }
          }
        }
      }
    });
  }

  createSupplierChart() {
    if (this.supplierChart) {
      this.supplierChart.destroy();
      this.supplierChart = null;
    }

    const ctx = document.getElementById('supplierChart') as HTMLCanvasElement;
    if (!ctx) {
      console.error('Supplier chart canvas not found');
      return;
    }

    if (this.supplierReports.length === 0) {
      // Show "No data" chart like order reports
      this.supplierChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['No Data Available'],
          datasets: [{
            label: 'Supplier Activities',
            data: [0],
            backgroundColor: 'rgba(149, 165, 166, 0.8)',
            borderColor: 'rgba(149, 165, 166, 1)',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'Supplier Activity - No Data for Selected Range',
              font: { size: 16, weight: 'bold' },
              padding: 20
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 10
            }
          }
        }
      });
      return;
    }

    const supplierCounts = this.supplierReports.reduce((acc, supplier) => {
      acc[supplier.name] = (acc[supplier.name] || 0) + 1;
      return acc;
    }, {} as {[key: string]: number});

    const supplierColors = [
      '#3498DB', '#E74C3C', '#F39C12', '#27AE60', '#9B59B6',
      '#1ABC9C', '#E67E22', '#34495E', '#F1C40F', '#E91E63'
    ];

    this.supplierChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Object.keys(supplierCounts),
        datasets: [{
          label: 'Supplier Activities',
          data: Object.values(supplierCounts),
          backgroundColor: supplierColors.slice(0, Object.keys(supplierCounts).length),
          borderColor: supplierColors.slice(0, Object.keys(supplierCounts).length),
          borderWidth: 2,
          borderRadius: 8,
          borderSkipped: false,
          hoverBackgroundColor: supplierColors.slice(0, Object.keys(supplierCounts).length).map(color => color + '90'),
          hoverBorderWidth: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
          mode: 'index'
        },
        animation: {
          duration: 1000,
          easing: 'easeOutQuart'
        },
        plugins: {
          title: {
            display: true,
            text: this.supplierStartDate && this.supplierEndDate ? 
                  `Supplier Activity (${this.supplierStartDate} to ${this.supplierEndDate})` :
                  'Supplier Activity',
            font: { size: 16, weight: 'bold' },
            padding: 20
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: 'white',
            bodyColor: 'white',
            borderColor: 'rgba(255, 255, 255, 0.2)',
            borderWidth: 1,
            cornerRadius: 8,
            callbacks: {
              label: (context: any) => {
                const label = context.label || '';
                const value = context.parsed.y;
                const total = (context.dataset.data as number[]).reduce((a, b) => a + b, 0);
                const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
                return `${label}: ${value} activities (${percentage}%)`;
              }
            }
          },
          legend: {
            display: true,
            position: 'top',
            labels: {
              usePointStyle: true,
              padding: 20
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Number of Activities',
              font: { size: 14, weight: 'bold' }
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Suppliers',
              font: { size: 14, weight: 'bold' }
            },
            grid: {
              display: false
            }
          }
        }
      }
    });
  }

  createStockChart() {
    if (this.stockChart) {
      this.stockChart.destroy();
    }

    const ctx = document.getElementById('stockChart') as HTMLCanvasElement;
    if (!ctx) {
      console.error('Stock chart canvas not found');
      return;
    }

    if (this.allStocks.length === 0) {
      console.warn('No stock data available for chart');
      return;
    }

    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
      '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
    ];
    
    const hoverColors = [
      '#FF5252', '#26A69A', '#2196F3', '#66BB6A', '#FFD54F',
      '#BA68C8', '#4DB6AC', '#FFF176', '#9575CD', '#64B5F6'
    ];

    this.stockChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: this.allStocks.map(stock => stock.name),
        datasets: [{
          data: this.allStocks.map(stock => stock.quantity),
          backgroundColor: colors.slice(0, this.allStocks.length),
          hoverBackgroundColor: hoverColors.slice(0, this.allStocks.length),
          borderColor: '#fff',
          borderWidth: 3,
          hoverBorderWidth: 5,
          hoverBorderColor: '#fff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            top: 10,
            bottom: 10,
            left: 10,
            right: 10
          }
        },
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 15,
              usePointStyle: true,
              boxWidth: 12
            }
          },
          tooltip: {
            callbacks: {
              label: (context: any) => {
                const label = context.label || '';
                const value = context.parsed;
                const total = (context.dataset.data as number[]).reduce((a, b) => a + b, 0);
                const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
                return `${label}: ${value} units (${percentage}%)`;
              }
            }
          }
        },
        cutout: 0,
        animation: {
          animateRotate: true,
          animateScale: true,
          duration: 1200
        },
        interaction: {
          intersect: false,
          mode: 'point'
        }
      }
    });
  }

  createLowStockChart() {
    if (this.lowStockChart) {
      this.lowStockChart.destroy();
    }

    const ctx = document.getElementById('lowStockChart') as HTMLCanvasElement;
    if (!ctx) {
      console.error('Low stock chart canvas not found');
      return;
    }

    if (this.lowStocks.length === 0) {
      // Show "No low stock items" message
      this.lowStockChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['No Low Stock Items'],
          datasets: [{
            data: [1],
            backgroundColor: ['#27AE60'],
            borderColor: '#fff',
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                padding: 20,
                usePointStyle: true
              }
            }
          },
          cutout: '50%'
        }
      });
      return;
    }

    const alertColors = [
      '#FF6B6B', '#FF8E53', '#FF6348', '#FFA502', '#FF7675',
      '#FD79A8', '#FDCB6E', '#E17055', '#D63031', '#E84393'
    ];
    
    const hoverColors = [
      '#FF5252', '#FF7043', '#F44336', '#FF9800', '#F44336',
      '#E91E63', '#FFC107', '#D84315', '#C62828', '#AD1457'
    ];

    this.lowStockChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: this.lowStocks.map(stock => stock.name),
        datasets: [{
          data: this.lowStocks.map(stock => stock.quantity),
          backgroundColor: alertColors.slice(0, this.lowStocks.length),
          hoverBackgroundColor: hoverColors.slice(0, this.lowStocks.length),
          borderColor: '#fff',
          borderWidth: 3,
          hoverBorderWidth: 5,
          hoverBorderColor: '#fff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            top: 10,
            bottom: 10,
            left: 10,
            right: 10
          }
        },
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 15,
              usePointStyle: true,
              boxWidth: 12
            }
          },
          tooltip: {
            callbacks: {
              label: (context: any) => {
                const label = context.label || '';
                const value = context.parsed;
                return `${label}: ${value} units remaining`;
              }
            }
          }
        },
        cutout: 0,
        animation: {
          animateRotate: true,
          animateScale: true,
          duration: 1500
        },
        interaction: {
          intersect: false
        }
      }
    });
  }
}
