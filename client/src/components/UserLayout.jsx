import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { BookOpen, Menu, User as UserIcon } from 'lucide-react';
import UserSidebar from './UserSidebar';
import NotificationDropdown from './NotificationDropdown';

const UserLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
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

                        <Link to="/home" className="flex items-center gap-2.5 text-xl font-bold text-rose-600">
                            <div className="bg-rose-600 p-1.5 rounded-lg">
                                <BookOpen className="w-5 h-5 text-white" />
                            </div>
                            <span className="hidden sm:inline tracking-tight">Bank Soal iSTTS</span>
                        </Link>
                    </div>

                    <div className="flex items-center gap-3 md:gap-6">
                        <NotificationDropdown />
                        
                        <div className="h-8 w-[1px] bg-gray-200 mx-2 hidden sm:block"></div>

                        <div className="flex items-center gap-3 cursor-pointer group">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-gray-800 group-hover:text-rose-600 transition-colors">Mahasiswa iSTTS</p>
                                <p className="text-[11px] text-gray-400 font-medium uppercase">222222222</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-all">
                                <UserIcon size={20} />
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="flex flex-1 min-h-0">
                {/* Sidebar */}
                <UserSidebar 
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

export default UserLayout;
