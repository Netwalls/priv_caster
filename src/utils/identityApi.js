// Utility for interacting with the backend identity API

const API_BASE = 'http://localhost:4000'; // Change to your backend URL if deployed

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
