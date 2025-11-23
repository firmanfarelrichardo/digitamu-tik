# 🎉 DigiTamu TIK - Guest Side Implementation

> Web Framework Course Project - Digital Guest Management System for UPT TIK Universitas Lampung

## ✅ Implementation Status: COMPLETE

All guest-side functionality has been successfully implemented following clean code principles and exact requirements.

---

## 🚀 Quick Start

### Prerequisites
- PHP 8.2+, Composer
- Node.js 18+, NPM
- PostgreSQL 14+

### Setup & Run

**Backend:**
```powershell
cd backend
.\setup.ps1          # Or: composer install, php artisan migrate, etc.
php artisan serve    # http://localhost:8000
```

**Frontend:**
```powershell
cd frontend
.\setup.ps1          # Or: npm install
npm run dev          # http://localhost:5173
```

**Access:** Open http://localhost:5173 in your browser

---

## 📦 What's Included

### Backend (Laravel 11 + Inertia.js)
- ✅ 5 PostgreSQL migrations (UUID + ENUMs)
- ✅ 4 Eloquent models with relationships
- ✅ 2 Form Request validation classes
- ✅ GuestController with transaction safety
- ✅ Route configuration (5 routes)

### Frontend (React 18 + Vite + Tailwind)
- ✅ 7 Reusable form components
- ✅ GuestLayout (Header, Footer, Background)
- ✅ 3 Pages (Landing, Appointment, Loan)
- ✅ Inertia.js integration

### Features
- ✅ Smart guest handling (email-based)
- ✅ Database transactions
- ✅ File upload (PDF/JPG/PNG)
- ✅ Form validation
- ✅ Responsive design
- ✅ UI matches requirements

---

## 📚 Documentation

| File | Description |
|------|-------------|
| **IMPLEMENTATION_GUIDE.md** | Complete setup instructions & troubleshooting |
| **PROJECT_SUMMARY.md** | Technical overview, architecture, flows |
| **QUICK_REFERENCE.md** | Commands, routes, common issues |

---

## 🎯 Main Routes

- `/` - Landing Page
- `/janji-temu` - Appointment Booking
- `/peminjaman` - Facility Loan Request

---

## 🗄️ Database Schema

PostgreSQL with:
- UUID primary keys (`gen_random_uuid()`)
- Custom ENUM types (status fields)
- Foreign key relationships
- Cascade deletes

Tables: `tamu`, `kunjungan`, `peminjaman`, `berkas`

---

## 🎨 Tech Stack

- **Backend:** Laravel 11, PostgreSQL, Inertia.js
- **Frontend:** React 18, Vite, Tailwind CSS v4
- **Patterns:** Clean Code, SOLID, DRY

---

## 📸 Pages Implemented

1. **Landing Page** - Hero section, service cards, info section
2. **Appointment Form** - Guest info, staff selection, datetime picker
3. **Facility Loan** - Borrower info, facility selection, file upload

---

## 🧪 Testing

```powershell
# Create database
psql -U postgres -c "CREATE DATABASE digitamutik;"

# Run migrations
cd backend
php artisan migrate

# Start servers
php artisan serve  # Terminal 1
npm run dev        # Terminal 2 (in frontend/)

# Test in browser
http://localhost:5173
```

---

## 📝 Notes

- **NO Blade templates** - Pure Inertia.js
- **Transaction safety** - File uploads rollback on error
- **Email-based guests** - No duplicates, auto-update
- **Production-ready** - All validations & error handling

---

## 🎓 Course Project

**Course:** Web Framework  
**Institution:** Universitas Lampung  
**Project:** DigiTamu TIK - Guest Management System  
**Scope:** Guest Side (Sisi Tamu)

---

## 📞 Support

Check the documentation files for detailed help:
- Setup issues → IMPLEMENTATION_GUIDE.md
- Architecture questions → PROJECT_SUMMARY.md
- Quick commands → QUICK_REFERENCE.md

---

**Status:** ✅ Ready for Deployment  
**Version:** 1.0.0  
**Last Updated:** November 24, 2025

