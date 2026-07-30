const authenticate = (req, res, next) => {
    // Development mode: Remove API key validation
    // In production, implement proper authentication
    
    // Always allow requests in development
    req.user = {
        id: 1,
        username: 'developer',
        permissions: ['scan', 'export', 'view_results'],
        role: 'analyst'
    };
    
    // Skip validation
    next();
};

module.exports = { authenticate };
