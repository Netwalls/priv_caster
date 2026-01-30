// Utility for backend post API

const API_BASE = 'https://priv-caster.onrender.com';

export async function savePost(post) {
  const res = await fetch(`${API_BASE}/post`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(post)
  });
  if (!res.ok) throw new Error('Failed to save post');
  return res.json();
}

export async function fetchPosts() {
  const res = await fetch(`${API_BASE}/posts`);
  if (!res.ok) throw new Error('Failed to fetch posts');
  return res.json();
}

export async function deletePost(postId) {
  const res = await fetch(`${API_BASE}/post/${postId}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Failed to delete post');
  return res.json();
}
