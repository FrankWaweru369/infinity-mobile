<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { browser } from '$app/environment';
  import { getAccessToken } from '$lib/services/session.js';

  onMount(() => {
    if (browser) {
     const token = getAccessToken();
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
