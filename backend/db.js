const mysql = require('mysql2/promise');

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'vibely_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test database connection
async function testConnection() {
    try {
        const connection = await db.getConnection();
        console.log('Database connected successfully!');
        connection.release();
    } catch (error) {
        console.error('DATABASE CONNECTION ERROR:', error);
    }
}

testConnection();

module.exports = db;