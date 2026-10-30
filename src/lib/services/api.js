// API Service for Infinity App
const config = {
  apiUrl: import.meta.env.PROD
    ? 'https://infinity-app-mobile-backend.onrender.com/api'
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

  like: (postId, liked) => {
  return request(`/posts/${postId}/like`, {
    method: 'PUT',
    body: JSON.stringify({ liked })
  });
},

  comment: (postId, text) => {
    return request(`/posts/${postId}/comment`, {
      method: 'POST',
      body: JSON.stringify({ text })
    });
  },

	sendPrivateFeedback: (postId, text) => {
  return request(`/posts/${postId}/private-feedback`, {
    method: 'POST',
    body: JSON.stringify({ text })
  });
},

getPrivateFeedback: (postId) => {
  return request(`/posts/${postId}/private-feedback`);
},

getMyPrivateFeedback: (postId) => {
  return request(`/posts/${postId}/my-private-feedback`);
},

  delete: (postId) => {
    return request(`/posts/${postId}`, {
      method: 'DELETE'
    });
  }
};

export const notifications = {
  getAll: ({ page = 1, limit = 20, unread = false } = {}) => {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit)
    });

    if (unread) {
      params.set('unread', 'true');
    }

    return request(`/notifications?${params.toString()}`);
  },

  getUnreadCount: () => {
    return request('/notifications/unread-count');
  },

  markRead: (id) => {
    return request(`/notifications/${encodeURIComponent(id)}/read`, {
      method: 'PATCH'
    });
  },

  markAllRead: () => {
    return request('/notifications/read-all', {
      method: 'PATCH'
    });
  }
};

export default {
  auth,
  posts,
  notifications,
  getToken,
  removeToken
};
