# Order Management Frontend Setup

## Prerequisites
1. Ensure your backend Order Management service is running on port 8081
2. Node.js and Angular CLI installed

## Running the Application

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
ng serve
```

3. Open browser and navigate to `http://localhost:4200`

## Features

### Create Order
- Enter Product ID and Quantity
- Creates order with current customer ID (hardcoded for demo)

### Search Orders
- **By Order ID**: Find specific order by ID
- **By Customer ID**: Get all orders for a customer
- **By Date Range**: Get orders within date range

### Update Order Status
- Change order status to: PENDING, ACCEPTED, DELIVERED, CANCELLED

## Backend API Endpoints Used
- POST `/api/order/save` - Create new order
- GET `/api/order/getByOrderId/{id}` - Get order by ID
- GET `/api/order/getByCustomerId/{id}` - Get orders by customer ID
- POST `/api/order/getByDate` - Get orders by date range
- POST `/api/order/updateStatus/{orderId}/{status}` - Update order status

## Notes
- Backend must be running on localhost:8081
- Customer ID is hardcoded as 1 for order creation (modify in component if needed)
- All API calls include proper error handling
- Bootstrap styling included for responsive design