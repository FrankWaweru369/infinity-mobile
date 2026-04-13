<script>
  export let count = 3;
  export let variant = 'feed'; // feed, reel, profile
</script>

{#each Array(count) as _, i}
  <div class="skeleton-card" class:reel-variant={variant === 'reel'}>
    <!-- Header -->
    <div class="skeleton-header">
      <div class="skeleton-avatar"></div>
      <div class="skeleton-info">
        <div class="skeleton-line username"></div>
        <div class="skeleton-line timestamp"></div>
      </div>
    </div>
    
    <!-- Content text -->
    <div class="skeleton-text">
      <div class="skeleton-line text-line"></div>
      <div class="skeleton-line text-line short"></div>
    </div>
    
    <!-- Media placeholder (Image or Video) -->
    {#if variant === 'reel'}
      <!-- Reel/Video skeleton -->
      <div class="skeleton-media reel-media">
        <div class="video-play-button"></div>
        <div class="video-duration"></div>
      </div>
    {:else}
      <!-- Image skeleton -->
      <div class="skeleton-media image-media"></div>
    {/if}
    
    <!-- Actions -->
    <div class="skeleton-actions">
      <div class="skeleton-action">
        <div class="action-icon"></div>
        <div class="action-count"></div>
      </div>
      <div class="skeleton-action">
        <div class="action-icon"></div>
        <div class="action-count"></div>
      </div>
      <div class="skeleton-action">
        <div class="action-icon"></div>
      </div>
    </div>
  </div>
{/each}

<style>
  .skeleton-card {
    background: white;
    border-radius: 16px;
    padding: 16px;
    margin-bottom: 12px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  :global(.dark) .skeleton-card {
    background: #1f2937;
  }
  
  .skeleton-card.reel-variant {
    border-left: 4px solid #8b5cf6;
  }
  
  /* Header */
  .skeleton-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
  }
  
  .skeleton-avatar {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }
  
  :global(.dark) .skeleton-avatar {
    background: linear-gradient(90deg, #374151 25%, #4b5563 50%, #374151 75%);
    background-size: 200% 100%;
  }
  
  .skeleton-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  
  .skeleton-line {
    height: 12px;
    background: linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: 4px;
  }
  
  :global(.dark) .skeleton-line {
    background: linear-gradient(90deg, #374151 25%, #4b5563 50%, #374151 75%);
    background-size: 200% 100%;
  }
  
  .skeleton-line.username {
    width: 120px;
    height: 14px;
  }
  
  .skeleton-line.timestamp {
    width: 80px;
    height: 10px;
  }
  
  /* Text content */
  .skeleton-text {
    margin-bottom: 12px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .skeleton-line.text-line {
    width: 100%;
    height: 14px;
  }
  
  .skeleton-line.text-line.short {
    width: 70%;
  }
  
  /* Media placeholder */
  .skeleton-media {
    width: 100%;
    border-radius: 12px;
    margin: 12px 0;
    background: linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }
  
  :global(.dark) .skeleton-media {
    background: linear-gradient(90deg, #374151 25%, #4b5563 50%, #374151 75%);
    background-size: 200% 100%;
  }
  
  .image-media {
    height: 280px;
  }
  
  .reel-media {
    height: 400px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .video-play-button {
    width: 60px;
    height: 60px;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 50%;
    position: relative;
  }
  
  .video-play-button::after {
    content: '▶';
    position: absolute;
    top: 50%;
    left: 55%;
    transform: translate(-50%, -50%);
    font-size: 24px;
    color: #8b5cf6;
  }
  
  .video-duration {
    position: absolute;
    bottom: 12px;
    right: 12px;
    width: 40px;
    height: 20px;
    background: rgba(0, 0, 0, 0.6);
    border-radius: 4px;
  }
  
  /* Actions */
  .skeleton-actions {
    display: flex;
    gap: 24px;
    margin-top: 8px;
    padding-top: 12px;
    border-top: 1px solid #e5e7eb;
  }
  
  :global(.dark) .skeleton-actions {
    border-top-color: #374151;
  }
  
  .skeleton-action {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  
  .action-icon {
    width: 22px;
    height: 22px;
    border-radius: 4px;
    background: linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }
  
  :global(.dark) .action-icon {
    background: linear-gradient(90deg, #374151 25%, #4b5563 50%, #374151 75%);
    background-size: 200% 100%;
  }
  
  .action-count {
    width: 30px;
    height: 14px;
    border-radius: 4px;
    background: linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }
  
  :global(.dark) .action-count {
    background: linear-gradient(90deg, #374151 25%, #4b5563 50%, #374151 75%);
    background-size: 200% 100%;
  }
  
  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }
  
  /* Responsive */
  @media (max-width: 640px) {
    .image-media {
      height: 200px;
    }
    
    .reel-media {
      height: 350px;
    }
    
    .video-play-button {
      width: 50px;
      height: 50px;
    }
    
    .video-play-button::after {
      font-size: 20px;
    }
  }
</style>
