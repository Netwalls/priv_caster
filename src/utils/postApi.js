// Utility for backend post API

export async function savePost(post) {
  const res = await fetch('http://localhost:4000/post', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(post)
  });
  if (!res.ok) throw new Error('Failed to save post');
  return res.json();
}

export async function fetchPosts() {
  const res = await fetch('http://localhost:4000/posts');
  if (!res.ok) throw new Error('Failed to fetch posts');
  return res.json();
}

export async function deletePost(postId) {
  const res = await fetch(`http://localhost:4000/post/${postId}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Failed to delete post');
  return res.json();
}
