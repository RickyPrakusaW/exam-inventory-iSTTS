import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { BookOpen, Menu, User as UserIcon, Bell, Settings } from 'lucide-react';
import AdminSidebar from './AdminSidebar';

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="h-screen bg-gray-50 flex flex-col overflow-hidden text-gray-900">
            {/* Navbar */}
            <nav className="bg-white shadow-sm border-b border-gray-100 shrink-0 z-50">
                <div className="px-4 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {/* Mobile Toggle */}
                        <button 
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2 hover:bg-gray-100 rounded-lg lg:hidden"
                        >
                            <Menu size={22} className="text-gray-600" />
                        </button>

                        <Link to="/admin" className="flex items-center gap-2.5 text-xl font-bold text-rose-600">
                            <div className="bg-rose-600 p-1.5 rounded-lg">
                                <BookOpen className="w-5 h-5 text-white" />
                            </div>
                            <span className="hidden sm:inline tracking-tight text-gray-800">
                                <span className="text-rose-600">Admin</span> Bank Soal
                            </span>
                        </Link>
                    </div>

                    <div className="flex items-center gap-3 md:gap-6">
                        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-rose-50 rounded-full">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider">System Live</span>
                        </div>

                        <button className="p-2 text-gray-400 hover:text-rose-600 transition-colors relative">
                            <Bell size={22} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
                        </button>
                        
                        <div className="h-8 w-[1px] bg-gray-200 mx-2 hidden sm:block"></div>

                        <div className="flex items-center gap-3 cursor-pointer group">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-gray-800 group-hover:text-rose-600 transition-colors">Administrator</p>
                                <p className="text-[11px] text-gray-400 font-medium uppercase">Super Admin</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-all">
                                <Settings size={20} />
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="flex flex-1 min-h-0">
                {/* Sidebar */}
                <AdminSidebar 
                    isOpen={isSidebarOpen} 
                    onClose={() => setIsSidebarOpen(false)} 
                />

                {/* Main Content */}
                <main className="flex-1 p-4 lg:p-8 overflow-y-auto h-full">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;

