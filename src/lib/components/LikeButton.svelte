<script>
  export let liked = false;
  export let count = 0;
  export let size = 'medium'; // small, medium, large
  export let onLike = () => {};
  
  let animating = false;
  
  function handleClick() {
    animating = true;
    onLike();
    setTimeout(() => animating = false, 300);
  }
  
  const sizeMap = {
    small: { icon: '18px', count: '12px', padding: '4px 6px' },
    medium: { icon: '22px', count: '13px', padding: '6px 8px' },
    large: { icon: '26px', count: '14px', padding: '8px 12px' }
  };
</script>

<button 
  class="like-btn" 
  class:liked 
  class:animating 
  on:click={handleClick}
  style="padding: {sizeMap[size].padding}"
>
  <span class="like-icon" style="font-size: {sizeMap[size].icon}">
    {liked ? '❤️' : '🤍'}
  </span>
  {#if count > 0}
    <span class="like-count" style="font-size: {sizeMap[size].count}">
      {count}
    </span>
  {/if}
</button>

<style>
  .like-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    background: none;
    border: none;
    cursor: pointer;
    border-radius: 8px;
    transition: all 0.2s;
  }
  
  .like-btn:active {
    transform: scale(0.96);
  }
  
  .like-icon {
    transition: transform 0.2s;
  }
  
  .liked .like-count {
    color: #ec4899;
  }
  
  .animating .like-icon {
    animation: bounce 0.3s ease;
  }
  
  @keyframes bounce {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.3); }
  }
</style>
