const nmap = require('node-nmap');
const logger = require('../utils/logger');
const { encryptData, signData } = require('../utils/encryption');

nmap.nmapLocation = "nmap"; // Default nmap location

const scan = async (target, scanType, ports) => {
  return new Promise((resolve, reject) => {
    try {
      // Configure scan based on type
      let flags = [];
      
      switch (scanType) {
        case 'tcp':
          flags = ['-sS', '-sV', '-O'];
          break;
        case 'udp':
          flags = ['-sU', '-sV'];
          break;
        case 'syn':
          flags = ['-sS'];
          break;
        default:
          flags = ['-sS', '-sV'];
      }
      
      // Add port range
      if (ports) {
        flags.push('-p', ports);
      }
      
      // Create scan
      const scanInstance = new nmap.NmapScan(target, { flags });
      
      // Handle results
      scanInstance.on('complete', async (data) => {
        try {
          // Process and encrypt results
          const processedData = processData(data);
          const encryptedData = encryptData(processedData);
          const signedData = signData(encryptedData);
          
          resolve(signedData);
        } catch (error) {
          logger.error('Error processing scan results:', error);
          reject(error);
        }
      });
      
      scanInstance.on('error', (error) => {
        logger.error('Scan error:', error);
        reject(error);
      });
      
      // Start scan
      scanInstance.startScan();
    } catch (error) {
      logger.error('Error initializing scan:', error);
      reject(error);
    }
  });
};

const processData = (rawData) => {
  // Process raw nmap data into a more usable format
  const results = [];
  
  if (rawData && rawData.length > 0) {
    rawData.forEach(item => {
      if (item.ip) {
        const host = {
          ip: item.ip,
          hostname: item.hostname || '',
          ports: []
        };
        
        if (item.openPorts) {
          item.openPorts.forEach(port => {
            host.ports.push({
              port: port.port,
              state: port.state,
              service: port.service,
              version: port.version || '',
              extraInfo: port.extraInfo || ''
            });
          });
        }
        
        results.push(host);
      }
    });
  }
  
  return results;
};

module.exports = { scan };
