/**
 * Authentication Service
 * 
 * Service ini menangani logika autentikasi dengan dua mode:
 * 1. Dummy mode: Untuk development/testing tanpa API
 * 2. API mode: Untuk production dengan API kampus
 * 
 * Switch mode menggunakan environment variable VITE_USE_DUMMY_AUTH
 */

/**
 * Dummy login function (untuk development)
 * Simulasi login dengan data dummy
 */
export const dummyLogin = async (nrp, password) => {
    // Simulasi API call delay (500ms)
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Dummy credentials database
    const dummyUsers = {
        '111': { 
            password: '111', 
            role: 'admin',
            name: 'Admin iSTTS',
            email: 'admin@istts.ac.id'
        },
        '222': { 
            password: '222', 
            role: 'user',
            name: 'Mahasiswa iSTTS',
            email: 'mahasiswa@istts.ac.id'
        }
    };
    
    // Validasi credentials
    if (dummyUsers[nrp] && dummyUsers[nrp].password === password) {
        return {
            success: true,
            data: {
                nrp: nrp,
                role: dummyUsers[nrp].role,
                name: dummyUsers[nrp].name,
                email: dummyUsers[nrp].email,
                // Tambahkan field lain sesuai kebutuhan
            }
        };
    }
    
    return {
        success: false,
        message: 'NRP atau password salah'
    };
};

/**
 * Real API login function (untuk production)
 * Panggil API kampus untuk autentikasi
 * 
 * TODO: Update endpoint dan request/response format sesuai API kampus Anda
 */
export const apiLogin = async (nrp, password) => {
    try {
        const API_URL = import.meta.env.VITE_API_URL || 'https://api-kampus-anda.com';
        const endpoint = `${API_URL}/auth/login`; // Sesuaikan endpoint API kampus
        
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Tambahkan headers lain jika diperlukan (API key, dll)
            },
            body: JSON.stringify({ 
                nrp: nrp, 
                password: password 
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Mapping response dari API kampus ke format aplikasi
            return {
                success: true,
                data: {
                    nrp: data.nrp || data.nim || data.username,
                    role: data.role || determineRole(data), // Tentukan role dari data API
                    name: data.name || data.nama || data.full_name,
                    email: data.email || data.email_address,
                    token: data.token || data.access_token, // Jika API mengembalikan token
                    refreshToken: data.refresh_token, // Jika ada refresh token
                    // Tambahkan field lain sesuai response API
                }
            };
        } else {
            return {
                success: false,
                message: data.message || data.error || 'Login gagal'
            };
        }
    } catch (error) {
        console.error('Login error:', error);
        return {
            success: false,
            message: 'Terjadi kesalahan pada server. Silakan coba lagi nanti.'
        };
    }
};

/**
 * Helper function untuk menentukan role dari data API
 * Sesuaikan dengan struktur data API kampus Anda
 */
const determineRole = (apiData) => {
    // Contoh: Jika API mengembalikan field 'user_type' atau 'level'
    if (apiData.user_type === 'admin' || apiData.level === 'admin') {
        return 'admin';
    }
    // Default ke 'user'
    return 'user';
};

/**
 * Main login function
 * Switch antara dummy dan real API berdasarkan environment variable
 */
export const login = async (nrp, password) => {
    // Validasi input
    if (!nrp || !password) {
        return {
            success: false,
            message: 'NRP dan password harus diisi'
        };
    }
    
    // Check environment variable untuk menentukan mode
    // Default ke dummy mode jika tidak ada environment variable
    const USE_DUMMY = import.meta.env.VITE_USE_DUMMY_AUTH === 'true' || 
                      !import.meta.env.VITE_API_URL ||
                      import.meta.env.MODE === 'development';
    
    if (USE_DUMMY) {
        console.log('🔧 Using DUMMY authentication mode');
        return await dummyLogin(nrp, password);
    } else {
        console.log('🌐 Using API authentication mode');
        return await apiLogin(nrp, password);
    }
};

/**
 * Logout function
 * Clear semua data dari localStorage
 */
export const logout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userNrp');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    
    // Jika menggunakan token, bisa tambahkan logic untuk invalidate token di server
    // await fetch('/api/auth/logout', { method: 'POST' });
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
    return localStorage.getItem('isAuthenticated') === 'true';
};

/**
 * Get current user data from localStorage
 */
export const getCurrentUser = () => {
    return {
        nrp: localStorage.getItem('userNrp'),
        role: localStorage.getItem('userRole'),
        name: localStorage.getItem('userName'),
        email: localStorage.getItem('userEmail'),
        token: localStorage.getItem('authToken'),
    };
};

