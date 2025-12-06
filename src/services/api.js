/**
 * API Service Module
 * 
 * Handles all API communication for the camera management application.
 * Provides functions for fetching cameras and updating camera status.
 * 
 * @module services/api
 */
import axios from 'axios';

const API_BASE_URL = 'https://api-app-staging.wobot.ai/app/v1';
const AUTH_TOKEN = '4ApVMIn5sTxeW7GQ5VWeWiy';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Authorization': `Bearer ${AUTH_TOKEN}`,
    'Content-Type': 'application/json',
  },
});

/**
 * Fetches all cameras from the API
 * @async
 * @function fetchCameras
 * @returns {Promise<Array|Object>} Camera data from the API
 * @throws {Error} If the API request fails
 */
export const fetchCameras = async () => {
  try {
    const response = await api.get('/fetch/cameras');
    return response.data;
  } catch (error) {
    console.error('Error fetching cameras:', error);
    throw error;
  }
};

/**
 * Updates the status of a camera via API
 * @async
 * @function updateCameraStatus
 * @param {string|number} id - Camera ID to update
 * @param {string} status - New status value (e.g., "Active", "Inactive")
 * @returns {Promise<Object>} Updated camera data from the API
 * @throws {Error} If the API request fails
 */
export const updateCameraStatus = async (id, status) => {
  try {
    const response = await api.post('/update/camera/status', {
      id,
      status,
    });
    return response.data;
  } catch (error) {
    console.error('Error updating camera status:', error);
    throw error;
  }
};

export default api;

