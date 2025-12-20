# Environment Variables Setup

File ini menjelaskan cara setup environment variables untuk aplikasi.

## File Environment Variables

Buat file berikut di folder `client/`:

### 1. `.env.development` (untuk development)
```env
# Development Environment Variables
# File ini untuk development dengan dummy authentication

# Authentication Mode
# Set ke 'true' untuk menggunakan dummy login (tanpa API)
# Set ke 'false' untuk menggunakan API kampus
VITE_USE_DUMMY_AUTH=true

# API URL (untuk production nanti)
# VITE_API_URL=https://api-kampus-anda.com
```

### 2. `.env.production` (untuk production)
```env
# Production Environment Variables
# File ini untuk production dengan API kampus

# Authentication Mode
# Set ke 'false' untuk menggunakan API kampus
VITE_USE_DUMMY_AUTH=false

# API URL kampus Anda
# TODO: Ganti dengan URL API kampus yang sebenarnya
VITE_API_URL=https://api-kampus-anda.com
```

### 3. `.env.local` (opsional, untuk local override)
```env
# Local Environment Variables
# File ini akan override .env.development dan .env.production
# Jangan commit file ini ke git (sudah ada di .gitignore)

VITE_USE_DUMMY_AUTH=true
VITE_API_URL=http://localhost:3000/api
```

## Cara Menggunakan

### Development Mode (Dummy Login)
1. Buat file `.env.development` dengan `VITE_USE_DUMMY_AUTH=true`
2. Aplikasi akan menggunakan dummy login (NRP: 111/111 untuk admin, 222/222 untuk user)

### Production Mode (API Login)
1. Buat file `.env.production` dengan `VITE_USE_DUMMY_AUTH=false`
2. Set `VITE_API_URL` dengan URL API kampus Anda
3. Update function `apiLogin` di `client/src/services/authService.js` sesuai format API kampus

## Testing

Untuk test dengan dummy login:
- NRP: `111`, Password: `111` → Admin
- NRP: `222`, Password: `222` → User

## Catatan Penting

1. **File `.env` tidak di-commit ke git** (sudah ada di `.gitignore`)
2. **Restart dev server** setelah mengubah environment variables
3. **Environment variables harus dimulai dengan `VITE_`** untuk bisa diakses di frontend
4. **Mode default adalah dummy** jika tidak ada environment variable

## Update API Integration

Ketika sudah dapat akses API kampus:

1. Update `apiLogin` function di `client/src/services/authService.js`
2. Sesuaikan endpoint dan request/response format
3. Update mapping data sesuai struktur response API
4. Set `VITE_USE_DUMMY_AUTH=false` di production

