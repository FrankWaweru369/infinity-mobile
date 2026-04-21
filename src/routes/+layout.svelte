<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { browser } from '$app/environment';
  
  onMount(() => {
    if (!browser) return;
    
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
  /* Global reset - remove ALL margins and padding */
  :global(*) {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  :global(html), :global(body) {
    margin: 0 !important;
    padding: 0 !important;
    background: #000000 !important;
    overflow-x: hidden;
  }
  
  /* Remove any default body styling */
  :global(body) {
    min-height: 100vh;
    background: #000000;
  }
</style>
