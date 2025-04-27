import axios from 'axios';

// Create an axios instance with default config
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token in requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors (token expired or invalid)
    if (error.response && error.response.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email, password) => {
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);
    
    return api.post('/auth/token', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  },
  
  register: (email, password, fullName) => {
    return api.post('/auth/register', { email, password, full_name: fullName });
  },
  
  getProfile: () => {
    return api.get('/auth/me');
  },
};

// Connectors API
export const connectorsAPI = {
  getConnectors: () => {
    return api.get('/connectors');
  },
  
  getConnector: (id) => {
    return api.get(`/connectors/${id}`);
  },
  
  createConnector: (connector) => {
    return api.post('/connectors', connector);
  },
  
  updateConnector: (id, connector) => {
    return api.put(`/connectors/${id}`, connector);
  },
  
  deleteConnector: (id) => {
    return api.delete(`/connectors/${id}`);
  },
  
  syncConnector: (id) => {
    return api.post(`/connectors/${id}/sync`);
  },
};

// Chat API
export const chatAPI = {
  getConversations: () => {
    return api.get('/chat/conversations');
  },
  
  getConversation: (id) => {
    return api.get(`/chat/conversations/${id}`);
  },
  
  sendMessage: (message, conversationId = null, connectorIds = null) => {
    return api.post('/chat', {
      message,
      conversation_id: conversationId,
      connector_ids: connectorIds,
    });
  },
  
  deleteConversation: (id) => {
    return api.delete(`/chat/conversations/${id}`);
  },
};

// Actions API
export const actionsAPI = {
  getActions: (status = null) => {
    const params = status ? { status } : {};
    return api.get('/actions', { params });
  },
  
  getAction: (id) => {
    return api.get(`/actions/${id}`);
  },
  
  createAction: (action) => {
    return api.post('/actions', action);
  },
  
  approveAction: (id) => {
    return api.post(`/actions/${id}/approve`);
  },
  
  rejectAction: (id) => {
    return api.post(`/actions/${id}/reject`);
  },
};

export default api;
