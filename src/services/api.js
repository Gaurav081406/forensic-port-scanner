import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

export const scanTarget = async (scanData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/port-scanner/scan`, scanData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getScanHistory = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/port-scanner/history`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const exportResults = async (scanId, format) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/port-scanner/export/${scanId}?format=${format}`,
      { responseType: 'blob' }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
