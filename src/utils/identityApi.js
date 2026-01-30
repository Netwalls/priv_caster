// Utility for interacting with the backend identity API
// Uses Vercel proxy to avoid CORS issues
const API_BASE = import.meta.env.VITE_API_URL || '/api';

export async function saveIdentity(address, identity) {
  const res = await fetch(`${API_BASE}/identity`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ address, identity })
  });
  if (!res.ok) throw new Error('Failed to save identity');
  return res.json();
}

export async function fetchIdentity(address) {
  const res = await fetch(`${API_BASE}/identity/${address}`);
  if (!res.ok) return null;
  return res.json();
}
