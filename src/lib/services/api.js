// API Service for Infinity App
const config = {
  apiUrl: import.meta.env.PROD
    ? 'https://infinity-app-127d.onrender.com/api'
    : 'http://localhost:10001/api'
};

const API_BASE = config.apiUrl;

import {
  getAccessToken,
  getRefreshToken,
  saveSession,
  clearSession
} from './session.js';

export function getToken() {
  return getAccessToken();
}

export function removeToken() {
  clearSession();
}

let refreshPromise = null;

async function refreshAccessToken() {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  if (!refreshPromise) {
    refreshPromise = fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        refreshToken
      })
    })
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          const error = new Error(
            data.message || 'Session refresh failed'
          );

          error.status = response.status;
          throw error;
        }


        if (!data.accessToken || !data.refreshToken) {
          throw new Error('Invalid refresh response');
        }

        saveSession({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken
        });

        return data.accessToken;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

export async function request(endpoint, options = {}, retry = true) {
  const token = getAccessToken();

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers
  };

  let response = await fetch(`${API_BASE}${endpoint}`, config);

  /*
   * If the access token expired, refresh it once
   * and retry the original request.
   */
  if (response.status === 401 && retry) {
    try {
      const newAccessToken = await refreshAccessToken();

      const retryHeaders = {
        ...options.headers,
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${newAccessToken}`
      };

      response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers: retryHeaders
      });
    } catch (refreshError) {
      clearSession();
      throw refreshError;
    }
  }

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(
      data.message || 'Something went wrong'
    );

    error.status = response.status;
    throw error;
  }

  return data;
}

export const auth = {
  register: (userData) => {
    return request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },
  
  login: (credentials) => {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  },
  
  getMe: () => {
    return request('/auth/me');
  },
  
  forgotPassword: (email) => {
    return request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  }
};

export const posts = {
  getAll: () => {
    return request('/posts');
  },
  
  getOne: (id) => {
    return request(`/posts/${id}`);
  },
  
  create: (formData) => {
    const token = getToken();
    return fetch(`${API_BASE}/posts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    }).then(res => res.json());
  },
  
  like: (postId) => {
    return request(`/posts/${postId}/like`, {
      method: 'PUT'
    });
  },
  
  comment: (postId, text) => {
    return request(`/posts/${postId}/comment`, {
      method: 'POST',
      body: JSON.stringify({ text })
    });
  },
  
  delete: (postId) => {
    return request(`/posts/${postId}`, {
      method: 'DELETE'
    });
  }
};

export default { auth, posts, getToken, removeToken };
