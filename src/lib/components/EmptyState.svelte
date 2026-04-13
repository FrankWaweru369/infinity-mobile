<script>
  export let title = 'No posts yet';
  export let message = 'Be the first to share something!';
  export let icon = '📝';
  export let actionText = '';
  export let onAction = () => {};
</script>

<div class="empty-state">
  <div class="empty-icon">{icon}</div>
  <h3 class="empty-title">{title}</h3>
  <p class="empty-message">{message}</p>
  {#if actionText}
    <button class="empty-action" on:click={onAction}>
      {actionText}
    </button>
  {/if}
</div>

<style>
  .empty-state {
    text-align: center;
    padding: 60px 20px;
  }
  
  .empty-icon {
    font-size: 64px;
    margin-bottom: 16px;
    opacity: 0.5;
  }
  
  .empty-title {
    font-size: 20px;
    font-weight: 600;
    margin: 0 0 8px 0;
    color: #1f2937;
  }
  
  :global(.dark) .empty-title {
    color: #f3f4f6;
  }
  
  .empty-message {
    font-size: 14px;
    color: #6b7280;
    margin: 0 0 24px 0;
  }
  
  :global(.dark) .empty-message {
    color: #9ca3af;
  }
  
  .empty-action {
    background: #8b5cf6;
    color: white;
    border: none;
    padding: 10px 24px;
    border-radius: 24px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .empty-action:active {
    transform: scale(0.96);
  }
</style>
