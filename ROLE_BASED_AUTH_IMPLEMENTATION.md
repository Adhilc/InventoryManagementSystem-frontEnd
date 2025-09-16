# Role-Based Authentication Implementation

## Overview
This implementation adds JWT token-based role authentication with separate navigation bars for Admin and User roles.

## Key Features

### 1. JWT Token Handling
- **AuthService Enhanced**: Added JWT token decoding and role extraction
- **Token Storage**: JWT tokens stored in localStorage
- **Role Detection**: Automatic role detection from JWT payload
- **User State Management**: Observable-based user state tracking

### 2. Role-Based Navigation
- **AdminNavComponent**: Full access navigation (Dashboard, Products, Orders, Suppliers, Stock Management)
- **UserNavComponent**: Limited access navigation (Products, Orders, Dashboard only)
- **RoleNavComponent**: Wrapper that displays appropriate navigation based on user role

### 3. Permission System
- **Admin Role**: Full access to all features
- **User Role**: Limited to 3 permissions:
  - View Products (can order but not edit/delete)
  - View/Create Orders (cannot update status or view all orders)
  - View Dashboard

### 4. Route Protection
- **AuthGuard**: Protects routes requiring authentication
- **AdminGuard**: Restricts admin-only routes (Suppliers, Stock Management)
- **UserGuard**: General user access guard

### 5. UI Restrictions
- **Order Management**: 
  - Users can create orders and search by order ID
  - Only admins can update order status, search by customer ID, and view all orders
- **Product Management**:
  - Users can view products and place orders
  - Only admins can add, edit, or delete products
- **Navigation**: Role-specific navigation bars with different styling

## Implementation Details

### Files Modified/Created:

#### New Files:
- `src/app/navigation/admin-nav.ts` - Admin navigation component
- `src/app/navigation/user-nav.ts` - User navigation component  
- `src/app/navigation/role-nav.ts` - Role-based navigation wrapper
- `src/app/guards/auth.guard.ts` - Authentication guards
- `ROLE_BASED_AUTH_IMPLEMENTATION.md` - This documentation

#### Modified Files:
- `src/app/services/auth.service.ts` - Enhanced with JWT decoding and role management
- `src/app/order/order.ts` - Added role-based permissions and navigation
- `src/app/order/order.html` - Added role restrictions to UI elements
- `src/app/products/products.ts` - Added role-based restrictions
- `src/app/products/products.html` - Limited admin-only actions
- `src/app/login/login.ts` - Role-based redirect after login
- `src/app/dashboard/dashboard.ts` - Updated to use role navigation
- `src/app/dashboard/dashboard.html` - Updated navigation component
- `src/app/app.routes.ts` - Added route guards
- `src/app/services/order.service.ts` - Updated to use API Gateway
- `src/app/services/product-service.ts` - Updated to use API Gateway
- `proxy.conf.json` - Updated proxy configuration for API Gateway

## API Gateway Integration
- All services now route through API Gateway on port 1016
- Proxy configuration updated to handle authentication and service routing
- JWT tokens automatically included in requests via interceptor

## User Experience

### Admin Users:
- Dark navigation bar with full menu access
- Can perform all CRUD operations
- Access to all management features
- Redirected to dashboard after login

### Regular Users:
- Blue navigation bar with limited menu
- Can view products and place orders
- Cannot modify products or access admin features
- Redirected to products page after login

## Security Features
- JWT token validation
- Role-based route protection
- UI element visibility based on permissions
- Automatic logout on token expiration
- Secure API Gateway routing

## Usage Instructions
1. Start the API Gateway on port 1016
2. Start the Angular application with `ng serve`
3. Login with appropriate credentials
4. Navigation and features will be automatically restricted based on user role

## Testing
- Test with both admin and user accounts
- Verify navigation restrictions
- Confirm API calls route through gateway
- Validate JWT token handling and role extraction