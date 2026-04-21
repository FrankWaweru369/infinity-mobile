<script>
  export let post = {};
  export let currentUserId = '';
  
  let liked = post.isLiked || false;
  let likesCount = post.likes?.length || 0;
  
  function handleLike() {
    liked = !liked;
    likesCount = liked ? likesCount + 1 : likesCount - 1;
  }
  
  function formatDate(date) {
    if (!date) return '';
    const d = new Date(date);
    const now = new Date();
    const diff = Math.floor((now.getTime() - d.getTime()) / 1000);
    
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  }
</script>

<div class="post-card">
  <div class="post-header">
    <div class="user-info">
      <div class="avatar">
        {#if post.author?.profilePicture}
          <img src={post.author.profilePicture} alt={post.author.username} />
        {:else}
          <div class="avatar-placeholder">
            {post.author?.username?.charAt(0)?.toUpperCase() || 'U'}
          </div>
        {/if}
      </div>
      <div class="user-details">
        <span class="username">{post.author?.username || 'Unknown'}</span>
        <span class="timestamp">{formatDate(post.createdAt)}</span>
      </div>
    </div>
  </div>
  
  <div class="post-content">
    <p class="post-text">{post.content || ''}</p>
    {#if post.image}
      <div class="post-image-container">
        <img 
          src={post.image} 
          alt="Post" 
          class="post-image"
          loading="lazy"
        />
      </div>
    {/if}
  </div>
  
  <div class="post-actions">
    <button class="like-btn" class:liked on:click={handleLike}>
      <span class="action-icon">{liked ? '❤️' : '🤍'}</span>
      <span class="action-count">{likesCount}</span>
    </button>
    
    <button class="comment-btn">
      <span class="action-icon">💬</span>
      <span class="action-count">{post.comments?.length || 0}</span>
    </button>
  </div>
</div>

<style>
  .post-card {
    background: transparent;
    width: 100%;
    margin: 0;
    padding: 0;
    border: none;
    box-shadow: none;
  }
  
  .post-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    margin: 0;
  }
  
  .user-info {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
    background: #2a2a2a;
    flex-shrink: 0;
  }
  
  .avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .avatar-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #8b5cf6, #ec4899);
    color: white;
    font-weight: bold;
    font-size: 18px;
  }
  
  .user-details {
    display: flex;
    flex-direction: column;
  }
  
  .username {
    font-weight: 600;
    font-size: 14px;
    color: #ffffff;
  }
  
  .timestamp {
    font-size: 11px;
    color: #9ca3af;
  }
  
  .post-content {
    padding: 0 16px 12px 16px;
    margin: 0;
  }
  
  .post-text {
    font-size: 14px;
    line-height: 1.5;
    margin: 0 0 12px 0;
    color: #e5e5e5;
  }
  
  .post-image-container {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: transparent;
    border-radius: 0;
    overflow: hidden;
    margin: 0;
    padding: 0;
  }
  
  .post-image {
    width: 90%;
    height: auto;
    max-height: 500px;
    object-fit: contain;
    display: block;
    border-radius: 12px;
  }
  
  .post-actions {
    display: flex;
    gap: 24px;
    padding: 8px 16px 12px 16px;
    margin: 0;
    border: none;
  }
  
  .like-btn, .comment-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 6px 8px;
    border-radius: 8px;
    font-size: 14px;
    transition: all 0.2s;
  }
  
  .like-btn:active, .comment-btn:active {
    background: rgba(255, 255, 255, 0.1);
    transform: scale(0.96);
  }
  
  .action-icon {
    font-size: 20px;
  }
  
  .action-count {
    font-size: 13px;
    color: #9ca3af;
  }
  
  .like-btn.liked .action-icon {
    color: #ec4899;
  }
  
  .like-btn.liked .action-count {
    color: #ec4899;
  }
  
  @media (max-width: 640px) {
    .post-header {
      padding: 10px 12px;
    }
    
    .post-content {
      padding: 0 12px 10px 12px;
    }
    
    .post-image {
      width: 90%;
    }
    
    .post-actions {
      padding: 6px 12px 10px 12px;
    }
  }
</style>
