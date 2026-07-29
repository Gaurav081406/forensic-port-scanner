const validateTarget = (target) => {
    const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/;
    return ipRegex.test(target) || domainRegex.test(target);
};

const validateScanRequest = (req, res, next) => {
    const { target, scanType, ports } = req.body;
    
    if (!validateTarget(target)) {
        return res.status(400).json({ 
            success: false, 
            error: 'Invalid target IP or domain' 
        });
    }
    
    if (!['tcp', 'udp', 'syn', 'full'].includes(scanType)) {
        return res.status(400).json({ 
            success: false, 
            error: 'Invalid scan type. Use: tcp, udp, syn, or full' 
        });
    }
    
    if (!/^\d{1,5}(?:-\d{1,5})?(?:,\d{1,5}(?:-\d{1,5})?)*$/.test(ports)) {
        return res.status(400).json({ 
            success: false, 
            error: 'Invalid port range format' 
        });
    }
    
    next();
};

module.exports = { validateScanRequest };
