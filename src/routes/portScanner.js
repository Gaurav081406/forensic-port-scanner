const express = require('express');
const router = express.Router();
const nmapService = require('../services/nmapService');
const { authenticate } = require('../middleware/auth');
const { validateScanRequest } = require('../middleware/validation');
const { logScan } = require('../utils/audit');

// Start a new scan
// POST /scan endpoint ko update karo
router.post('/scan', authenticate, validateScanRequest, async (req, res) => {
    try {
        const { target, scanType, ports } = req.body;
        
        // Log scan initiation - pass req parameter
        await logScan(req.user.id, target, scanType, req);
        
        // Perform scan
        const results = await nmapService.scan(target, scanType, ports);
        
        res.json({
            success: true,
            data: results,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get scan history
router.get('/history', authenticate, async (req, res) => {
  try {
    const history = await ScanResult.find({ userId: req.user.id })
      .sort({ timestamp: -1 })
      .limit(20);
    
    res.json({
      success: true,
      data: history
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Export scan results
router.get('/export/:scanId', authenticate, async (req, res) => {
  try {
    const { scanId } = req.params;
    const { format = 'json' } = req.query;
    
    const scan = await ScanResult.findById(scanId);
    
    if (!scan || scan.userId.toString() !== req.user.id) {
      return res.status(404).json({
        success: false,
        error: 'Scan not found'
      });
    }
    
    if (format === 'csv') {
      const csv = convertToCSV(scan.results);
      res.setHeader('Content-Type', 'text/csv');
      res.send(csv);
    } else if (format === 'pdf') {
      const pdf = await generatePDF(scan);
      res.setHeader('Content-Type', 'application/pdf');
      res.send(pdf);
    } else {
      res.json({
        success: true,
        data: scan.results
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
