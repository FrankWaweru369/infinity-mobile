<script>
  import { goto } from '$app/navigation';
  import { browser } from '$app/environment';
  import Avatar from './Avatar.svelte';
  
  export let user = null;
  export let token = '';
  export let onLogout = () => {};
  
  let isMenuOpen = false;
  let isDarkMode = false;
  
  // Only run this code in the browser
  if (browser) {
    isDarkMode = localStorage.getItem('theme') === 'dark' ||
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
  }
  
  function toggleTheme() {
    isDarkMode = !isDarkMode;
    if (browser) {
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    }
  }
  
  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
  }
  
  function handleLogout() {
    isMenuOpen = false;
    onLogout();
  }
  
  function navigateToProfile() {
    goto(`/profile/${user?.username}`);
    isMenuOpen = false;
  }
  
  // Close menu when clicking outside
  function handleClickOutside(event) {
    const menuElement = document.querySelector('.menu-dropdown-container');
    if (menuElement && !menuElement.contains(event.target)) {
      isMenuOpen = false;
    }
  }
  
  if (browser) {
    window.addEventListener('click', handleClickOutside);
  }
</script>

<div class="header">
  <h1 class="logo" on:click={() => goto('/dashboard')}>
    ∞ Infinity
  </h1>

  {#if user}
    <div class="header-right">
      <!-- Notifications Button -->
      <button class="notification-btn" on:click={() => goto('/notifications')}>
        <svg class="bell-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      </button>

      <!-- Profile Info -->
      <button class="profile-info" on:click={navigateToProfile}>
        <Avatar 
          username={user.username} 
          avatarUrl={user.profilePicture}
          size="sm"
        />
        <span class="username">{user.username}</span>
      </button>

      <!-- Menu Button -->
      <div class="menu-dropdown-container">
        <button class="menu-btn" on:click={toggleMenu}>
          <svg class="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        <!-- Dropdown Menu -->
        {#if isMenuOpen}
          <div class="dropdown-menu">
            <!-- Dark Mode Toggle -->
            <div class="dropdown-item">
              <span class="dropdown-label">Dark Mode</span>
              <button
                on:click={toggleTheme}
                class="toggle-switch"
                class:active={isDarkMode}
              >
                <span class="toggle-slider" class:active={isDarkMode} />
              </button>
            </div>

            <!-- Logout Button -->
            <button
              on:click={handleLogout}
              class="logout-btn"
            >
              Logout
            </button>
          </div>
        {/if}
      </div>
    </div>
  {/if}
</div>

<style>
  .header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(12px);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    z-index: 50;
  }
  
  :global(.dark) .header {
    background: rgba(17, 24, 39, 0.95);
  }
  
  .logo {
    font-size: 20px;
    font-weight: bold;
    background: linear-gradient(135deg, #8b5cf6, #ec4899);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    cursor: pointer;
  }
  
  .header-right {
    display: flex;
    align-items: center;
    gap: 16px;
  }
  
  .notification-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 6px;
    border-radius: 8px;
    transition: background 0.2s;
    color: #4b5563;
  }
  
  :global(.dark) .notification-btn {
    color: #9ca3af;
  }
  
  .notification-btn:active {
    background: #f3f4f6;
  }
  
  .bell-icon {
    width: 20px;
    height: 20px;
  }
  
  .profile-info {
    display: flex;
    align-items: center;
    gap: 8px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 24px;
    transition: background 0.2s;
  }
  
  .profile-info:active {
    background: #f3f4f6;
  }
  
  .username {
    font-size: 14px;
    font-weight: 500;
    color: #1f2937;
  }
  
  :global(.dark) .username {
    color: #f3f4f6;
  }
  
  .menu-dropdown-container {
    position: relative;
  }
  
  .menu-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 6px;
    border-radius: 8px;
    transition: background 0.2s;
    color: #4b5563;
  }
  
  :global(.dark) .menu-btn {
    color: #9ca3af;
  }
  
  .menu-btn:active {
    background: #f3f4f6;
  }
  
  .menu-icon {
    width: 20px;
    height: 20px;
  }
  
  .dropdown-menu {
    position: absolute;
    right: 0;
    top: 100%;
    margin-top: 8px;
    width: 200px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    border: 1px solid #e5e7eb;
    overflow: hidden;
    z-index: 50;
  }
  
  :global(.dark) .dropdown-menu {
    background: #1f2937;
    border-color: #374151;
  }
  
  .dropdown-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    border-bottom: 1px solid #e5e7eb;
  }
  
  :global(.dark) .dropdown-item {
    border-bottom-color: #374151;
  }
  
  .dropdown-label {
    font-size: 14px;
    color: #1f2937;
  }
  
  :global(.dark) .dropdown-label {
    color: #f3f4f6;
  }
  
  .toggle-switch {
    position: relative;
    display: inline-flex;
    height: 24px;
    width: 44px;
    align-items: center;
    border-radius: 9999px;
    transition: background 0.2s;
    background: #d1d5db;
    border: none;
    cursor: pointer;
  }
  
  .toggle-switch.active {
    background: #8b5cf6;
  }
  
  .toggle-slider {
    display: inline-block;
    height: 18px;
    width: 18px;
    transform: translateX(4px);
    border-radius: 9999px;
    background: white;
    transition: transform 0.2s;
  }
  
  .toggle-slider.active {
    transform: translateX(22px);
  }
  
  .logout-btn {
    width: 100%;
    padding: 12px 16px;
    text-align: left;
    background: #ef4444;
    border: none;
    color: white;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s;
  }
  
  .logout-btn:active {
    background: #dc2626;
  }
  
  @media (max-width: 640px) {
    .header {
      padding: 10px 12px;
    }
    
    .username {
      display: none;
    }
    
    .profile-info {
      padding: 4px;
    }
  }
</style>
