<script>
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';

  import { getUserProfile } from '$lib/services/userApi.js';
  import { fetchUserReels } from '$lib/services/reels/reelApi.js';

  /**
   * @typedef {Object} CreatorProfile
   * @property {string} id
   * @property {string} username
   * @property {string} [profilePicture]
   * @property {string} [avatar]
   * @property {string} [bio]
   * @property {number} [followersCount]
   * @property {number} [followingCount]
   */

  /**
   * @typedef {Object} CreatorReel
   * @property {string} id
   * @property {{url?: string} | null} [thumbnail]
   * @property {{caption?: string} | null} [content]
   */

  /** @type {CreatorProfile | null} */
  let user = null;

  /** @type {CreatorReel[]} */
  let reels = [];

  let loading = true;
  let error = '';

  /**
   * @param {string} userId
   */
  async function loadProfile(userId) {
    loading = true;
    error = '';

    try {
      const [profileResponse, reelsResponse] = await Promise.all([
        getUserProfile(userId),
        fetchUserReels({
          userId,
          limit: 20
        })
      ]);

      user = profileResponse.user || null;

      reels = Array.isArray(reelsResponse.reels)
        ? reelsResponse.reels
        : [];

      if (!user) {
        error = 'Creator not found.';
      }
    } catch (err) {
      console.error('Failed to load creator profile:', err);

      error =
        err instanceof Error
          ? err.message
          : 'Unable to load this creator profile.';
    } finally {
      loading = false;
    }
  }

  /**
   * @param {CreatorReel} reel
   */
  function openReel(reel) {
    if (!user) return;

    goto(
      `/reels?userId=${encodeURIComponent(user.id)}&reelId=${encodeURIComponent(reel.id)}`
    );
  }

  onMount(() => {
    const userId = $page.params.userId;

    if (userId) {
      loadProfile(userId);
    } else {
      loading = false;
      error = 'Creator ID is missing.';
    }
  });
</script>

<svelte:head>
  <title>
    {user ? `${user.username} · Infinity` : 'Creator Profile · Infinity'}
  </title>
</svelte:head>

<div class="profile-page">
  <header class="profile-header">
    <button
      class="back-button"
      type="button"
      aria-label="Go back"
      onclick={() => history.back()}
    >
      ←
    </button>

    <h1>Profile</h1>
  </header>

  {#if loading}
    <div class="status-message">
      Loading creator profile...
    </div>

  {:else if error}
    <div class="status-message error">
      {error}
    </div>

  {:else if user}
    <section class="profile-info">
      {#if user.profilePicture || user.avatar}
        <img
          class="profile-avatar"
          src={user.profilePicture || user.avatar}
          alt={`${user.username}'s avatar`}
        />
      {:else}
        <div class="profile-avatar avatar-placeholder">
          {user.username?.charAt(0)?.toUpperCase() || 'U'}
        </div>
      {/if}

      <h2>{user.username}</h2>

      {#if user.bio}
        <p class="bio">{user.bio}</p>
      {:else}
        <p class="bio muted">No bio yet.</p>
      {/if}

      <div class="profile-stats">
        <div class="stat">
          <strong>{user.followersCount ?? 0}</strong>
          <span>Followers</span>
        </div>

        <div class="stat">
          <strong>{user.followingCount ?? 0}</strong>
          <span>Following</span>
        </div>

        <div class="stat">
          <strong>{reels.length}</strong>
          <span>Reels loaded</span>
        </div>
      </div>
    </section>

    <section class="reels-section">
      <h3>Reels</h3>

      {#if reels.length > 0}
        <div class="reels-grid">
          {#each reels as reel (reel.id)}
            <button
              class="reel-card"
              type="button"
              aria-label="Watch Reel"
              onclick={() => openReel(reel)}
            >
              {#if reel.thumbnail?.url}
                <img
                  src={reel.thumbnail.url}
                  alt={reel.content?.caption || 'Creator Reel'}
                  loading="lazy"
                />
              {:else}
                <div class="reel-placeholder">
                  <span>▶</span>
                </div>
              {/if}

              <span class="play-icon">▶</span>
            </button>
          {/each}
        </div>
      {:else}
        <p class="empty-state">
          This creator hasn't shared any Reels yet.
        </p>
      {/if}
    </section>
  {/if}
</div>

<style>
  :global(body) {
    margin: 0;
    background: #0b0b0f;
    color: #fff;
  }

  .profile-page {
    min-height: 100vh;
    padding-bottom: 32px;
    background: #0b0b0f;
    color: #fff;
  }

  .profile-header {
    position: sticky;
    top: 0;
    z-index: 10;
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 14px 16px;
    background: rgba(11, 11, 15, 0.96);
    border-bottom: 1px solid #24242c;
  }

  .profile-header h1 {
    margin: 0;
    font-size: 18px;
  }

  .back-button {
    width: 40px;
    height: 40px;
    border: 0;
    border-radius: 50%;
    background: #202027;
    color: #fff;
    font-size: 24px;
    cursor: pointer;
  }

  .profile-info {
    padding: 28px 18px 24px;
    text-align: center;
    border-bottom: 1px solid #24242c;
  }

  .profile-avatar {
    display: block;
    width: 96px;
    height: 96px;
    margin: 0 auto 14px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #8b5cf6;
  }

  .avatar-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    background: #292333;
    color: #fff;
    font-size: 34px;
    font-weight: 700;
  }

  .profile-info h2 {
    margin: 0;
    font-size: 22px;
    overflow-wrap: anywhere;
  }

  .bio {
    max-width: 440px;
    margin: 10px auto 22px;
    color: #e4e4eb;
    line-height: 1.5;
    overflow-wrap: anywhere;
  }

  .muted {
    color: #9999a8;
  }

  .profile-stats {
    display: flex;
    justify-content: center;
    gap: 36px;
  }

  .stat {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .stat strong {
    font-size: 18px;
  }

  .stat span {
    color: #aaaab8;
    font-size: 12px;
  }

  .reels-section {
    padding: 20px 12px;
  }

  .reels-section h3 {
    margin: 0 0 16px 4px;
    font-size: 17px;
  }

  .reels-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 3px;
  }

  .reel-card {
    position: relative;
    display: block;
    min-width: 0;
    aspect-ratio: 9 / 16;
    padding: 0;
    overflow: hidden;
    border: 0;
    background: #202027;
    cursor: pointer;
  }

  .reel-card img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
  }

  .reel-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #fff;
    font-size: 28px;
  }

  .play-icon {
    position: absolute;
    right: 8px;
    bottom: 8px;
    color: #fff;
    font-size: 14px;
    text-shadow: 0 1px 5px #000;
  }

  .status-message,
  .empty-state {
    padding: 36px 20px;
    color: #c4c4cf;
    text-align: center;
  }

  .error {
    color: #ff8585;
  }
</style>
