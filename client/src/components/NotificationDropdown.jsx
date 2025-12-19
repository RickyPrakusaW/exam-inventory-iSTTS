import React, { useState, useRef, useEffect } from 'react';
import { Bell, X, ChevronRight } from 'lucide-react';

const NotificationDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            message: 'Upload Soal UAS Matematika telah selesai',
            time: '2 hari yang lalu',
            isNew: true
        },
        {
            id: 2,
            message: 'Informasi Ujian Tengah Semester telah diupload',
            time: '3 hari yang lalu',
            isNew: true
        },
        {
            id: 3,
            message: 'upload UTS Basis Data diundur menjadi 10 Desember 2025',
            time: '6 hari yang lalu',
            isNew: true
        }
    ]);
    const dropdownRef = useRef(null);

    const unreadCount = notifications.filter(n => n.isNew).length;

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

    const handleMarkAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, isNew: false })));
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
                            <h3 className="text-base lg:text-sm font-bold text-gray-800">Notifikasi</h3>
                            {unreadCount > 0 && (
                                <button
                                    onClick={handleMarkAllAsRead}
                                    className="text-xs font-bold text-rose-600 hover:text-rose-700 transition-colors active:scale-95"
                                >
                                    Mark all as read
                                </button>
                            )}
                        </div>

                        {/* Notifications List */}
                        <div className="flex-1 overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="p-8 lg:p-8 text-center text-gray-400">
                                    <Bell size={48} className="mx-auto mb-3 opacity-20" />
                                    <p className="text-sm">Tidak ada notifikasi</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-50">
                                    {notifications.map((notification) => (
                                        <div
                                            key={notification.id}
                                            className="px-4 py-3.5 lg:px-5 lg:py-4 hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer group touch-manipulation"
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm lg:text-sm text-gray-800 leading-relaxed group-hover:text-gray-900">
                                                        {notification.message}
                                                    </p>
                                                    <p className="text-xs text-gray-400 mt-1.5">
                                                        {notification.time}
                                                    </p>
                                                </div>
                                                {notification.isNew && (
                                                    <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wide shrink-0">
                                                        NEW
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {notifications.length > 0 && (
                            <div className="px-4 py-3 lg:px-5 lg:py-3 border-t border-gray-100 bg-rose-50 shrink-0">
                                <button className="w-full flex items-center justify-center gap-2 text-sm font-bold text-gray-800 hover:text-rose-600 active:scale-95 transition-all py-2.5 lg:py-2 touch-manipulation">
                                    View All
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default NotificationDropdown;

