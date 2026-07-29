const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');
const logger = require('./src/utils/logger');
const { connectDB } = require('./src/utils/database');
const portScannerRoutes = require('./src/routes/portScanner');

const app = express();

// Security middleware (REMOVE helmet for now or configure it properly)
// app.use(helmet()); // Comment out or configure CSP header
app.use(cors());

// Fix: Add specific CSP header to allow React CDN
app.use((req, res, next) => {
    res.setHeader('Content-Security-Policy', 
        "default-src 'self'; " +
        "script-src 'self' 'unsafe-inline' https://unpkg.com; " +
        "style-src 'self' 'unsafe-inline'; " +
        "connect-src 'self'"
    );
    next();
});

// Database connection
connectDB();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/port-scanner', portScannerRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
    logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
