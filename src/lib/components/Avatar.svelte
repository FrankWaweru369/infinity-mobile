<script>
  export let username = '';
  export let avatarUrl = '';
  export let size = 'md'; // xs, sm, md, lg
  export let clickable = false;
  
  const sizeMap = {
    xs: 28,
    sm: 36,
    md: 44,
    lg: 56
  };
  
  const fontSizeMap = {
    xs: 12,
    sm: 14,
    md: 18,
    lg: 24
  };
</script>

{#if clickable}
  <button class="avatar-btn" style="width: {sizeMap[size]}px; height: {sizeMap[size]}px;">
    {#if avatarUrl}
      <img src={avatarUrl} alt={username} class="avatar-img" />
    {:else}
      <div class="avatar-placeholder" style="font-size: {fontSizeMap[size]}px;">
        {username.charAt(0).toUpperCase()}
      </div>
    {/if}
  </button>
{:else}
  <div class="avatar" style="width: {sizeMap[size]}px; height: {sizeMap[size]}px;">
    {#if avatarUrl}
      <img src={avatarUrl} alt={username} class="avatar-img" />
    {:else}
      <div class="avatar-placeholder" style="font-size: {fontSizeMap[size]}px;">
        {username.charAt(0).toUpperCase()}
      </div>
    {/if}
  </div>
{/if}

<style>
  .avatar, .avatar-btn {
    border-radius: 50%;
    overflow: hidden;
    flex-shrink: 0;
  }
  
  .avatar-btn {
    cursor: pointer;
    border: none;
    padding: 0;
    background: none;
  }
  
  .avatar-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .avatar-placeholder {
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #8b5cf6, #ec4899);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
  }
</style>
