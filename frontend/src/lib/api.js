import { API_BASE } from './supabase';
import { supabase } from './supabase';

async function getAuthHeaders() {
  const headers = { 'Content-Type': 'application/json' };
  if (supabase) {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      headers.Authorization = `Bearer ${session.access_token}`;
    }
  }
  return headers;
}

async function fetchApi(path, options = {}) {
  try {
    const res = await fetch(`${API_BASE}${path}`, options);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || data.details || res.statusText || 'Request failed');
    return data;
  } catch (err) {
    if (err.message === 'Failed to fetch' || err.name === 'TypeError') {
      throw new Error('Cannot reach server. Make sure the backend is running on port 5000.');
    }
    throw err;
  }
}

export async function generateTrip(constraints) {
  const headers = await getAuthHeaders();
  const data = await fetchApi('/generate-trip', {
    method: 'POST',
    headers,
    body: JSON.stringify(constraints),
  });
  return data;
}

export async function modifyTrip(previousTrip, userInstruction) {
  const headers = await getAuthHeaders();
  return fetchApi('/modify-trip', {
    method: 'POST',
    headers,
    body: JSON.stringify({ previousTrip, userInstruction }),
  });
}

export async function saveTrip(tripData) {
  const headers = await getAuthHeaders();
  return fetchApi('/save-trip', {
    method: 'POST',
    headers,
    body: JSON.stringify({ trip_data: tripData }),
  });
}

export async function getMyTrips() {
  const headers = await getAuthHeaders();
  return fetchApi('/my-trips', { headers });
}

export async function deleteTrip(id) {
  const headers = await getAuthHeaders();
  return fetchApi(`/trip/${id}`, { method: 'DELETE', headers });
}
