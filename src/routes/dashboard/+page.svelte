<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { browser } from '$app/environment';
  import Header from '$lib/components/Header.svelte';
  import BottomNav from '$lib/components/BottomNav.svelte';
  import PostCard from '$lib/components/PostCard.svelte';
  
  const API_BASE = import.meta.env.PROD
    ? 'https://infinity-app-127d.onrender.com/api'
    : 'http://localhost:10000/api';
  
  let user = null;
  let posts = [];
  let loading = true;
  let error = null;
  
  async function fetchPosts(token) {
    try {
      const response = await fetch(`${API_BASE}/posts`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        posts = Array.isArray(data) ? data : data.posts || [];
        posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }
    } catch (err) {
      console.error('Failed to fetch posts:', err);
    }
  }
  
  onMount(async () => {
    if (!browser) return;
    
    const token = localStorage.getItem('token');
    
    if (!token) {
      goto('/login');
      return;
    }
    
    try {
      const response = await fetch(`${API_BASE}/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        user = data.user || data;
        await fetchPosts(token);
      } else {
        localStorage.removeItem('token');
        goto('/login');
      }
    } catch (err) {
      console.error('Error:', err);
      error = err.message;
    } finally {
      loading = false;
    }
  });
  
  function handleLogout() {
    localStorage.removeItem('token');
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
        <PostCard {post} currentUserId={user?._id} />
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
