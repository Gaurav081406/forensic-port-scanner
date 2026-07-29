const { Pool } = require('pg');
const logger = require('./logger');

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'forensic_scanner',
    password: process.env.DB_PASSWORD || 'password',
    port: process.env.DB_PORT || 5432,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

pool.on('error', (err) => {
    logger.error('Unexpected error on idle client', err);
    process.exit(-1);
});

// Test database connection
const connectDB = async () => {
    try {
        const client = await pool.connect();
        logger.info('Database connected successfully');
        client.release();
    } catch (err) {
        logger.error('Database connection error:', err.message);
        // Continue without database for now
        logger.warn('Continuing without database connection');
    }
};

module.exports = {
    query: (text, params) => pool.query(text, params),
    connect: () => pool.connect(),
    connectDB
};
