const CATEGORY_IMAGES = {
  Technology: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format',
  Music: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=600&auto=format',
  Business: 'https://images.unsplash.com/photo-1559223607-b4d0555ae227?w=600&auto=format',
  Cultural: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&auto=format',
  Health: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&auto=format',
  Arts: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?w=600&auto=format',
  Food: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&auto=format',
  Sports: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&auto=format',
};

export const getImageForCategory = (category) => {
  return CATEGORY_IMAGES[category] || CATEGORY_IMAGES.Technology;
};

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Get token from localStorage
const getToken = () => localStorage.getItem('ep_token');

// Headers
const authHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getToken()}`
});

const headers = () => ({
  'Content-Type': 'application/json'
});

// AUTH
export const registerUser = async (userData) => {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(userData)
  });
  return res.json();
};

export const loginUser = async (userData) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(userData)
  });
  return res.json();
};

// EVENTS
export const getEvents = async () => {
  const res = await fetch(`${API_URL}/events`, {
    headers: headers()
  });
  return res.json();
};

export const getEvent = async (id) => {
  const res = await fetch(`${API_URL}/events/${id}`, {
    headers: headers()
  });
  return res.json();
};

export const createEvent = async (eventData) => {
  const res = await fetch(`${API_URL}/events`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(eventData)
  });
  return res.json();
};

export const updateEvent = async (id, eventData) => {
  const res = await fetch(`${API_URL}/events/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(eventData)
  });
  return res.json();
};

export const deleteEvent = async (id) => {
  const res = await fetch(`${API_URL}/events/${id}`, {
    method: 'DELETE',
    headers: authHeaders()
  });
  return res.json();
};

// BOOKINGS
export const createBooking = async (bookingData) => {
  const res = await fetch(`${API_URL}/bookings`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(bookingData)
  });
  return res.json();
};

export const getMyBookings = async () => {
  const res = await fetch(`${API_URL}/bookings/my`, {
    headers: authHeaders()
  });
  return res.json();
};

// CATEGORIES
export const getCategories = async () => {
  const res = await fetch(`${API_URL}/categories`, {
    headers: headers()
  });
  return res.json();
};

// ADMIN
export const getAdminUsers = async () => {
  const res = await fetch(`${API_URL}/admin/users`, {
    headers: authHeaders()
  });
  return res.json();
};

export const getAdminStats = async () => {
  const res = await fetch(`${API_URL}/admin/stats`, {
    headers: authHeaders()
  });
  return res.json();
};

export const getAdminBookings = async () => {
  const res = await fetch(`${API_URL}/admin/bookings`, {
    headers: authHeaders()
  });
  return res.json();
};