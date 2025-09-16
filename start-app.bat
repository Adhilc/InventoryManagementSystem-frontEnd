@echo off
echo ========================================
echo    IMS Frontend Application Startup
echo ========================================
echo.
echo This script will start the Angular frontend with proxy configuration
echo Make sure the following services are running:
echo.
echo 1. API Gateway on port 1016
echo 2. Product Management Service
echo 3. Order Management Service  
echo 4. Stock Management Service
echo 5. Supplier Management Service
echo 6. Reporting and Analytics Service
echo.
echo Starting Angular development server...
echo.
ng serve --proxy-config proxy.conf.json --host 0.0.0.0 --port 4200
pause