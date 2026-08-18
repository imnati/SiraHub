import axios from 'axios';

const API_BASE_URL = process.env.API_BASE_URL ?? 'http://localhost:5000/api';

/**
 * Axios client for making requests to the SiraHub backend API.
 * Used by the Telegram bot to fetch jobs, user data, etc.
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
