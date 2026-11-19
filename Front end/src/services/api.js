// API Service for Industrial Authority Platform
// In development: proxied via vite to localhost:5000/api
// In production:  points directly to the deployed backend
const API_BASE = import.meta.env.VITE_API_BASE || '/api';

/**
 * Safe fetch wrapper that handles network errors with friendly Arabic messages
 */
async function safeFetch(url, options = {}) {
  try {
    return await fetch(url, options);
  } catch (err) {
    console.error('Fetch network error:', err);
    throw new Error(
      'تعذر الاتصال بالخادم (Network Error). يرجى التأكد من تشغيل السيرفر الخلفي (Backend) وقاعدة البيانات.'
    );
  }
}

/**
 * Handle API responses with unified error formatting
 */
async function handleResponse(response) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 413) {
      throw new Error('حجم المستندات أو الصور المرفوعة كبير جداً. يرجى اختيار ملفات بحجم أصغر.');
    }

    if (response.status === 502 || response.status === 503 || response.status === 504) {
      throw new Error(
        data.message ||
          'خادم المنظومة أو قاعدة البيانات غير متاحين حالياً. يرجى التأكد من تشغيل السيرفر.'
      );
    }

    const errorMsg =
      data.message ||
      (Array.isArray(data.msg) ? data.msg.join('، ') : data.msg) ||
      (response.status >= 500
        ? `تعذر إكمال الطلب من قِبل الخادم (كود الخطأ: ${response.status}). يرجى التحقق من اتصال قاعدة البيانات.`
        : 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.');
    throw new Error(errorMsg);
  }

  return data;
}

export const authAPI = {
  /**
   * Register a new Factory
   */
  async register(factoryData) {
    const res = await safeFetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(factoryData),
    });
    return handleResponse(res);
  },

  /**
   * Login with email and password
   */
  async login(credentials) {
    const res = await safeFetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    return handleResponse(res);
  },

  /**
   * Get current authenticated factory profile
   */
  async getMe(token) {
    const res = await safeFetch(`${API_BASE}/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return handleResponse(res);
  },

  /**
   * Logout
   */
  async logout() {
    const res = await safeFetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return handleResponse(res);
  },
};

export const adminAPI = {
  /**
   * Get list of facilities with optional status and search filter
   */
  async getFactories(token, status = '', search = '') {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (search) params.append('search', search);

    const queryString = params.toString() ? `?${params.toString()}` : '';
    const res = await safeFetch(`${API_BASE}/admin/factories${queryString}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return handleResponse(res);
  },

  /**
   * Get statistics summary for admin
   */
  async getStats(token) {
    const res = await safeFetch(`${API_BASE}/admin/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return handleResponse(res);
  },

  /**
   * Update factory authorization accountStatus (pending -> approved / rejected)
   */
  async updateFactoryStatus(id, status, token, auditNotes = '', rejectionReason = '') {
    const res = await safeFetch(`${API_BASE}/admin/factories/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status, auditNotes, rejectionReason }),
    });
    return handleResponse(res);
  },
};


export const requestsAPI = {
  /**
   * Submit new challenge / technical request to PostgreSQL
   */
  async submitRequest(requestData, token) {
    const res = await safeFetch(`${API_BASE}/requests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(requestData),
    });
    return handleResponse(res);
  },

  /**
   * Get all requests submitted by the logged-in factory
   */
  async getMyRequests(token) {
    const res = await safeFetch(`${API_BASE}/requests/my`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return handleResponse(res);
  },

  /**
   * Get single request details by ID
   */
  async getRequestById(id, token) {
    const res = await safeFetch(`${API_BASE}/requests/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return handleResponse(res);
  },
};
