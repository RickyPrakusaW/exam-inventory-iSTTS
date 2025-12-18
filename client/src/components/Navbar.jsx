import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Upload, LogOut } from 'lucide-react';

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('userRole');
        navigate('/');
    };

    return (
        <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link to="/admin" className="flex items-center gap-2 text-xl font-bold text-blue-600">
                    <BookOpen className="w-6 h-6" />
                    <span>Bank Soal iSTTS (Admin)</span>
                </Link>

                <div className="flex items-center gap-6">
                    <Link to="/admin" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                        Dashboard
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>Keluar</span>
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
