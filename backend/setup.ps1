# DigiTamu TIK - Backend Setup Script
# Run this script from the backend directory

Write-Host "=== DigiTamu TIK Backend Setup ===" -ForegroundColor Cyan
Write-Host ""

# Check if .env exists
if (-not (Test-Path ".env")) {
    Write-Host "Copying .env.example to .env..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
}

# Install Composer dependencies
Write-Host "Installing Composer dependencies..." -ForegroundColor Yellow
composer install

# Generate app key if not set
Write-Host "Generating application key..." -ForegroundColor Yellow
php artisan key:generate

# Create storage link
Write-Host "Creating storage link..." -ForegroundColor Yellow
php artisan storage:link

# Database setup
Write-Host ""
Write-Host "=== Database Setup ===" -ForegroundColor Cyan
$dbSetup = Read-Host "Do you want to run migrations? (y/n)"

if ($dbSetup -eq "y") {
    Write-Host "Running migrations..." -ForegroundColor Yellow
    php artisan migrate
    
    Write-Host ""
    Write-Host "Database setup complete!" -ForegroundColor Green
}

Write-Host ""
Write-Host "=== Setup Complete! ===" -ForegroundColor Green
Write-Host ""
Write-Host "To start the development server, run:" -ForegroundColor Cyan
Write-Host "  php artisan serve" -ForegroundColor White
Write-Host ""
Write-Host "Backend will be available at: http://localhost:8000" -ForegroundColor Yellow
