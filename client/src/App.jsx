import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
        {/* Navbar should probably not be visible on Login page, but for now let's keep it simple or conditionally render */}
        {/* Actually, the Login page has its own layout (min-h-screen), so maybe we should route it without the main layout */}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <>
              <Navbar />
              <main className="container mx-auto px-4 py-8">
                <Home />
              </main>
            </>
          } />
          <Route path="/admin" element={
            <>
              <Navbar />
              <main className="container mx-auto px-4 py-8">
                <AdminDashboard />
              </main>
            </>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
