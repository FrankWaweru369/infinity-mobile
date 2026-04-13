<script>
  import { goto } from '$app/navigation';
  import Avatar from './Avatar.svelte';
  import LikeButton from './LikeButton.svelte';
  
  export let post = {};
  export let currentUserId = '';
  export let variant = 'feed'; // feed, profile, notification
  export let onLike = (postId) => {};
  export let onComment = (postId) => {};
  export let onEdit = (post) => {};
  export let onDelete = (postId) => {};
  
  let menuOpen = false;
  
  function formatDate(date) {
    const now = new Date();
    const postDate = new Date(date);
    const diff = Math.floor((now.getTime() - postDate.getTime()) / 1000);
    
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return postDate.toLocaleDateString();
  }
  
  function handleLikeClick() {
    onLike(post._id);
  }
  
  function handleCommentClick() {
    onComment(post._id);
  }
  
  function toggleMenu() {
    menuOpen = !menuOpen;
  }
</script>

<div class="post-card" class:profile={variant === 'profile'}>
  <!-- Header -->
  <div class="post-header">
    <div class="user-info" on:click={() => goto(`/profile/${post.author?.username}`)}>
      <Avatar 
        username={post.author?.username || 'User'} 
        avatarUrl={post.author?.profilePicture}
        size="md"
      />
      <div class="user-details">
        <span class="username">{post.author?.username}</span>
        <span class="timestamp">{formatDate(post.createdAt)}</span>
      </div>
    </div>
    
    <!-- Three-dot menu -->
    {#if post.author?._id === currentUserId}
      <div class="menu-container">
        <button class="menu-btn" on:click={toggleMenu}>⋮</button>
        {#if menuOpen}
          <div class="menu-dropdown">
            <button on:click={() => { onEdit(post); menuOpen = false; }}>✏️ Edit</button>
            <button on:click={() => { onDelete(post._id); menuOpen = false; }}>🗑️ Delete</button>
          </div>
        {/if}
      </div>
    {/if}
  </div>
  
  <!-- Content -->
  <div class="post-content">
    <p class="post-text">{post.content}</p>
    {#if post.image}
      <div class="post-image">
        <img src={post.image} alt="Post" loading="lazy" />
      </div>
    {/if}
  </div>
  
  <!-- Actions -->
  <div class="post-actions">
    <LikeButton 
      liked={post.isLiked} 
      count={post.likes?.length || 0}
      onLike={handleLikeClick}
      size="medium"
    />
    
    <button class="action-btn" on:click={handleCommentClick}>
      <span class="action-icon">💬</span>
      <span class="action-count">{post.comments?.length || 0}</span>
    </button>
  </div>
  
  <!-- Comments preview -->
  {#if (post.comments?.length || 0) > 0}
    <div class="comments-preview" on:click={handleCommentClick}>
      View all {post.comments?.length} comments
    </div>
  {/if}
</div>

<style>
  .post-card {
    background: white;
    border-radius: 16px;
    padding: 16px;
    margin-bottom: 12px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  :global(.dark) .post-card {
    background: #1f2937;
  }
  
  .post-card.profile {
    padding: 12px;
    margin-bottom: 8px;
  }
  
  .post-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }
  
  .user-info {
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    flex: 1;
  }
  
  .user-details {
    display: flex;
    flex-direction: column;
  }
  
  .username {
    font-weight: 600;
    font-size: 14px;
  }
  
  .timestamp {
    font-size: 11px;
    color: #9ca3af;
  }
  
  .post-content {
    margin-bottom: 12px;
  }
  
  .post-text {
    font-size: 14px;
    line-height: 1.5;
    margin: 0 0 12px 0;
  }
  
  .post-image img {
    width: 100%;
    border-radius: 12px;
    max-height: 400px;
    object-fit: cover;
  }
  
  .post-actions {
    display: flex;
    gap: 24px;
    padding: 8px 0;
    border-top: 1px solid #e5e7eb;
  }
  
  .action-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 8px 12px;
    border-radius: 8px;
  }
  
  .action-btn:active {
    background: #f3f4f6;
    transform: scale(0.96);
  }
  
  .action-icon {
    font-size: 20px;
  }
  
  .action-count {
    font-size: 13px;
    color: #6b7280;
  }
  
  .comments-preview {
    font-size: 12px;
    color: #9ca3af;
    margin-top: 8px;
    cursor: pointer;
  }
  
  .menu-container {
    position: relative;
  }
  
  .menu-btn {
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    padding: 4px 8px;
  }
  
  .menu-dropdown {
    position: absolute;
    right: 0;
    top: 100%;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    overflow: hidden;
    z-index: 10;
  }
  
  .menu-dropdown button {
    display: block;
    width: 100%;
    padding: 10px 16px;
    text-align: left;
    background: none;
    border: none;
    cursor: pointer;
  }
  
  .menu-dropdown button:hover {
    background: #f3f4f6;
  }
</style>
