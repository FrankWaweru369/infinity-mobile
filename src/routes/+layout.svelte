<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { browser } from '$app/environment';
  import { theme, applyTheme } from '$lib/stores/theme';
  
  onMount(() => {
    if (!browser) return;
    
    // Apply theme on mount
    let currentTheme;
    theme.subscribe(t => {
      currentTheme = t;
      applyTheme(currentTheme);
    });
    
    const token = localStorage.getItem('token');
    const currentPath = window.location.pathname;
    
    // Handle auth redirects
    if (token && currentPath === '/') {
      goto('/dashboard');
    } else if (!token && currentPath === '/dashboard') {
      goto('/login');
    }
  });
</script>

<slot />

<style>
  /* CSS Variables for theming */
  :root {
    --bg-primary: #ffffff;
    --bg-secondary: #f3f4f6;
    --text-primary: #1f2937;
    --text-secondary: #6b7280;
    --border-color: #e5e7eb;
    --header-bg: #ffffff;
    --icon-color: #4b5563;
    --dropdown-bg: #ffffff;
    --card-bg: #ffffff;
  }
  
  :root.dark {
    --bg-primary: #000000;
    --bg-secondary: #111827;
    --text-primary: #f3f4f6;
    --text-secondary: #9ca3af;
    --border-color: #374151;
    --header-bg: #000000;
    --icon-color: #9ca3af;
    --dropdown-bg: #1f2937;
    --card-bg: #1f2937;
  }
  
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  html, body {
    margin: 0 !important;
    padding: 0 !important;
    background: var(--bg-primary) !important;
    overflow-x: hidden;
  }
  
  body {
    min-height: 100vh;
    color: var(--text-primary);
  }
</style>
