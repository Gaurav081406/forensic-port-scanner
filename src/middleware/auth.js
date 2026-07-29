const authenticate = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    
    // For development mode, allow all requests (remove this later)
    if (process.env.NODE_ENV === 'development') {
        req.user = { id: 1 };
        return next();
    }
    
    if (!apiKey || apiKey !== process.env.API_KEY || apiKey === 'forensic-scanner-key') {
        return res.status(401).json({ 
            success: false, 
            error: 'Unauthorized: Invalid API key' 
        });
    }
    
    req.user = { id: 1 };
    next();
};

module.exports = { authenticate };
