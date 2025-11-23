import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Welcome from './Pages/Welcome';
import JanjiTemu from './Pages/JanjiTemu';
import Peminjaman from './Pages/Peminjaman';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;


