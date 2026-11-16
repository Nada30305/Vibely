
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    'vibely_db',
    'root',
    '',
    {
        host: 'localhost',
        dialect: 'mysql',
        logging: false
    }
);

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('User model loaded successfully!');
        console.log('MySQL connected successfully!');
    } catch (error) {
        console.error('Database connection failed:', error.message);
    }
};

module.exports = { sequelize, connectDB };
