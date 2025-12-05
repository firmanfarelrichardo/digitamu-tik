import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Welcome from './Pages/Welcome';
import JanjiTemu from './Pages/JanjiTemu';
import Peminjaman from './Pages/Peminjaman';

// Auth Pages
import Login from './Pages/Auth/Login';

// Admin Pages
import Dashboard from './Pages/Admin/Dashboard';
import ManajemenStaff from './Pages/Admin/ManajemenStaff';
import LaporanData from './Pages/Admin/LaporanData';

// Staff Pages
import StaffDashboard from './Pages/Staff/Dashboard';
import VerifikasiPermohonan from './Pages/Staff/VerifikasiPermohonan';
import RiwayatTamu from './Pages/Staff/RiwayatTamu';
import RiwayatPeminjaman from './Pages/Staff/RiwayatPeminjaman';

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Guest Routes */}
        <Route path="/" element={<Welcome />} />
        <Route path="/janji-temu" element={<JanjiTemu staffOptions={[
          'Kepala UPT TIK',
          'Staff IT Support',
          'Staff Jaringan',
          'Staff Multimedia',
          'Staff Administrasi',
        ]} />} />
        <Route path="/peminjaman" element={<Peminjaman fasilitasOptions={[
          'Ruang Multimedia',
          'Ruang Meeting',
          'Proyektor',
          'Laptop',
          'Kamera',
          'Tripod',
          'Microphone',
          'Sound System',
          'LED Screen',
        ]} />} />

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/manajemen-staff" element={<ManajemenStaff />} />
        <Route path="/admin/laporan" element={<LaporanData />} />

        {/* Staff Routes */}
        <Route path="/staff" element={<StaffDashboard />} />
        <Route path="/staff/verifikasi" element={<VerifikasiPermohonan />} />
        <Route path="/staff/riwayat" element={<RiwayatTamu />} />
        <Route path="/staff/riwayat-peminjaman" element={<RiwayatPeminjaman />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;


