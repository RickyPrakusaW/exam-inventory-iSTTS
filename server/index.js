const express = require('express');
const cors = require('cors');
const multer = require('multer');
const dotenv = require('dotenv');
const { sequelize } = require('./models');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const path = require('path');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads'))); // Direct access if needed, or via public

const authRoutes = require('./routes/authRoutes');
const soalRoutes = require('./routes/soalRoutes');
const masterDataRoutes = require('./routes/masterDataRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const libraryRoutes = require('./routes/libraryRoutes');
const beritaRoutes = require('./routes/beritaRoutes');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/soal', soalRoutes);
app.use('/api/master', masterDataRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/library', libraryRoutes);
app.use('/api/berita', beritaRoutes);

// Test Route
app.get('/', (req, res) => {
    res.send('Bank Soal Digital API is running...');
});

// Global Error Handler
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        // Multer specific errors
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ 
                message: 'File too large. Maximum size is 10MB.' 
            });
        }
        return res.status(400).json({ 
            message: `Upload error: ${err.message}` 
        });
    } else if (err) {
        // Other errors
        console.error(err);
        return res.status(500).json({ 
            message: err.message || 'Internal Server Error' 
        });
    }
    next();
});

// Sync Database and Start Server
const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected...');
        await sequelize.sync(); // Sync models
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

startServer();
