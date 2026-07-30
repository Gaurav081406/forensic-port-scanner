const fs = require('fs');
const path = require('path');

const logScan = async (userId, target, scanType, req) => {
    const logDir = path.join(__dirname, '../../logs');
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
    }
    
    const timestamp = new Date().toISOString();
    const logEntry = {
        timestamp,
        userId,
        action: 'PORT_SCAN_INITIATED',
        target,
        scanType,
        ip: req?.ip || 'unknown'
    };
    
    const logFile = path.join(logDir, 'audit.log');
    fs.appendFileSync(logFile, JSON.stringify(logEntry) + '\n');
};

module.exports = { logScan };
