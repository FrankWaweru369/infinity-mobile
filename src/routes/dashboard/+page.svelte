<script>
  import { onMount, onDestroy } from 'svelte';
  import { goto } from '$app/navigation';
  import { browser } from '$app/environment';
  import Header from '$lib/components/Header.svelte';
  import BottomNav from '$lib/components/BottomNav.svelte';
  import PostCard from '$lib/components/PostCard.svelte';
  import PostSkeleton from '$lib/components/PostSkeleton.svelte';
  import EmptyState from '$lib/components/EmptyState.svelte';
  
  let user = null;
  let token = '';
  let posts = [];
  let loading = true;
  let refreshing = false;
  let scrollContainer;
  
  const API_BASE = 'https://your-api.com'; // Replace with your API
  
  function getAuthHeaders() {
    if (!browser) return {};
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
  }
  
  async function fetchUser() {
    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: getAuthHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        user = data.user || data;
        if (browser) {
          token = localStorage.getItem('token');
        }
      } else {
        goto('/login');
      }
    } catch (err) {
      goto('/login');
    }
  }
  
  async function fetchPosts() {
    loading = true;
    try {
      const res = await fetch(`${API_BASE}/posts`, {
        headers: getAuthHeaders()
      });
      if (res.ok) {
        posts = await res.json();
        posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }
    } catch (err) {
      console.error('Failed to fetch posts', err);
    } finally {
      setTimeout(() => {
        loading = false;
        refreshing = false;
      }, 800);
    }
  }
  
  async function refreshPosts() {
    refreshing = true;
    try {
      const res = await fetch(`${API_BASE}/posts`, {
        headers: getAuthHeaders(),
        cache: 'no-store'
      });
      if (res.ok) {
        posts = await res.json();
        posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }
    } catch (err) {
      console.error('Failed to refresh posts', err);
    } finally {
      setTimeout(() => {
        refreshing = false;
      }, 500);
    }
  }
  
  function scrollToTop() {
    if (scrollContainer) {
      scrollContainer.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }
  
  // Pull to refresh logic
  let startY = 0;
  let pullDistance = 0;
  let isPulling = false;
  
  function handleTouchStart(event) {
    if (!scrollContainer) return;
    if (scrollContainer.scrollTop === 0) {
      startY = event.touches[0].clientY;
      isPulling = true;
    }
  }
  
  function handleTouchMove(event) {
    if (!isPulling) return;
    
    const currentY = event.touches[0].clientY;
    pullDistance = Math.max(0, currentY - startY);
    
    if (pullDistance > 0) {
      event.preventDefault();
      const refreshIndicator = document.querySelector('.pull-to-refresh');
      if (refreshIndicator) {
        const progress = Math.min(pullDistance / 80, 1);
        refreshIndicator.style.transform = `translateY(${Math.min(pullDistance, 80)}px)`;
        refreshIndicator.style.opacity = progress;
      }
    }
  }
  
  function handleTouchEnd() {
    if (isPulling && pullDistance > 60) {
      refreshPosts();
    }
    
    const refreshIndicator = document.querySelector('.pull-to-refresh');
    if (refreshIndicator) {
      refreshIndicator.style.transform = 'translateY(0px)';
      refreshIndicator.style.opacity = '0';
    }
    
    isPulling = false;
    pullDistance = 0;
    startY = 0;
  }
  
  // Handle back button to scroll to top
  function handlePopState() {
    if (scrollContainer && scrollContainer.scrollTop > 0) {
      scrollToTop();
      history.pushState(null, '', location.href);
    } else if (scrollContainer && scrollContainer.scrollTop === 0) {
      history.back();
    }
  }
  
  // Detect if first post is a reel (has video)
  function isReelPost(post) {
    return post.video || post.type === 'reel' || post.content?.includes('#reel');
  }
  
  onMount(() => {
    fetchUser();
    fetchPosts();
    
    if (browser) {
      scrollContainer = document.querySelector('.feed-container');
      
      // Add back button listener
      window.addEventListener('popstate', handlePopState);
      history.pushState(null, '', location.href);
      
      // Add touch listeners for pull to refresh
      if (scrollContainer) {
        scrollContainer.addEventListener('touchstart', handleTouchStart);
        scrollContainer.addEventListener('touchmove', handleTouchMove);
        scrollContainer.addEventListener('touchend', handleTouchEnd);
      }
    }
  });
  
  onDestroy(() => {
    if (browser) {
      window.removeEventListener('popstate', handlePopState);
      if (scrollContainer) {
        scrollContainer.removeEventListener('touchstart', handleTouchStart);
        scrollContainer.removeEventListener('touchmove', handleTouchMove);
        scrollContainer.removeEventListener('touchend', handleTouchEnd);
      }
    }
  });
  
  function handleLogout() {
    if (browser) {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
    }
    goto('/login');
  }
  
  function handleCreatePost() {
    goto('/newPost');
  }
</script>

<div class="dashboard">
  <Header {user} {token} onLogout={handleLogout} />
  
  <div class="feed-container">
    <!-- Pull to refresh indicator -->
    <div class="pull-to-refresh">
      <div class="pull-icon">{refreshing ? '🔄' : '⬇️'}</div>
      <span>{refreshing ? 'Refreshing...' : 'Pull to refresh'}</span>
    </div>
    
    <div class="content">
      {#if loading && !refreshing}
        <PostSkeleton count={3} variant="feed" />
      {:else if posts.length === 0}
        <EmptyState 
          title="No posts yet"
          message="Be the first to share something with the Infinity community!"
          icon="📝"
          actionText="Create your first post"
          onAction={handleCreatePost}
        />
      {:else}
        {#each posts as post, index}
          {#if index === 0 && isReelPost(post)}
            <div class="reel-container">
              <div class="reel-badge">📹 REEL</div>
              <PostCard
                {post}
                currentUserId={user?._id}
                variant="feed"
                onLike={(postId) => console.log('Like', postId)}
                onComment={(postId) => console.log('Comment', postId)}
                onEdit={(post) => console.log('Edit', post)}
                onDelete={(postId) => console.log('Delete', postId)}
              />
            </div>
          {:else}
            <PostCard
              {post}
              currentUserId={user?._id}
              variant="feed"
              onLike={(postId) => console.log('Like', postId)}
              onComment={(postId) => console.log('Comment', postId)}
              onEdit={(post) => console.log('Edit', post)}
              onDelete={(postId) => console.log('Delete', postId)}
            />
          {/if}
        {/each}
      {/if}
    </div>
  </div>
  
  <BottomNav username={user?.username} />
</div>

<style>
  .dashboard {
    min-height: 100vh;
    background: #f9fafb;
    padding-bottom: 80px;
    overflow: hidden;
  }
  
  :global(.dark) .dashboard {
    background: #111827;
  }
  
  .feed-container {
    height: calc(100vh - 56px);
    overflow-y: auto;
    position: relative;
  }
  
  .pull-to-refresh {
    position: absolute;
    top: -60px;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    padding: 12px;
    background: #f3f4f6;
    color: #6b7280;
    font-size: 14px;
    transition: transform 0.2s ease;
    transform: translateY(0px);
    opacity: 0;
    pointer-events: none;
  }
  
  :global(.dark) .pull-to-refresh {
    background: #1f2937;
    color: #9ca3af;
  }
  
  .pull-icon {
    font-size: 18px;
    transition: transform 0.2s;
  }
  
  .content {
    max-width: 600px;
    margin: 0 auto;
    padding: 12px;
  }
  
  .reel-container {
    position: relative;
    margin-bottom: 12px;
  }
  
  .reel-badge {
    position: absolute;
    top: 12px;
    right: 12px;
    background: linear-gradient(135deg, #8b5cf6, #ec4899);
    color: white;
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: bold;
    z-index: 5;
    backdrop-filter: blur(4px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }
  
  .feed-container::-webkit-scrollbar {
    width: 4px;
  }
  
  .feed-container::-webkit-scrollbar-track {
    background: #e5e7eb;
  }
  
  .feed-container::-webkit-scrollbar-thumb {
    background: #8b5cf6;
    border-radius: 4px;
  }
  
  :global(.dark) .feed-container::-webkit-scrollbar-track {
    background: #374151;
  }
</style>
