# DigiTamu TIK - Quick Reference Card

## 🚀 Start Development Servers

### Terminal 1 - Backend (Laravel)
```powershell
cd backend
php artisan serve
```
**URL:** http://localhost:8000

### Terminal 2 - Frontend (React)
```powershell
cd frontend
npm run dev
```
**URL:** http://localhost:5173

---

## 📊 Database Commands

### Create Database
```sql
CREATE DATABASE digitamutik;
```

### Run Migrations
```powershell
cd backend
php artisan migrate
```

### Fresh Migration (Reset)
```powershell
php artisan migrate:fresh
```

### Check Database
```sql
-- List all tables
\dt

-- View data
SELECT * FROM tamu;
SELECT * FROM kunjungan;
SELECT * FROM peminjaman;
SELECT * FROM berkas;
```

---

## 🌐 Routes Reference

| URL | Method | Purpose |
|-----|--------|---------|
| `/` | GET | Landing Page |
| `/janji-temu` | GET | Appointment Form |
| `/janji-temu` | POST | Submit Appointment |
| `/peminjaman` | GET | Loan Form |
| `/peminjaman` | POST | Submit Loan Request |

---

## 📁 Key Files

### Backend
```
app/Http/Controllers/GuestController.php
app/Models/{Tamu,Kunjungan,Peminjaman,Berkas}.php
app/Http/Requests/{StoreJanjiTemuRequest,StorePeminjamanRequest}.php
routes/web.php
```

### Frontend
```
src/Pages/{Welcome,JanjiTemu,Peminjaman}.jsx
src/Layouts/GuestLayout.jsx
src/Components/{TextInput,SelectInput,FileInput,...}.jsx
```

---

## 🎨 Tailwind Classes

### Colors
- `bg-blue-400` - Header, Primary buttons
- `bg-green-500` - Loan card theme
- `bg-gray-900` - Footer
- `bg-gray-100` - Page background

### Layout
- `max-w-2xl mx-auto` - Centered forms
- `grid grid-cols-1 md:grid-cols-2` - Responsive grid
- `rounded-xl shadow-lg` - Card styling

---

## 🔍 Testing Scenarios

### Test 1: New Guest Appointment
```
Email: newuser@example.com
Expected: New tamu record created
```

### Test 2: Existing Guest Appointment
```
Email: (same as Test 1)
Expected: Reuse existing tamu, update name if changed
```

### Test 3: Facility Loan with File
```
File: Upload PDF < 2MB
Expected: File saved in storage/app/public/surat-pengantar/
```

---

## ⚠️ Common Issues

### Issue: Migration fails with enum error
**Solution:**
```powershell
php artisan migrate:fresh
```

### Issue: File upload not working
**Solution:**
```powershell
php artisan storage:link
```

### Issue: Vite can't connect to backend
**Solution:** Check both servers are running on ports 8000 and 5173

### Issue: CSRF token mismatch
**Solution:** Ensure HandleInertiaRequests middleware is enabled

---

## 📦 Package Versions

### Backend
- Laravel: 11.x
- Inertia Laravel: ^2.0
- PHP: 8.2+

### Frontend
- React: 18.x
- @inertiajs/react: ^1.0
- Vite: 6.x
- Tailwind CSS: 4.x

---

## 🛠️ Useful Artisan Commands

```powershell
# Clear cache
php artisan cache:clear
php artisan config:clear
php artisan route:clear

# View routes
php artisan route:list

# Database
php artisan db:show
php artisan migrate:status

# Storage
php artisan storage:link
```

---

## 📧 Form Field Reference

### Appointment (Janji Temu)
- nama: string(100), required
- email: email(100), required
- no_telp: string(20), optional
- bertemu_siapa: string(200), required
- waktu_janji_temu: datetime, required, future
- topik_diskusi: text, required

### Facility Loan (Peminjaman)
- nama: string(100), required
- email: email(100), required
- instansi: string(150), required
- fasilitas: string(200), required
- detail_kebutuhan: text, optional
- tanggal_mulai: date, required, future
- tanggal_selesai: date, required, after:tanggal_mulai
- surat_pengantar: file, required, mimes:pdf,jpg,jpeg,png, max:2048

---

## 🎯 Status Values

### Kunjungan Status
- `menunggu` - Waiting for approval
- `disetujui` - Approved
- `ditolak` - Rejected
- `selesai` - Completed

### Peminjaman Status
- `diajukan` - Submitted
- `disetujui` - Approved
- `ditolak` - Rejected
- `selesai` - Returned

---

## 💡 Quick Tips

1. **Always run both servers** (backend + frontend)
2. **Check database connection** before migrations
3. **Clear browser cache** if Inertia not updating
4. **Use PostgreSQL UUID extension** (enabled by default)
5. **Test file uploads** with files < 2MB
6. **Check storage permissions** if file upload fails

---

**Need Help?** Check IMPLEMENTATION_GUIDE.md or PROJECT_SUMMARY.md
