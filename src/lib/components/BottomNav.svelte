<script>
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { Home, Search, Plus, Video, User } from 'lucide-svelte';
  
  export let username = '';
  
  function isActive(path) {
    if (path === '/dashboard') {
      return $page.url.pathname === '/dashboard';
    }
    if (path === '/profile') {
      return $page.url.pathname.includes('/profile');
    }
    return $page.url.pathname === path;
  }
  
  function navigateTo(path) {
    goto(path);
  }
</script>

<div class="bottom-nav">
  <button
    on:click={() => navigateTo('/dashboard')}
    class="nav-item"
    class:active={isActive('/dashboard')}
  >
    <Home size={22} />
    <span class="label">Home</span>
  </button>

  <button
    on:click={() => navigateTo('/explore')}
    class="nav-item"
    class:active={isActive('/explore')}
  >
    <Search size={22} />
    <span class="label">Explore</span>
  </button>

  <div class="post-button-wrapper">
    <button
      on:click={() => navigateTo('/newPost')}
      class="post-button"
    >
      <Plus size={26} color="white" strokeWidth={2.5} />
    </button>
  </div>

  <button
    on:click={() => navigateTo('/reels')}
    class="nav-item"
    class:active={isActive('/reels')}
  >
    <Video size={22} />
    <span class="label">Reels</span>
  </button>

  {#if username}
    <button
      on:click={() => navigateTo(`/profile/${username}`)}
      class="nav-item"
      class:active={isActive('/profile')}
    >
      <User size={22} />
      <span class="label">Profile</span>
    </button>
  {:else}
    <button
      on:click={() => navigateTo('/login')}
      class="nav-item"
    >
      <User size={22} />
      <span class="label">Login</span>
    </button>
  {/if}
</div>

<style>
  .bottom-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(12px);
    border-top: 1px solid #e5e7eb;
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 8px 12px 12px;
    z-index: 40;
  }
  
  :global(.dark) .bottom-nav {
    background: rgba(31, 41, 55, 0.95);
    border-top-color: #374151;
  }
  
  .nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px 12px;
    border-radius: 8px;
    transition: all 0.2s;
    color: #6b7280;
  }
  
  :global(.dark) .nav-item {
    color: #9ca3af;
  }
  
  .nav-item.active {
    color: #8b5cf6;
  }
  
  :global(.dark) .nav-item.active {
    color: #a78bfa;
  }
  
  .nav-item:active {
    transform: scale(0.95);
  }
  
  .label {
    font-size: 11px;
    font-weight: 500;
  }
  
  .post-button-wrapper {
    position: relative;
    top: -8px;
  }
  
  .post-button {
    background: #8b5cf6;
    border: 2px solid white;
    border-radius: 50%;
    width: 52px;
    height: 52px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
  }
  
  :global(.dark) .post-button {
    border-color: #1f2937;
  }
  
  .post-button:active {
    transform: scale(0.95);
  }
</style>
