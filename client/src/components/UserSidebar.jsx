import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Newspaper, Search, Bookmark, History, TrendingUp, X, LogOut, BookOpen } from 'lucide-react';

const UserSidebar = ({ isOpen, onClose }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('userRole');
        navigate('/');
    };

    const menuItems = [
        { name: 'Beranda', icon: <Home size={22} />, path: '/home' },
        { name: 'Informasi & Berita', icon: <Newspaper size={22} />, path: '/news' },
        { name: 'Pencarian Soal', icon: <Search size={22} />, path: '/search' },
        { name: 'Perpustakaan Pribadi', icon: <Bookmark size={22} />, path: '/library' },
        { name: 'Riwayat Unduhan', icon: <History size={22} />, path: '/history' },
        { name: 'Progres Belajar', icon: <TrendingUp size={22} />, path: '/progress' },
    ];

    return (
        <>
            {/* Overlay for mobile */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed top-0 left-0 bottom-0 w-72 bg-white border-r border-gray-100 z-50 transition-transform duration-300 ease-in-out overflow-y-auto
                lg:translate-x-0 lg:static lg:h-full shrink-0
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="p-6">
                    <div className="flex items-center justify-between mb-8 lg:hidden">
                        <span className="font-bold text-gray-800">Menu</span>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="mb-4">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-4 mb-4">
                            Menu Mahasiswa
                        </h3>
                        <nav className="space-y-1">
                            {menuItems.map((item) => {
                                const isActive = location.pathname === item.path;
                                return (
                                    <Link
                                        key={item.name}
                                        to={item.path}
                                        className={`
                                            flex items-center gap-4 px-4 py-3.5 rounded-xl font-medium transition-all duration-200
                                            ${isActive 
                                                ? 'bg-rose-50 text-rose-600' 
                                                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                                            }
                                        `}
                                    >
                                        <span className={`${isActive ? 'text-rose-600' : 'text-gray-400'}`}>
                                            {item.icon}
                                        </span>
                                        <span className="text-[15px]">{item.name}</span>
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Footer Section: Logout & Copyright positioned directly below menu */}
                    <div className="pt-4 mt-4 border-t border-gray-50">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl font-medium text-gray-500 hover:bg-rose-50 hover:text-rose-600 transition-all duration-200 group"
                        >
                            <span className="text-gray-400 group-hover:text-rose-600">
                                <LogOut size={22} />
                            </span>
                            <span className="text-[15px]">Sign out</span>
                        </button>
                        
                        <div className="mt-4 px-4">
                            <p className="text-xs text-gray-400 font-medium">
                                &copy; {new Date().getFullYear()} Bank Soal iSTTS
                            </p>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default UserSidebar;

