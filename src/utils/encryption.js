const crypto = require('crypto');

// Encryption key (in production, use environment variable)
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'forensic-scanner-key-32-chars-long!';
const IV_LENGTH = 16; // For AES, this is always 16

const encryptData = (data) => {
    try {
        const iv = crypto.randomBytes(IV_LENGTH);
        const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
        
        let encrypted = cipher.update(JSON.stringify(data));
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        
        return {
            iv: iv.toString('hex'),
            encryptedData: encrypted.toString('hex')
        };
    } catch (error) {
        console.error('Encryption error:', error);
        return data; // Return original data if encryption fails
    }
};

const decryptData = (encryptedData) => {
    try {
        const iv = Buffer.from(encryptedData.iv, 'hex');
        const encryptedText = Buffer.from(encryptedData.encryptedData, 'hex');
        const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
        
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        
        return JSON.parse(decrypted.toString());
    } catch (error) {
        console.error('Decryption error:', error);
        return null;
    }
};

const signData = (data) => {
    try {
        const signature = crypto.createHmac('sha256', 'signature-key')
            .update(JSON.stringify(data))
            .digest('hex');
        
        return {
            ...data,
            signature,
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        console.error('Signing error:', error);
        return data;
    }
};

const verifySignature = (data) => {
    try {
        if (!data.signature) return false;
        
        const { signature, ...originalData } = data;
        const expectedSignature = crypto.createHmac('sha256', 'signature-key')
            .update(JSON.stringify(originalData))
            .digest('hex');
        
        return signature === expectedSignature;
    } catch (error) {
        console.error('Signature verification error:', error);
        return false;
    }
};

module.exports = {
    encryptData,
    decryptData,
    signData,
    verifySignature
};
