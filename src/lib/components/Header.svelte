<script>
  import { goto } from '$app/navigation';
  import { theme, toggleTheme } from '$lib/stores/theme';
  
  export let user = null;
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
    Infinity
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
          <div class="dropdown">
            <!-- Dark Mode Toggle -->
            <div class="dropdown-item">
              <span class="dropdown-label">Dark Mode</span>
              <button
                on:click={toggleTheme}
                class="toggle-switch"
                class:active={$theme === 'dark'}
              >
                <span class="toggle-slider" class:active={$theme === 'dark'} />
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
    background: var(--header-bg);
    border-bottom: 1px solid var(--border-color);
    z-index: 50;
  }
  
  .logo {
    font-size: 20px;
    font-weight: bold;
    color: #6b21a8;
    cursor: pointer;
    margin: 0;
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
    color: var(--icon-color);
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
    background: linear-gradient(135deg, #6b21a8, #ec4899);
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
    color: var(--text-primary);
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
    color: var(--icon-color);
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
    background: var(--dropdown-bg);
    border-radius: 8px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
    border: 1px solid var(--border-color);
    overflow: hidden;
    z-index: 60;
  }
  
  .dropdown-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    border-bottom: 1px solid var(--border-color);
  }
  
  .dropdown-label {
    font-size: 14px;
    color: var(--text-primary);
  }
  
  .toggle-switch {
    position: relative;
    display: inline-flex;
    align-items: center;
    width: 44px;
    height: 24px;
    border-radius: 9999px;
    background: #444;
    border: none;
    cursor: pointer;
    transition: background 0.2s;
    padding: 0;
  }
  
  .toggle-switch.active {
    background: #6b21a8;
  }
  
  .toggle-slider {
    position: absolute;
    left: 2px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: white;
    transition: transform 0.2s;
  }
  
  .toggle-slider.active {
    transform: translateX(20px);
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
