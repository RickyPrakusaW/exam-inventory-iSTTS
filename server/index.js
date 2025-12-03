const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { sequelize } = require('./models');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const soalRoutes = require('./routes/soalRoutes');
const authRoutes = require('./routes/authRoutes');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/soal', soalRoutes);

// Test Route
app.get('/', (req, res) => {
    res.send('Bank Soal Digital API is running...');
});

// Sync Database and Start Server
const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected...');
        await sequelize.sync({ alter: true }); // Sync models
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

startServer();
