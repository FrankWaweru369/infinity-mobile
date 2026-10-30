<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { getAccessToken } from '$lib/services/session.js';
  import { notifications } from '$lib/services/api.js';
  import {
    connectNotifications,
    latestNotification,
    unreadNotificationCount,
    decrementUnreadNotificationCount,
    clearUnreadNotificationCount
  } from '$lib/services/notificationSocket.js';

  let items = [];
  let filter = 'all';
  let unreadCount = 0;
  let loading = true;
  let errorMessage = '';
  let busyId = '';
  let markingAll = false;
  let page = 1;
  let hasMore = false;

  onMount(() => {
    if (!getAccessToken()) {
      goto('/login');
      return;
    }

    connectNotifications();

    let firstLatestValue = true;
    const unsubscribeLatest = latestNotification.subscribe((notification) => {
      if (firstLatestValue) {
        firstLatestValue = false;
        return;
      }

      if (!notification?._id) return;

      items = [
        notification,
        ...items.filter((item) => item._id !== notification._id)
      ];
    });

    const unsubscribeCount = unreadNotificationCount.subscribe((count) => {
      unreadCount = Number(count) || 0;
    });

    loadNotifications(true);

    return () => {
      unsubscribeLatest();
      unsubscribeCount();
    };
  });

  async function loadNotifications(reset = false) {
    if (loading && !reset) return;

    loading = true;
    errorMessage = '';

    const requestedPage = reset ? 1 : page + 1;

    try {
      const result = await notifications.getAll({
        page: requestedPage,
        limit: 20,
        unread: filter === 'unread'
      });

      items = reset
        ? (result.notifications || [])
        : [...items, ...(result.notifications || [])];

      page = requestedPage;
      hasMore = Boolean(result.pagination?.hasMore);
      unreadNotificationCount.set(Number(result.unreadCount) || 0);
    } catch (error) {
      errorMessage = error.message || 'Could not load notifications.';
    } finally {
      loading = false;
    }
  }

  async function changeFilter(nextFilter) {
    if (filter === nextFilter) return;

    filter = nextFilter;
    page = 1;
    hasMore = false;
    await loadNotifications(true);
  }

  async function markRead(item) {
    if (!item || item.readAt || busyId) return;

    busyId = item._id;

    try {
      const result = await notifications.markRead(item._id);
      const updated = result.notification;

      items = items.map((entry) =>
        entry._id === item._id
          ? { ...entry, readAt: updated?.readAt || new Date().toISOString() }
          : entry
      );

      decrementUnreadNotificationCount();
    } catch (error) {
      errorMessage = error.message || 'Could not mark notification as read.';
    } finally {
      busyId = '';
    }
  }

  async function markAllRead() {
    if (markingAll || unreadCount === 0) return;

    markingAll = true;
    errorMessage = '';

    try {
      await notifications.markAllRead();

      const now = new Date().toISOString();
      items = items.map((item) => ({
        ...item,
        readAt: item.readAt || now
      }));

      clearUnreadNotificationCount();
    } catch (error) {
      errorMessage = error.message || 'Could not mark notifications as read.';
    } finally {
      markingAll = false;
    }
  }

  function actorName(item) {
    return item.actor?.username || 'Someone';
  }

  function getNotificationPostId(item) {
    if (!item?.post) return '';
    const value = typeof item.post === 'object'
      ? item.post._id || item.post.id
      : item.post;
    return value ? String(value) : '';
  }

  function openNotification(item) {
    const postId = getNotificationPostId(item);
    if (!postId) return;

    if (!item.readAt) markRead(item);
    goto(`/dashboard?post=${encodeURIComponent(postId)}`);
  }

  function handleNotificationKeydown(event, item) {
    if (!getNotificationPostId(item)) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openNotification(item);
    }
  }

  function timeAgo(value) {
    if (!value) return '';

    const timestamp = new Date(value).getTime();
    if (!Number.isFinite(timestamp)) return '';

    const seconds = Math.max(0, Math.floor((Date.now() - timestamp) / 1000));

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;

    return new Date(value).toLocaleDateString();
  }
</script>

<svelte:head>
  <title>Notifications | Infinity</title>
  <meta name="description" content="Your Infinity notifications" />
</svelte:head>

