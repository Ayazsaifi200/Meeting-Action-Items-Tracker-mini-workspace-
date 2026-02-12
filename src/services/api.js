import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Health Check
export const checkHealth = async () => {
  const response = await api.get('/health');
  return response.data;
};

// Transcripts
export const getTranscripts = async (limit = 5) => {
  const response = await api.get(`/transcripts/?limit=${limit}`);
  return response.data;
};

export const getTranscript = async (id) => {
  const response = await api.get(`/transcripts/${id}`);
  return response.data;
};

export const createTranscript = async (data) => {
  const response = await api.post('/transcripts/', data);
  return response.data;
};

export const deleteTranscript = async (id) => {
  const response = await api.delete(`/transcripts/${id}`);
  return response.data;
};

// Action Items
export const getActionItems = async (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const response = await api.get(`/action-items/?${params}`);
  return response.data;
};

export const getActionItem = async (id) => {
  const response = await api.get(`/action-items/${id}`);
  return response.data;
};

export const createActionItem = async (data) => {
  const response = await api.post('/action-items/', data);
  return response.data;
};

export const updateActionItem = async (id, data) => {
  const response = await api.put(`/action-items/${id}`, data);
  return response.data;
};

export const deleteActionItem = async (id) => {
  const response = await api.delete(`/action-items/${id}`);
  return response.data;
};

export const markActionItemComplete = async (id) => {
  const response = await api.patch(`/action-items/${id}/complete`);
  return response.data;
};

export default api;