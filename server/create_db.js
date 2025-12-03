const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    host: process.env.DB_HOST,
    port: 5432, // Default Postgres port
});

const createDatabase = async () => {
    try {
        await client.connect();
        console.log('Connected to PostgreSQL server...');

        const dbName = process.env.DB_NAME;
        const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = '${dbName}'`);

        if (res.rowCount === 0) {
            console.log(`Database '${dbName}' not found. Creating...`);
            await client.query(`CREATE DATABASE "${dbName}"`);
            console.log(`Database '${dbName}' created successfully!`);
        } else {
            console.log(`Database '${dbName}' already exists.`);
        }
    } catch (err) {
        console.error('Error checking/creating database:', err.message);
        console.log('\nTIP: Make sure your DB_USER and DB_PASS in .env are correct.');
    } finally {
        await client.end();
    }
};

createDatabase();
