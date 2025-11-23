# DigiTamu TIK - Guest Side Documentation

## Project Overview
DigiTamu is a digital guest management system for UPT TIK Universitas Lampung. This implementation covers the **Guest Side** functionality including appointment booking and facility loan requests.

## Tech Stack
- **Backend**: Laravel 11 with Inertia.js
- **Frontend**: React + Vite + Tailwind CSS
- **Database**: PostgreSQL (with UUIDs and ENUMs)

## Features Implemented

### 1. Landing Page (`/`)
- Hero section with welcome message
- Two main service cards:
  - Janji Temu Online (Appointment Booking)
  - Peminjaman Fasilitas (Facility Loan)
- Service information section (Hours, Services, Help Center)
- Responsive design with topographic background pattern

### 2. Appointment Form (`/janji-temu`)
- Guest information input (Name, Email, Phone)
- Staff selection dropdown
- Date & time picker for appointment
- Discussion topic textarea
- Automatic guest handling (find or create by email)
- Form validation with error messages

### 3. Facility Loan Form (`/peminjaman`)
- Borrower information (Name, Email, Institution)
- Facility selection dropdown
- Date range picker (Start - End)
- Detail requirements textarea
- File upload for supporting letter (PDF, JPG, PNG - max 2MB)
- Transaction-based submission with rollback on failure

## Database Schema

The system uses PostgreSQL with the following structure:

### ENUMs
```sql
- peran_pengguna: ('admin', 'staff')
- status_kunjungan: ('menunggu', 'disetujui', 'ditolak', 'selesai')
- status_peminjaman: ('diajukan', 'disetujui', 'ditolak', 'selesai')
```

### Tables
1. **tamu** - Guest master data (UUID primary key)
2. **kunjungan** - Visit/appointment records
3. **peminjaman** - Facility loan requests
4. **berkas** - Uploaded document files

## Setup Instructions

### Prerequisites
- PHP 8.2+
- Composer
- Node.js 18+
- PostgreSQL 14+
- Laragon or similar local development environment

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install PHP dependencies:
```bash
composer install
```

3. Configure environment (`.env` already set for PostgreSQL):
```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=digitamutik
DB_USERNAME=postgres
DB_PASSWORD=postgres
```

4. Create the database:
```sql
CREATE DATABASE digitamutik;
```

5. Run migrations:
```bash
php artisan migrate
```

6. Create storage link for file uploads:
```bash
php artisan storage:link
```

7. Start Laravel development server:
```bash
php artisan serve
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install Node dependencies:
```bash
npm install
```

3. Install additional Inertia packages if not present:
```bash
npm install @inertiajs/react
```

4. Start Vite development server:
```bash
npm run dev
```

### Accessing the Application

- Frontend URL: `http://localhost:5173` (Vite dev server)
- Backend URL: `http://localhost:8000` (Laravel server)
- The Inertia.js integration connects them seamlessly

## Project Structure

### Backend (`/backend`)
```
app/
├── Http/
│   ├── Controllers/
│   │   └── GuestController.php      # Main guest-side logic
│   ├── Middleware/
│   │   └── HandleInertiaRequests.php # Inertia config
│   └── Requests/
│       ├── StoreJanjiTemuRequest.php
│       └── StorePeminjamanRequest.php
├── Models/
│   ├── Tamu.php
│   ├── Kunjungan.php
│   ├── Peminjaman.php
│   └── Berkas.php
database/
└── migrations/
    ├── 2024_01_01_000001_create_enums.php
    ├── 2024_01_01_000002_create_tamu_table.php
    ├── 2024_01_01_000003_create_kunjungan_table.php
    ├── 2024_01_01_000004_create_peminjaman_table.php
    └── 2024_01_01_000005_create_berkas_table.php
routes/
└── web.php                           # Guest routes
```

### Frontend (`/frontend`)
```
src/
├── Components/
│   ├── InputLabel.jsx
│   ├── TextInput.jsx
│   ├── TextArea.jsx
│   ├── SelectInput.jsx
│   ├── FileInput.jsx
│   ├── PrimaryButton.jsx
│   └── InputError.jsx
├── Layouts/
│   └── GuestLayout.jsx              # Main layout with header/footer
├── Pages/
│   ├── Welcome.jsx                  # Landing page
│   ├── JanjiTemu.jsx                # Appointment form
│   └── Peminjaman.jsx               # Facility loan form
├── App.jsx                          # Inertia setup
└── main.jsx                         # Entry point
```

