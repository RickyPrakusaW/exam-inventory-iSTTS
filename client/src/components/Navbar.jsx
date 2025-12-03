import { Link } from 'react-router-dom';
import { BookOpen, Upload } from 'lucide-react';

const Navbar = () => {
    return (
        <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 text-xl font-bold text-blue-600">
                    <BookOpen className="w-6 h-6" />
                    <span>Bank Soal iSTTS</span>
                </Link>

                <div className="flex items-center gap-6">
                    <Link to="/" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                        Cari Soal
                    </Link>
                    <Link to="/admin" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                        Dashboard Admin
                    </Link>
                    <Link
                        to="/admin"
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
                    >
                        <Upload className="w-4 h-4" />
                        <span>Upload Soal</span>
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
