export interface Product {
  productId: number;
  quantity: number;
}

export interface Order {
  orderId?: number;
  customerId?: number;
  productId?: number;
  quantity?: number;
  orderDate?: string; // ISO date string "yyyy-MM-dd" or timestamp depending on backend
  status?: 'PENDING' | 'ACCEPTED' | 'DELIVERED' | 'CANCELLED' | string;
}

export interface OrderReport {
  startDate: string; // "yyyy-MM-dd"
  endDate: string;   // "yyyy-MM-dd"
}

export interface OrderReportSent {
  orderId?: number;
  customerId?: number;
  productId?: number;
  quantity?: number;
  orderDate?: string;
  status?: string;
}
