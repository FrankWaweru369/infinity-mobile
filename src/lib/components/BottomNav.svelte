<script>
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';

  export let user = null;
  $: currentPath = $page.url.pathname;

  // Tailwind Purple 800
  const purple800 = "#6b21a8";
</script>

<nav class="nav-wrapper">
  <div class="bottom-nav">
    <button 
      class="nav-item" 
      class:active={currentPath === '/dashboard'} 
      on:click={() => goto('/dashboard')}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
      <span>Home</span>
    </button>

    <button 
      class="nav-item" 
      class:active={currentPath === '/explore'} 
      on:click={() => goto('/explore')}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
      <span>Explore</span>
    </button>

    <div class="center-action">
      <button class="plus-btn" on:click={() => goto('/newPost')}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
      </button>
    </div>

    <button 
      class="nav-item" 
      class:active={currentPath === '/reels'} 
      on:click={() => goto('/reels')}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2" ry="2"/>
      </svg>
      <span>Reels</span>
    </button>

    <button 
      class="nav-item" 
      class:active={currentPath.includes('/profile')} 
      on:click={() => user ? goto(`/profile/${user.username}`) : goto('/login')}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
      </svg>
      <span>Profile</span>
    </button>
  </div>
</nav>

<style>
  .nav-wrapper {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background: var(--header-bg);
    border-top: 1px solid var(--border-color);
    z-index: 100;
    display: flex;
    justify-content: center;
  }

  .bottom-nav {
    width: 100%;
    max-width: 500px; 
    height: 65px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 0 10px;
  }

  .nav-item {
    background: none;
    border: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
    color: var(--icon-color, #8e8e8e);
    cursor: pointer;
    flex: 1;
    transition: all 0.2s;
    -webkit-tap-highlight-color: transparent;
  }

  .nav-item span {
    font-size: 10px;
    font-weight: 500;
  }

  .nav-item.active {
    color: #6b21a8; /* Purple 800 */
  }

  .center-action {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .plus-btn {
    width: 46px;
    height: 46px;
    background: #6b21a8; /* Purple 800 */
    border-radius: 12px;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(107, 33, 168, 0.4);
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .plus-btn:active {
    transform: scale(0.9);
  }

  :global(.dark) .plus-btn {
    box-shadow: 0 0 15px rgba(107, 33, 168, 0.5);
  }
</style>
