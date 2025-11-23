# DigiTamu TIK - Frontend Setup Script
# Run this script from the frontend directory

Write-Host "=== DigiTamu TIK Frontend Setup ===" -ForegroundColor Cyan
Write-Host ""

# Install NPM dependencies
Write-Host "Installing NPM dependencies..." -ForegroundColor Yellow
npm install

# Check for Inertia
Write-Host "Checking Inertia.js installation..." -ForegroundColor Yellow
$inertiaCheck = npm list @inertiajs/react 2>$null

if ($LASTEXITCODE -ne 0) {
    Write-Host "Installing @inertiajs/react..." -ForegroundColor Yellow
    npm install @inertiajs/react
}

Write-Host ""
Write-Host "=== Setup Complete! ===" -ForegroundColor Green
Write-Host ""
Write-Host "To start the development server, run:" -ForegroundColor Cyan
Write-Host "  npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "Frontend will be available at: http://localhost:5173" -ForegroundColor Yellow
Write-Host ""
Write-Host "Make sure the Laravel backend is running at http://localhost:8000" -ForegroundColor Yellow
