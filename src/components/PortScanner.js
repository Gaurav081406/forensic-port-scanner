import React, { useState, useEffect } from 'react';
import ScanResults from './ScanResults';
import { scanTarget } from '../services/api';
import { validateTarget } from '../utils/validation';

const PortScanner = () => {
  const [target, setTarget] = useState('');
  const [scanType, setScanType] = useState('tcp');
  const [ports, setPorts] = useState('1-1024');
  const [results, setResults] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState('');

  const handleScan = async () => {
    setError('');
    
    if (!validateTarget(target)) {
      setError('Invalid target IP or domain');
      return;
    }
    
    setScanning(true);
    
    try {
      const response = await scanTarget({
        target,
        scanType,
        ports
      });
      setResults(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Scan failed');
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="port-scanner">
      <h2>Forensic Port Scanner</h2>
      
      <div className="scan-controls">
        <div className="input-group">
          <label htmlFor="target">Target:</label>
          <input
            type="text"
            id="target"
            placeholder="IP address or domain"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
          />
        </div>
        
        <div className="input-group">
          <label htmlFor="scanType">Scan Type:</label>
          <select
            id="scanType"
            value={scanType}
            onChange={(e) => setScanType(e.target.value)}
          >
            <option value="tcp">TCP Scan</option>
            <option value="udp">UDP Scan</option>
            <option value="syn">SYN Scan</option>
          </select>
        </div>
        
        <div className="input-group">
          <label htmlFor="ports">Port Range:</label>
          <input
            type="text"
            id="ports"
            placeholder="e.g., 1-1024, 22,80,443"
            value={ports}
            onChange={(e) => setPorts(e.target.value)}
          />
        </div>
        
        <button
          className="scan-btn"
          onClick={handleScan}
          disabled={scanning || !target}
        >
          {scanning ? 'Scanning...' : 'Start Scan'}
        </button>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      {results && <ScanResults results={results} />}
    </div>
  );
};

export default PortScanner;
