<script lang="ts">
  import { onMount } from 'svelte';

  let showSplash = true;

  onMount(() => {
    setTimeout(() => {
      showSplash = false;
    }, 2000);
  });
</script>

{#if showSplash}
  <div class="splash">
    <div class="logo-container">
      <h1 class="infinity-symbol">∞</h1>
      <h1>Infinity</h1>
    </div>
  </div>
{:else}
  <div class="main">
    <h1>Welcome to Infinity</h1>
    <p>Your feed will appear here</p>
  </div>
{/if}

<style>
  .splash {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #0f172a, #1e1b4b);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
  }

  .logo-container {
    text-align: center;
    animation: pulse 1s ease-in-out infinite;
  }

  .infinity-symbol {
    font-size: 80px;
    margin: 0;
    background: linear-gradient(135deg, #6366f1, #ec4899);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  h1 {
    color: white;
    font-size: 32px;
    margin: 0;
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.1); opacity: 0.9; }
  }

  .main {
    padding: 20px;
    text-align: center;
    font-family: sans-serif;
  }
</style>
