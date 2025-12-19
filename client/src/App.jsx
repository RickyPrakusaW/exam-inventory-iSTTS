import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import UserLayout from './components/UserLayout';
import AdminLayout from './components/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import ManajemenSoal from './pages/admin/ManajemenSoal';
import DataMaster from './pages/admin/DataMaster';
import LaporanMahasiswa from './pages/admin/LaporanMahasiswa';
import ManajemenBerita from './pages/admin/ManajemenBerita';
import EksporData from './pages/admin/EksporData';
import InformasiBerita from './pages/InformasiBerita';
import PencarianSoal from './pages/PencarianSoal';
import PerpustakaanPribadi from './pages/PerpustakaanPribadi';
import RiwayatUnduhan from './pages/RiwayatUnduhan';
import ProgresBelajar from './pages/ProgresBelajar';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
        <Routes>
          <Route path="/" element={<Login />} />
          
          {/* User Routes protected for 'user' role */}
          <Route element={<ProtectedRoute allowedRoles={['user']} />}>
            <Route element={<UserLayout />}>
              <Route path="/home" element={<Home />} />
              <Route path="/news" element={<InformasiBerita />} />
              <Route path="/search" element={<PencarianSoal />} />
              <Route path="/library" element={<PerpustakaanPribadi />} />
              <Route path="/history" element={<RiwayatUnduhan />} />
              <Route path="/progress" element={<ProgresBelajar />} />
            </Route>
          </Route>

          {/* Admin Routes protected for 'admin' role */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/soal" element={<ManajemenSoal />} />
              <Route path="/admin/master" element={<DataMaster />} />
              <Route path="/admin/laporan" element={<LaporanMahasiswa />} />
              <Route path="/admin/berita" element={<ManajemenBerita />} />
              <Route path="/admin/ekspor" element={<EksporData />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
