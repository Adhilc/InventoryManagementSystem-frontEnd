export interface OrderReportSent {
  productId: number;
  date: string;
  quantity: number;
}

export interface OrderReport {
  startDate: string;
  endDate: string;
}