<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { browser } from '$app/environment';
  
  onMount(() => {
    if (browser) {
      const token = localStorage.getItem('token');
      // The layout handles splash and redirect
      // This is just a fallback
      if (token) {
        goto('/dashboard');
      } else {
        goto('/register');
      }
    }
  });
</script>

<!-- Layout handles everything -->