<main class="notifications-page">
  <header class="page-header">
    <button class="back-button" type="button" on:click={() => goto('/dashboard')}>
      <span aria-hidden="true">←</span> Back
    </button>

    <div class="heading">
      <h1>Notifications</h1>
      <p>
        {#if unreadCount > 0}
          {unreadCount} unread
        {:else}
          You're all caught up
        {/if}
      </p>
    </div>

    <button
      class="mark-all"
      type="button"
      disabled={markingAll || unreadCount === 0}
      on:click={markAllRead}
    >
      {markingAll ? 'Working…' : 'Mark all read'}
    </button>
  </header>

  <nav class="filters" aria-label="Notification filter">
    <button
      type="button"
      class:active={filter === 'all'}
      aria-pressed={filter === 'all'}
      on:click={() => changeFilter('all')}
    >
      All
    </button>
    <button
      type="button"
      class:active={filter === 'unread'}
      aria-pressed={filter === 'unread'}
      on:click={() => changeFilter('unread')}
    >
      Unread
      {#if unreadCount > 0}
        <span class="count">{unreadCount > 99 ? '99+' : unreadCount}</span>
      {/if}
    </button>
  </nav>

  {#if errorMessage}
    <div class="error-message" role="alert">
      <p>{errorMessage}</p>
      <button type="button" on:click={() => loadNotifications(true)}>Try again</button>
    </div>
  {/if}

  {#if loading && items.length === 0}
    <div class="status" role="status">Loading notifications…</div>
  {:else if items.length === 0 && !errorMessage}
    <section class="empty-state">
      <div class="empty-icon" aria-hidden="true">♧</div>
      <h2>{filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}</h2>
      <p>When people interact with you on Infinity, you'll see it here.</p>
    </section>
  {:else}
    <section class="notification-list" aria-label="Your notifications">
      {#each items as item (item._id)}
        <article
          class="notification-row"
          class:unread={!item.readAt}
          class:clickable={Boolean(item.post)}
          role={item.post ? "link" : undefined}
          tabindex={item.post ? 0 : undefined}
          on:click={() => openNotification(item)}
          on:keydown={(event) => handleNotificationKeydown(event, item)}
        >
          <div class="avatar">
            {#if item.actor?.profilePicture || item.actor?.avatar}
              <img
                src={item.actor.profilePicture || item.actor.avatar}
                alt=""
                loading="lazy"
              />
            {:else}
              {actorName(item).slice(0, 1).toUpperCase()}
            {/if}
          </div>

          <div class="notification-content">
            <p class="message">
              <strong>{actorName(item)}</strong>
              {' '}{item.message}
            </p>
            <time>{timeAgo(item.createdAt)}</time>
          </div>

          {#if !item.readAt}
            <button
              class="read-button"
              type="button"
              aria-label="Mark notification from {actorName(item)} as read"
              disabled={busyId === item._id}
              on:click={(event) => {
                event.stopPropagation();
                markRead(item);
              }}
            >
              {busyId === item._id ? '…' : '•'}
            </button>
          {:else}
            <span class="read-spacer" aria-hidden="true"></span>
          {/if}
        </article>
      {/each}
    </section>

    {#if hasMore}
      <button
        class="load-more"
        type="button"
        disabled={loading}
        on:click={() => loadNotifications(false)}
      >
        {loading ? 'Loading…' : 'Load more'}
      </button>
    {/if}
  {/if}
</main>

<style>
  .notifications-page {
    min-height: 100vh;
    padding: 88px 16px 32px;
    background: var(--bg-primary);
    color: var(--text-primary);
    max-width: 760px;
    margin: 0 auto;
  }

  .page-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 24px;
  }

  .back-button,
  .mark-all,
  .filters button,
  .load-more,
  .error-message button {
    min-height: 42px;
    border: 1px solid var(--border-color);
    border-radius: 10px;
    padding: 8px 12px;
    background: var(--card-bg);
    color: var(--text-primary);
    font: inherit;
    cursor: pointer;
  }

  .back-button {
    white-space: nowrap;
  }

  .heading {
    flex: 1;
    min-width: 0;
  }

  .heading h1 {
    font-size: 22px;
    line-height: 1.3;
  }

  .heading p,
  .notification-content time {
    margin-top: 4px;
    color: var(--text-secondary);
    font-size: 13px;
  }

  .mark-all {
    font-size: 12px;
    white-space: nowrap;
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .filters {
    display: flex;
    gap: 8px;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--border-color);
  }

  .filters button {
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }

  .filters button.active {
    border-color: var(--text-primary);
    font-weight: 700;
  }

  .count {
    font-size: 12px;
    border-radius: 999px;
    padding: 2px 7px;
    background: var(--bg-primary);
  }

  .notification-list {
    display: flex;
    flex-direction: column;
  }

  .notification-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 8px;
    border-bottom: 1px solid var(--border-color);
  }

  .notification-row.unread {
    background: var(--card-bg);
  }

  .avatar {
    width: 42px;
    height: 42px;
    flex: 0 0 42px;
    border-radius: 50%;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg-secondary);
    color: var(--text-primary);
    font-weight: 700;
  }

  .avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .notification-content {
    flex: 1;
    min-width: 0;
    overflow-wrap: anywhere;
  }

  .message {
    font-size: 14px;
    line-height: 1.5;
  }

  .read-button {
    width: 36px;
    height: 36px;
    flex: 0 0 36px;
    border: 0;
    border-radius: 50%;
    background: transparent;
    color: var(--text-primary);
    font-size: 28px;
    cursor: pointer;
  }

  .read-spacer {
    width: 36px;
    flex: 0 0 36px;
  }

  .status,
  .empty-state {
    padding: 48px 16px;
    text-align: center;
    color: var(--text-secondary);
  }

  .empty-icon {
    font-size: 36px;
    margin-bottom: 12px;
  }

  .empty-state h2 {
    color: var(--text-primary);
    font-size: 18px;
    margin-bottom: 8px;
  }

  .empty-state p {
    font-size: 14px;
    line-height: 1.5;
  }

  .error-message {
    margin: 16px 0;
    padding: 14px;
    border: 1px solid #b91c1c;
    border-radius: 10px;
    color: var(--text-primary);
  }

  .error-message button {
    margin-top: 10px;
  }

  .load-more {
    display: block;
    margin: 20px auto 0;
  }

  @media (max-width: 480px) {
    .notifications-page {
      padding-right: 12px;
      padding-left: 12px;
    }

    .page-header {
      gap: 8px;
    }

    .back-button {
      padding: 8px;
    }

    .heading h1 {
      font-size: 18px;
    }

    .mark-all {
      padding: 8px;
    }
  }
</style>
