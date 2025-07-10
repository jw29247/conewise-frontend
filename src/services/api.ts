import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

// Authentication has been removed for the demo build, so no
// interceptors are required here.

export default api;