/**
 * ChopConnect Production API Service
 * Handles live synchronization between Buyers, Sellers, Couriers, and Backend on Vercel
 */

const getApiBase = () => {
  // If running in browser, relative '/api' works on Vercel and behind Vite proxy
  return '';
};

// Standard Fetch Wrapper with Timeout and JSON parsing
const request = async (endpoint, options = {}) => {
  const url = `${getApiBase()}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(options.headers || {})
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

  try {
    const res = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const error = new Error(data.message || `API Error: ${res.status}`);
      error.status = res.status;
      error.code = data.code;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error('Request timed out. Please check your network connection.');
    }
    throw err;
  }
};

/**
 * 1. Fetch Real Orders
 */
export const apiFetchOrders = async (params = {}) => {
  const query = new URLSearchParams();
  if (params.status) query.set('status', params.status);
  if (params.riderId) query.set('riderId', params.riderId);
  if (params.buyerId) query.set('buyerId', params.buyerId);
  if (params.since) query.set('since', params.since);

  const qs = query.toString();
  return await request(`/api/orders${qs ? `?${qs}` : ''}`, { method: 'GET' });
};

/**
 * 2. Create Real Customer Order
 */
export const apiCreateOrder = async (orderData) => {
  return await request('/api/orders', {
    method: 'POST',
    body: JSON.stringify(orderData)
  });
};

/**
 * 3. Accept Order - Atomically locks the order to prevent multiple riders from taking it
 */
export const apiAcceptOrder = async (orderId, riderData) => {
  return await request(`/api/orders/${orderId}/accept`, {
    method: 'POST',
    body: JSON.stringify(riderData)
  });
};

/**
 * 4. Update Order Status Lifecycle:
 * Accepted (RIDER_ASSIGNED) -> Picked Up (PICKED_UP) -> On the Way (ON_THE_WAY) -> Delivered (DELIVERED)
 */
export const apiUpdateOrderStatus = async (orderId, status, riderId, note) => {
  return await request(`/api/orders/${orderId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status, riderId, note })
  });
};

/**
 * 5. Update Live Rider GPS Location
 */
export const apiUpdateRiderLocation = async (orderId, locationData) => {
  return await request(`/api/orders/${orderId}/location`, {
    method: 'POST',
    body: JSON.stringify(locationData)
  });
};

/**
 * 6. Get Live Location for Customer Tracking
 */
export const apiGetOrderLocation = async (orderId) => {
  return await request(`/api/orders/${orderId}/location`, { method: 'GET' });
};

/**
 * 7. Fast Realtime Polling Sync
 */
export const apiSyncOrders = async (sinceTimestamp = 0) => {
  return await request(`/api/sync?since=${sinceTimestamp}`, { method: 'GET' });
};

/**
 * 8. Rider / User Login
 */
export const apiLogin = async (email, password, role) => {
  return await request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password, role })
  });
};
