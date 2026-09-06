export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export const getAuthToken = () => localStorage.getItem('cybernex_token');

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('cybernex_token', token);
  } else {
    localStorage.removeItem('cybernex_token');
  }
};

export const clearAuthToken = () => localStorage.removeItem('cybernex_token');

export const apiRequest = async (endpoint, options = {}) => {
  const headers = { ...(options.headers || {}) };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = headers['Content-Type'] || 'application/json';
  }

  const token = getAuthToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const rawText = await response.text();
  const payload = rawText ? JSON.parse(rawText) : null;

  if (!response.ok) {
    throw new Error(payload?.message || 'Request failed');
  }

  return payload;
};