## Key Implementation Details

### Guest Email Logic
The system implements smart guest handling:
- When a form is submitted, the system checks if the email exists
- If email exists: Reuse existing `tamu` record, update info if changed
- If email doesn't exist: Create new `tamu` record
- This prevents duplicate guest entries

### Transaction Safety
All form submissions use `DB::transaction()`:
- If file upload fails, the entire submission is rolled back
- Ensures data integrity across related tables
- No orphaned records in case of errors

### Form Validation
- Strictly typed Request classes handle validation
- Client-side validation with React state management
- Server-side validation with Laravel Form Requests
- User-friendly error messages in Indonesian

### File Upload
- Files stored in `storage/app/public/surat-pengantar/`
- Timestamped filenames prevent conflicts
- Size limit: 2MB
- Allowed formats: PDF, JPG, JPEG, PNG

## Routes

| Method | URL | Controller Method | Description |
|--------|-----|-------------------|-------------|
| GET | `/` | `GuestController@index` | Landing page |
| GET | `/janji-temu` | `GuestController@createJanji` | Show appointment form |
| POST | `/janji-temu` | `GuestController@storeJanji` | Submit appointment |
| GET | `/peminjaman` | `GuestController@createPinjam` | Show loan form |
| POST | `/peminjaman` | `GuestController@storePinjam` | Submit loan request |

## Design System

### Colors
- Primary Blue: `#60A5FA` (bg-blue-400)
- Success Green: `#10B981` (bg-green-500)
- Dark Navy Footer: `#111827` (bg-gray-900)
- Light Background: `#F3F4F6` (bg-gray-100)

### Typography
- Font Family: Figtree (via Bunny Fonts)
- Headings: Font-bold, varying sizes
- Body: Font-normal, text-gray-600/700

### Layout
- Container: Max-width responsive with mx-auto
- Cards: White background, rounded-xl, shadow-lg
- Spacing: Consistent padding (p-4, p-6, p-8)
- Grid: Responsive (grid-cols-1 md:grid-cols-2/3)

## Testing the Application

### Test Appointment Booking
1. Navigate to `/`
2. Click "Buat Jadwal" on first card
3. Fill form:
   - Nama: "Budi Santoso"
   - Email: "budi@example.com"
   - Bertemu Siapa: Select staff
   - Waktu: Pick future date/time
   - Topik: Enter discussion topic
4. Submit and verify success message

### Test Facility Loan
1. Navigate to `/`
2. Click "Ajukan Pinjaman" on second card
3. Fill form:
   - Nama: "Ani Wijaya"
   - Email: "ani@example.com"
   - Instansi: "Fakultas Teknik"
   - Fasilitas: Select facility
   - Tanggal: Pick date range
   - Upload: Attach PDF file
4. Submit and verify success message

### Verify Database
Check PostgreSQL tables:
```sql
SELECT * FROM tamu;
SELECT * FROM kunjungan;
SELECT * FROM peminjaman;
SELECT * FROM berkas;
```

## Next Steps (Admin Side - Not Implemented)

The following features are planned but not yet implemented:
- Admin login/authentication
- Kunjungan approval workflow
- Peminjaman review and approval
- Check-in/check-out tracking
- Dashboard and reporting
- Email notifications

## Troubleshooting

### Migration Errors
If you get enum errors:
```bash
php artisan migrate:fresh
```

### Inertia Not Loading
Ensure both servers are running:
```bash
# Terminal 1 (Backend)
cd backend
php artisan serve

# Terminal 2 (Frontend)
cd frontend
npm run dev
```

### File Upload Errors
Check storage permissions:
```bash
chmod -R 775 storage
php artisan storage:link
```

## Credits
Developed by: Senior Fullstack Developer
Project: DigiTamu TIK - UPT TIK Universitas Lampung
Framework: Laravel 11, React 18, Inertia.js, Tailwind CSS
Database: PostgreSQL with UUID support
