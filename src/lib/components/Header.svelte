<script>
  import { goto } from '$app/navigation';
  import { browser } from '$app/environment';
  
  export let user = null;
  export let token = null;
  export let isDarkMode = false;
  export let toggleTheme = () => {};
  export let onLogout = () => {};
  
  let isMenuOpen = false;
  
  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
  }
  
  function getInitials(name) {
    if (!name) return "U";
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }
  
  function imageUrl(img) {
    if (!img) return null;
    if (img.startsWith("http")) return img;
    const API_BASE = import.meta.env.PROD
      ? 'https://infinity-app-127d.onrender.com'
      : 'http://localhost:10000';
    return `${API_BASE}/${img.replace(/^\//, '')}`;
  }
</script>

<header class="header">
  <h1 class="logo" on:click={() => goto('/dashboard')}>
    ∞ Infinity
  </h1>

  {#if user}
    <div class="header-right">
      <!-- Bell Icon -->
      <button class="bell-btn">
        <svg class="bell-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      </button>

      <!-- Profile -->
      <button class="profile-btn" on:click={() => goto(`/profile/${user.username}`)}>
        {#if user.profilePicture}
          <img
            src={imageUrl(user.profilePicture)}
            alt={user.username}
            class="avatar-img"
          />
        {:else}
          <div class="avatar-placeholder">
            {getInitials(user.username)}
          </div>
        {/if}
        <span class="username">{user.username}</span>
      </button>

      <!-- Menu Button -->
      <div class="menu-container">
        <button class="menu-btn" on:click={toggleMenu}>
          <svg class="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        {#if isMenuOpen}
          <div class="dropdown" on:click={toggleMenu}>
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
              on:click={() => { onLogout(); isMenuOpen = false; }}
              class="logout-btn"
            >
              Logout
            </button>
          </div>
        {/if}
      </div>
    </div>
  {/if}
</header>

<style>
  .header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    background: #ffffff;
    border-bottom: 1px solid #e5e7eb;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    z-index: 50;
  }
  
  :global(.dark) .header {
    background: #111827;
    border-bottom-color: #374151;
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
    position: relative;
  }
  
  .bell-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 6px;
    border-radius: 8px;
    color: #4b5563;
  }
  
  :global(.dark) .bell-btn {
    color: #9ca3af;
  }
  
  .bell-icon {
    width: 20px;
    height: 20px;
  }
  
  .profile-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 24px;
  }
  
  .avatar-img {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    object-fit: cover;
  }
  
  .avatar-placeholder {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: linear-gradient(135deg, #8b5cf6, #ec4899);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
    font-size: 12px;
  }
  
  .username {
    font-size: 14px;
    font-weight: 500;
    color: #1f2937;
  }
  
  :global(.dark) .username {
    color: #f3f4f6;
  }
  
  .menu-container {
    position: relative;
  }
  
  .menu-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 6px;
    border-radius: 8px;
    color: #4b5563;
  }
  
  :global(.dark) .menu-btn {
    color: #9ca3af;
  }
  
  .menu-icon {
    width: 20px;
    height: 20px;
  }
  
  .dropdown {
    position: absolute;
    top: 100%;
    right: 0;
    margin-top: 8px;
    width: 200px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    border: 1px solid #e5e7eb;
    overflow: hidden;
    z-index: 60;
  }
  
  :global(.dark) .dropdown {
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
    background: #d1d5db;
    border: none;
    cursor: pointer;
    transition: background 0.2s;
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
    background: #ef4444;
    border: none;
    color: white;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s;
  }
  
  .logout-btn:hover {
    background: #dc2626;
  }
  
  @media (max-width: 640px) {
    .username {
      display: none;
    }
    
    .profile-btn {
      padding: 4px;
    }
  }
</style>
