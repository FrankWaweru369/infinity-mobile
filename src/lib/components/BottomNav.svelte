<script>
  import { goto } from '$app/navigation';
  export let username = '';
</script>

<div class="bottom-nav">
  <button on:click={() => goto('/dashboard')}>🏠 Home</button>
  <button on:click={() => goto('/explore')}>🔍 Explore</button>
  <button on:click={() => goto('/newPost')}>➕ Post</button>
  <button on:click={() => goto('/reels')}>📹 Reels</button>
  <button on:click={() => username ? goto(`/profile/${username}`) : goto('/login')}>
    👤 Profile
  </button>
</div>

<style>
  .bottom-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-around;
    background: white;
    padding: 10px;
    border-top: 1px solid #e5e7eb;
    z-index: 100;
  }
  
  button {
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    padding: 8px;
  }
</style>
