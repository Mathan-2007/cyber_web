export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const getCookieValue = (name) => {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
};

export const getAuthToken = () => {
  return localStorage.getItem('cybernex_token') || getCookieValue('cybernex_token');
};

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('cybernex_token', token);
    document.cookie = `cybernex_token=${encodeURIComponent(token)}; path=/; max-age=${8 * 60 * 60}; samesite=lax`;
  } else {
    localStorage.removeItem('cybernex_token');
    document.cookie = 'cybernex_token=; path=/; max-age=0; samesite=lax';
  }
};

export const clearAuthToken = () => {
  localStorage.removeItem('cybernex_token');
  document.cookie = 'cybernex_token=; path=/; max-age=0; samesite=lax';
};

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
    credentials: options.credentials || 'include',
    headers,
  });

  const rawText = await response.text();
  const payload = rawText ? JSON.parse(rawText) : null;

  if (!response.ok) {
    throw new Error(payload?.message || 'Request failed');
  }

  return payload;
};
