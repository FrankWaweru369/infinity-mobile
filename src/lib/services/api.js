// API Service for Infinity App
const config = {
  apiUrl: import.meta.env.PROD
    ? 'https://infinity-app-127d.onrender.com/api'
    : 'http://localhost:10000/api'
};

const API_BASE = config.apiUrl;

export function getToken() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
}

export function setToken(token) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
  }
}

export function removeToken() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
  }
}

async function request(endpoint, options = {}) {
  const token = getToken();
  
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
  
  const response = await fetch(`${API_BASE}${endpoint}`, config);
  const data = await response.json();
  
  if (!response.ok) {
    const error = new Error(data.message || 'Something went wrong');
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

export default { auth, posts, getToken, setToken, removeToken };
