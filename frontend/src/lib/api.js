import axios from 'axios';

// Configure API base URL with port detection
const BASE_PORTS = [5002, 5003, 5004, 5005, 5006]; // Try these ports in order
let ACTIVE_PORT = null;
let API_URL = null;

// Function to create the API instance with the correct port
const createApiInstance = (port) => {
  const url = `http://localhost:${port}/api`;
  console.log(`Creating API instance with base URL: ${url}`);
  
  const instance = axios.create({
    baseURL: url,
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 5000, // Add a reasonable timeout
  });
  
  // Request interceptor to add auth token
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('userToken');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  
  // Response interceptor for error handling
  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      // Handle network errors
      if (!error.response) {
        console.error('Network error detected');
        return Promise.reject({
          message: 'Network error. Please check your internet connection.',
          isNetworkError: true,
        });
      }
      
      // Handle server errors
      if (error.response.status >= 500) {
        console.error('Server error', error.response);
        return Promise.reject({
          message: 'Server error. Please try again later.',
          isServerError: true,
          statusCode: error.response.status,
          ...error.response.data
        });
      }
      
      // Handle 401 unauthorized errors
      if (error.response.status === 401 && !error.config._retry) {
        // Logout logic can be implemented here
        console.log('Authentication error - redirecting to login');
      }
      
      return Promise.reject(error);
    }
  );
  
  return instance;
};

// Initialize with the first port, then find active port
let api = createApiInstance(BASE_PORTS[0]);

// Function to detect available port
const detectActivePort = async () => {
  if (ACTIVE_PORT) return ACTIVE_PORT;
  
  for (const port of BASE_PORTS) {
    try {
      console.log(`Trying to connect to backend on port ${port}...`);
      const response = await fetch(`http://localhost:${port}/health`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        timeout: 2000,
      });
      
      if (response.ok) {
        console.log(`Found active backend server on port ${port}`);
        ACTIVE_PORT = port;
        API_URL = `http://localhost:${port}/api`;
        api = createApiInstance(port);
        return port;
      }
    } catch (err) {
      console.log(`Port ${port} check failed: ${err.message}`);
    }
  }
  
  console.warn('No active backend port found. Using default port.');
  return BASE_PORTS[0];
};

// Check for active port immediately
detectActivePort();

// Health check function
export const checkApiHealth = async () => {
  const port = await detectActivePort();
  
  try {
    const response = await fetch(`http://localhost:${port}/health`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Health check failed: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API health check failed:', error);
    return { status: 'error', error: error.message };
  }
};

export const BASE_URL = API_URL || `http://localhost:${BASE_PORTS[0]}/api`;
export default api; 