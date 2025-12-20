# Authentication Setup Guide

## 📋 Overview

Aplikasi ini menggunakan **Authentication Service** yang mendukung dua mode:
1. **Dummy Mode** - Untuk development/testing tanpa API
2. **API Mode** - Untuk production dengan API kampus

## 🚀 Quick Start

### 1. Setup Environment Variables

Buat file `.env.development` di folder `client/`:

```env
VITE_USE_DUMMY_AUTH=true
```

### 2. Test Login

**Dummy Credentials:**
- **Admin**: NRP `111`, Password `111`
- **User**: NRP `222`, Password `222`

## 📁 File Structure

```
client/
├── src/
│   ├── services/
│   │   └── authService.js      # Service autentikasi
│   ├── pages/
│   │   └── Login.jsx            # Halaman login (sudah terintegrasi)
│   └── components/
│       ├── UserSidebar.jsx      # Sidebar user (sudah terintegrasi)
│       └── AdminSidebar.jsx     # Sidebar admin (sudah terintegrasi)
├── .env.development             # Environment untuk development
├── .env.production              # Environment untuk production
└── ENV_SETUP.md                 # Dokumentasi lengkap environment
```

## 🔧 Service Functions

### `login(nrp, password)`
Fungsi utama untuk login. Otomatis switch antara dummy dan API mode.

```javascript
import { login } from '../services/authService';

const result = await login('111', '111');
if (result.success) {
    // Login berhasil
    console.log(result.data);
} else {
    // Login gagal
    console.log(result.message);
}
```

### `logout()`
Clear semua data authentication dari localStorage.

```javascript
import { logout } from '../services/authService';
logout();
```

### `isAuthenticated()`
Check apakah user sudah login.

```javascript
import { isAuthenticated } from '../services/authService';
if (isAuthenticated()) {
    // User sudah login
}
```

### `getCurrentUser()`
Ambil data user yang sedang login.

```javascript
import { getCurrentUser } from '../services/authService';
const user = getCurrentUser();
console.log(user.nrp, user.role, user.name);
```

## 🔄 Switch ke API Mode

Ketika sudah dapat akses API kampus:

### 1. Update Environment Variable

Buat/update file `.env.production`:

```env
VITE_USE_DUMMY_AUTH=false
VITE_API_URL=https://api-kampus-anda.com
```

### 2. Update `apiLogin` Function

Edit `client/src/services/authService.js`, update function `apiLogin`:

```javascript
export const apiLogin = async (nrp, password) => {
    try {
        const API_URL = import.meta.env.VITE_API_URL;
        const endpoint = `${API_URL}/auth/login`; // Sesuaikan endpoint
        
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Tambahkan headers lain jika diperlukan
            },
            body: JSON.stringify({ 
                nrp: nrp, 
                password: password 
            })
        });
        
        const data = await response.json();
        
        // Mapping response API ke format aplikasi
        if (response.ok) {
            return {
                success: true,
                data: {
                    nrp: data.nrp, // Sesuaikan dengan field API
                    role: data.role || determineRole(data),
                    name: data.name,
                    email: data.email,
                    token: data.token, // Jika API mengembalikan token
                }
            };
        }
        
        return {
            success: false,
            message: data.message || 'Login gagal'
        };
    } catch (error) {
        return {
            success: false,
            message: 'Terjadi kesalahan pada server'
        };
    }
};
```

### 3. Update `determineRole` Function

Sesuaikan logic untuk menentukan role dari response API:

```javascript
const determineRole = (apiData) => {
    // Contoh: Jika API mengembalikan field 'user_type'
    if (apiData.user_type === 'admin') {
        return 'admin';
    }
    return 'user';
};
```

## 📝 Data yang Disimpan

Setelah login berhasil, data berikut disimpan di `localStorage`:

- `isAuthenticated`: `'true'`
- `userRole`: `'admin'` atau `'user'`
- `userNrp`: NRP user
- `userName`: Nama user
- `userEmail`: Email user (jika ada)
- `authToken`: Token JWT (jika API mengembalikan token)
- `refreshToken`: Refresh token (jika ada)

## ⚠️ Important Notes

1. **Environment variables harus dimulai dengan `VITE_`** untuk bisa diakses di frontend
2. **Restart dev server** setelah mengubah environment variables
3. **File `.env` tidak di-commit ke git** (sudah ada di `.gitignore`)
4. **Mode default adalah dummy** jika tidak ada environment variable
5. **Token handling**: Jika API mengembalikan token, pastikan untuk:
   - Menyimpan token dengan aman
   - Menambahkan token ke headers untuk request API selanjutnya
   - Handle token expiration dan refresh

## 🧪 Testing

### Test Dummy Mode
```bash
# Pastikan VITE_USE_DUMMY_AUTH=true
npm run dev

# Test login dengan:
# - Admin: 111/111
# - User: 222/222
```

### Test API Mode
```bash
# Set VITE_USE_DUMMY_AUTH=false
# Set VITE_API_URL dengan URL API yang benar
npm run build
npm run preview
```

## 🔐 Security Best Practices

1. **Jangan hardcode credentials** di code
2. **Gunakan HTTPS** untuk API calls di production
3. **Handle token expiration** dengan refresh token
4. **Clear sensitive data** saat logout
5. **Validate input** sebelum kirim ke API

## 📞 Support

Jika ada pertanyaan atau issue, silakan hubungi tim development.

