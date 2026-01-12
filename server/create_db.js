
const mysql = require('mysql2/promise');
require('dotenv').config();

const createDb = async () => {
    try {
        const { DB_HOST, DB_USER, DB_PASS, DB_NAME } = process.env;
        const connection = await mysql.createConnection({
            host: DB_HOST,
            user: DB_USER,
            password: DB_PASS,
        });

        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
        console.log(`Database '${DB_NAME}' created or already exists.`);
        await connection.end();
    } catch (error) {
        console.error('Error creating database:', error);
    }
};

createDb();
