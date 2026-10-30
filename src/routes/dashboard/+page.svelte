<script>
  import { onMount, tick } from 'svelte';
  import { goto } from '$app/navigation';
  import { browser } from '$app/environment';
  import Header from '$lib/components/Header.svelte';
  import BottomNav from '$lib/components/BottomNav.svelte';
  import PostCard from '$lib/components/PostCard.svelte';

  import {
    getAccessToken,
    clearSession
  } from '$lib/services/session.js';

  const AUTH_API_BASE = import.meta.env.PROD
    ? 'https://infinity-app-mobile-backend.onrender.com/api'
    : 'http://localhost:10001/api';

  const POSTS_API_BASE = import.meta.env.PROD
    ? 'https://infinity-app-127d.onrender.com/api'
    : 'http://localhost:10000/api';

  let user = null;
  let posts = [];
  let loading = true;
  let error = null;

 async function fetchPosts(token) {
try {
const response = await fetch(`${POSTS_API_BASE}/posts`, {
  headers: { Authorization: `Bearer ${token}` }
});

if (!response.ok) {
  return;
}

const responseText = await response.text();
const data = JSON.parse(responseText);

const fetchedPosts = Array.isArray(data)
  ? data
  : Array.isArray(data?.posts)
    ? data.posts
    : [];

fetchedPosts.sort(
  (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
);

const viewerId = String(user?.id || user?._id || '');

posts = fetchedPosts.map((post) => {
  const postLikes = Array.isArray(post.likes) ? post.likes : [];

  const isLiked = postLikes.some((like) => {
    const likedUserId = like && typeof like === 'object'
      ? like._id
      : like;

    return String(likedUserId) === viewerId;
  });

  return { ...post, isLiked };
});

} catch (err) {
console.error('Error fetching posts:', err);
}
}

  async function openRequestedPost(token) {
    const postId = new URLSearchParams(window.location.search).get('post');
    if (!postId) return;

    let targetPost = posts.find(
      (post) => String(post._id || post.id) === postId
    );

    if (!targetPost) {
      try {
        const response = await fetch(
          `${POSTS_API_BASE}/posts/${encodeURIComponent(postId)}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!response.ok) {
          error = response.status === 404 || response.status === 403
            ? 'This post is unavailable or you no longer have permission to view it.'
            : 'Could not open this post. Please try again.';
          return;
        }

        const result = await response.json();
        targetPost = result?.post || result;

        if (!targetPost || !(targetPost._id || targetPost.id)) {
          error = 'The requested post could not be found.';
          return;
        }

        const viewerId = String(user?.id || user?._id || '');
        const postLikes = Array.isArray(targetPost.likes)
          ? targetPost.likes
          : [];

        const isLiked = postLikes.some((like) => {
          const likedUserId = like && typeof like === 'object'
            ? like._id
            : like;
          return String(likedUserId) === viewerId;
        });

        targetPost = { ...targetPost, isLiked };
        posts = [
          targetPost,
          ...posts.filter(
            (post) => String(post._id || post.id) !== postId
          )
        ];
      } catch (err) {
        console.error('Error opening notification post:', err);
        error = 'Could not open this post. Check your connection and try again.';
        return;
      }
    }

    await tick();
    const element = document.getElementById(`post-${postId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      element.classList.add('notification-target');
      window.setTimeout(() => element.classList.remove('notification-target'), 2200);
    }
  }

  onMount(async () => {
    if (!browser) return;

    const token = getAccessToken();

    if (!token) {
      goto('/login');
      return;
    }

    try {
      const response = await fetch(`${AUTH_API_BASE}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });


      if (response.ok) {
  const data = await response.json();
  user = data.user || data;
  await fetchPosts(token);
  await openRequestedPost(token);
} else {
        clearSession();
        goto('/login');
      }
    } catch (err) {
      console.error('Dashboard authentication error:', err);
      error = err.message;
    } finally {
loading = false;
}
  });

  function handleLogout() {
    clearSession();
    goto('/login');
  }
</script>

<div class="dashboard">
  <Header {user} onLogout={handleLogout} />
  
  <div class="content">
    {#if loading}
      <div class="loading">Loading posts...</div>
    {:else if error}
      <div class="error">
        <p>Error: {error}</p>
        <button on:click={() => goto('/login')}>Go to Login</button>
      </div>
    {:else if posts.length === 0}
  <div class="empty">
    <p>No posts yet. Be the first to post!</p>
  </div>
{:else}
  {#each posts as post}
    <div id={`post-${post._id || post.id}`} class="post-anchor">
      <PostCard {post} currentUserId={user?.id || user?._id} />
    </div>
  {/each}
{/if}
  </div>
  
  <BottomNav username={user?.username} />
</div>

<style>
  .dashboard {
    min-height: 100vh;
    background: var(--bg-primary);
    padding-bottom: 80px;
    margin: 0;
    padding: 0;
  }
  
  .post-anchor {
    scroll-margin-top: 84px;
  }

  .post-anchor.notification-target {
    outline: 2px solid var(--border-color);
    outline-offset: -2px;
  }

  .content {
    padding: 80px 0 20px 0;
    margin: 0;
    width: 100%;
    max-width: 100%;
  }
  
  .loading, .error, .empty {
    text-align: center;
    padding: 40px;
    color: var(--text-secondary);
  }
  
  button {
    background: #8b5cf6;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 8px;
    margin-top: 16px;
    cursor: pointer;
  }
</style>
