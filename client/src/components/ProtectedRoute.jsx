import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const userRole = localStorage.getItem('userRole');

    if (!isAuthenticated) {
        // Jika belum login, tendang ke halaman login
        return <Navigate to="/" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(userRole)) {
        // Jika sudah login tapi role tidak sesuai (misal user mau ke admin),
        // arahkan ke halaman yang sesuai dengan role-nya
        return <Navigate to={userRole === 'admin' ? '/admin' : '/home'} replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;

