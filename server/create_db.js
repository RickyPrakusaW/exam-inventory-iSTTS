const mysql = require('mysql2/promise');
require('dotenv').config();

const createDatabase = async () => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            port: process.env.DB_PORT || 3306
        });
        
        console.log('Connected to MySQL server...');

        const dbName = process.env.DB_NAME;
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
        console.log(`Database '${dbName}' created or successfully checked.`);
        
        await connection.end();
    } catch (err) {
        console.error('Error checking/creating database:', err.message);
        console.log('\nTIP: Make sure your DB_USER and DB_PASS in .env are correct and MySQL is running.');
    }
};

createDatabase();
