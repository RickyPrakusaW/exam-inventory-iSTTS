import React, { useState, useRef, useEffect } from 'react';
import { Bell, ChevronRight, FileText } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const NotificationDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [reports, setReports] = useState([]);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    const fetchReports = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/laporan');
            if (response.ok) {
                const data = await response.json();
                // Filter only pending reports for notification
                const pendingReports = data.filter(r => r.status === 'pending');
                setReports(pendingReports);
            }
        } catch (error) {
            console.error('Error fetching reports:', error);
        }
    };

    useEffect(() => {
        fetchReports();
        // Poll every 30 seconds for new reports
        const interval = setInterval(fetchReports, 30000);
        return () => clearInterval(interval);
    }, []);

    const unreadCount = reports.length;

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleNavigate = () => {
        setIsOpen(false);
        navigate('/admin/laporan');
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-gray-400 hover:text-rose-600 active:scale-95 transition-all relative touch-manipulation"
                aria-label="Notifications"
            >
                <Bell size={22} className="w-5 h-5 lg:w-[22px] lg:h-[22px]" />
                {unreadCount > 0 && (
                    <span className="absolute top-0.5 right-0.5 lg:top-1 lg:right-1 min-w-[18px] h-[18px] bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1.5 border-2 border-white">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown Panel */}
            {isOpen && (
                <>
                    {/* Mobile Overlay */}
                    <div 
                        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
                        onClick={() => setIsOpen(false)}
                    />
                    
                    {/* Dropdown Panel - Mobile First */}
                    <div className="fixed inset-x-4 top-20 bottom-4 lg:absolute lg:right-0 lg:top-12 lg:inset-x-auto lg:bottom-auto lg:w-[380px] bg-white rounded-2xl lg:rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden flex flex-col">
                        {/* Header */}
                        <div className="px-4 py-3.5 lg:px-5 lg:py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50 shrink-0">
                            <h3 className="text-base lg:text-sm font-bold text-gray-800">Laporan Masuk</h3>
                            <button
                                onClick={handleNavigate}
                                className="text-xs font-bold text-rose-600 hover:text-rose-700 transition-colors active:scale-95"
                            >
                                Lihat Semua
                            </button>
                        </div>

                        {/* Notifications List */}
                        <div className="flex-1 overflow-y-auto">
                            {reports.length === 0 ? (
                                <div className="p-8 lg:p-8 text-center text-gray-400">
                                    <Bell size={48} className="mx-auto mb-3 opacity-20" />
                                    <p className="text-sm">Tidak ada laporan baru</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-50">
                                    {reports.map((report) => (
                                        <div
                                            key={report.id}
                                            onClick={handleNavigate}
                                            className="px-4 py-3.5 lg:px-5 lg:py-4 hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer group touch-manipulation"
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm lg:text-sm text-gray-800 leading-relaxed group-hover:text-gray-900 font-medium">
                                                        {report.Soal?.Matkul?.name || 'Unknown Subject'}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {report.reason}
                                                    </p>
                                                    <p className="text-[10px] text-gray-400 mt-1.5 flex items-center gap-1">
                                                        <FileText size={10} />
                                                        {report.Soal?.code || 'No Code'} • {new Date(report.createdAt).toLocaleDateString('id-ID')}
                                                    </p>
                                                </div>
                                                <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wide shrink-0 bg-rose-50 px-2 py-1 rounded-full">
                                                    {report.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="px-4 py-3 lg:px-5 lg:py-3 border-t border-gray-100 bg-rose-50 shrink-0">
                            <button 
                                onClick={handleNavigate}
                                className="w-full flex items-center justify-center gap-2 text-sm font-bold text-gray-800 hover:text-rose-600 active:scale-95 transition-all py-2.5 lg:py-2 touch-manipulation"
                            >
                                Lihat Semua Laporan
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default NotificationDropdown;

