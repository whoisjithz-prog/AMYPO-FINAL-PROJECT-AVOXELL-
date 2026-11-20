// Avoxell API Client
const API_BASE = 'http://127.0.0.1:8000/api/v1';

// Generate or retrieve persistent session ID for guest carts
const getSessionId = () => {
  let sessionId = localStorage.getItem('avoxell_session_id');
  if (!sessionId) {
    sessionId = 'default_avoxell_session'; // matches pre-seeded cart
    localStorage.setItem('avoxell_session_id', sessionId);
  }
  return sessionId;
};

const getHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
    'X-Session-ID': getSessionId()
  };
  const token = localStorage.getItem('avoxell_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const api = {
  // Home
  async getHomeData() {
    try {
      const res = await fetch(`${API_BASE}/home/`);
      if (!res.ok) throw new Error('Failed to fetch home data');
      return await res.json();
    } catch (e) {
      console.warn('API error, using fallback:', e);
      return null;
    }
  },

  // Products
  async getProducts(params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${API_BASE}/products/?${query}`);
      if (!res.ok) throw new Error('Failed to fetch products');
      return await res.json();
    } catch (e) {
      console.warn('API error, using fallback:', e);
      return null;
    }
  },

  // Product Detail
  async getProduct(slug) {
    try {
      const res = await fetch(`${API_BASE}/products/${slug}/`);
      if (!res.ok) throw new Error('Failed to fetch product');
      return await res.json();
    } catch (e) {
      console.warn('API error, using fallback:', e);
      return null;
    }
  },

  // Add Review
  async addReview(productId, reviewData) {
    const res = await fetch(`${API_BASE}/products/${productId}/reviews/`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(reviewData)
    });
    return await res.json();
  },

  // Categories & Brands
  async getCategories() {
    try {
      const res = await fetch(`${API_BASE}/categories/`);
      if (!res.ok) throw new Error('Failed to fetch categories');
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  async getBrands() {
    try {
      const res = await fetch(`${API_BASE}/brands/`);
      if (!res.ok) throw new Error('Failed to fetch brands');
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  // Cart
  async getCart() {
    try {
      const res = await fetch(`${API_BASE}/cart/`, {
        headers: getHeaders()
      });
      if (!res.ok) throw new Error('Failed to fetch cart');
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  async addToCart(productId, quantity = 1, variant = '') {
    const res = await fetch(`${API_BASE}/cart/items/`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ product_id: productId, quantity, variant })
    });
    return await res.json();
  },

  async updateCartItem(itemId, quantity) {
    const res = await fetch(`${API_BASE}/cart/items/${itemId}/`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ quantity })
    });
    return await res.json();
  },

  async removeCartItem(itemId) {
    const res = await fetch(`${API_BASE}/cart/items/${itemId}/`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return await res.json();
  },

  async applyCoupon(code, subtotal) {
    const res = await fetch(`${API_BASE}/cart/coupon/`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ code, subtotal })
    });
    return await res.json();
  },

  // Orders
  async createOrder(orderData) {
    const res = await fetch(`${API_BASE}/orders/`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(orderData)
    });
    return await res.json();
  },

  async getOrders() {
    try {
      const res = await fetch(`${API_BASE}/orders/list/`, {
        headers: getHeaders()
      });
      return await res.json();
    } catch (e) {
      return [];
    }
  },

  async getOrder(orderNo) {
    const res = await fetch(`${API_BASE}/orders/${orderNo}/`, {
      headers: getHeaders()
    });
    return await res.json();
  },

  // Auth
  async login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login/`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, password })
    });
    return await res.json();
  }
};
