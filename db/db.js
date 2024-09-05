const { Sequelize } = require('sequelize');
const logger = require('../logger'); // Adjust the path to your logger file

// Initialize Sequelize instance with connection pool configuration
const sequelize = new Sequelize('Tunde', 'postgres', 'Tunde@2024', {
    host: 'localhost',
    dialect: 'postgres',
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
    logging: (msg) => logger.info(msg), // Use Winston logger for SQL queries
});

// Test the database connection
sequelize.authenticate()
    .then(() => {
        logger.info('Connection has been established successfully.');
    })
    .catch(err => {
        logger.error('Unable to connect to the database:', err);
    });

module.exports = sequelize;
