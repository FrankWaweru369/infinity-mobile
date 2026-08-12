<script>
  import { onMount, onDestroy } from 'svelte';
  import ReelPlayer from '$lib/components/reels/ReelPlayer.svelte';
  import { createReelLoader } from '$lib/services/reels/reelLoader.js';

  /** @type {Array<any>} */
  let reels = [];

  let soundEnabled = true;

  /** @type {string|null} */
  let activeReelId = null;

  let loading = false;
  let error = '';

  const loader = createReelLoader({
    batchSize: 5
  });

  let observer;

  async function loadMore() {
    if (loading) return;

    const state = loader.getState();

    if (!state.hasMore) return;

    loading = true;
    error = '';

    try {
      const result = await loader.loadNext();

      if (result?.reels?.length) {
        reels = result.reels;

        setTimeout(() => {
          observeReels();
        }, 0);
      }
    } catch (err) {
      error = err?.message || 'Failed to load Reels';
    } finally {
      loading = false;
    }
  }

  function observeReels() {
    if (typeof window === 'undefined') return;

    observer?.disconnect();

    observer = new IntersectionObserver(
      (entries) => {
        let mostVisible = null;

        for (const entry of entries) {
          if (!entry.isIntersecting) continue;

          if (
            !mostVisible ||
            entry.intersectionRatio >
              mostVisible.intersectionRatio
          ) {
            mostVisible = entry;
          }
        }

        if (!mostVisible) return;

        const reelId =
          mostVisible.target.getAttribute('data-reel-id');

        if (reelId) {
          activeReelId = reelId;
        }

        const sections =
          document.querySelectorAll('.reel');

        const currentIndex =
          Array.from(sections).indexOf(
            mostVisible.target
          );

        if (
          currentIndex >= reels.length - 2 &&
          !loading
        ) {
          loadMore();
        }
      },
      {
        threshold: [0.6, 0.8, 1]
      }
    );

    document
      .querySelectorAll('.reel')
      .forEach((section) => {
        observer.observe(section);
      });
  }

  function formatUsername(username) {
    return username ? `@${username}` : '@user';
  }

  onMount(async () => {
    await loadMore();
  });

  onDestroy(() => {
    observer?.disconnect();
  });
</script>

<svelte:head>
  <title>Reels</title>
</svelte:head>

<div class="reels-page">
  <div class="feed">

    {#each reels as reel (reel.id)}
      <section
        class="reel"
        data-reel-id={reel.id}
      >
       <ReelPlayer
  {reel}
  active={activeReelId === reel.id}
  soundEnabled={soundEnabled}
  on:soundchange={(event) => {
    soundEnabled = event.detail.enabled;
  }}
/> 

        <!-- Top overlay -->
        <div class="top-overlay">
          <button
            class="top-button"
            aria-label="Back"
            onclick={() => history.back()}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="m15 18-6-6 6-6"/>
            </svg>
          </button>

          <h1>Reels</h1>

          <button
            class="top-button"
            aria-label="More options"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="5" cy="12" r="1"/>
              <circle cx="12" cy="12" r="1"/>
              <circle cx="19" cy="12" r="1"/>
            </svg>
          </button>
        </div>

        <!-- Right action rail -->
        <div class="actions">

          <button
            class="action-button"
            aria-label="Like"
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path
                d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"
              />
            </svg>

            <span>Like</span>
          </button>

          <button
            class="action-button"
            aria-label="Comments"
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path
                d="M21 11.5a8.38 8.38 0 0 1-9 8.5
                8.5 8.5 0 0 1-4.5-1.3L3 20l1.3-4.5
                A8.5 8.5 0 1 1 21 11.5z"
              />
            </svg>

            <span>Comment</span>
          </button>

          <button
            class="action-button"
            aria-label="Share"
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="18" cy="5" r="3"/>
              <circle cx="6" cy="12" r="3"/>
              <circle cx="18" cy="19" r="3"/>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
            </svg>

            <span>Share</span>
          </button>

          <button
            class="action-button"
            aria-label="More"
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="5" cy="12" r="1.5"/>
              <circle cx="12" cy="12" r="1.5"/>
              <circle cx="19" cy="12" r="1.5"/>
            </svg>
          </button>

        </div>

        <!-- Bottom information -->
        <div class="bottom-overlay">

          <div class="author-row">
            {#if reel.author?.profilePicture}
              <img
                src={reel.author.profilePicture}
                alt=""
                class="avatar"
              />
            {:else}
              <div class="avatar-placeholder">
                {reel.author?.username?.charAt(0)?.toUpperCase() || 'U'}
              </div>
            {/if}

            <strong>
              {formatUsername(reel.author?.username)}
            </strong>

            <button class="follow-button">
              Follow
            </button>
          </div>

          {#if reel.content?.caption}
            <p class="caption">
              {reel.content.caption}
            </p>
          {/if}

          <div class="sound-row">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
            </svg>

            <span>
              {reel.content?.music?.name || 'Original Sound'}
            </span>
          </div>

        </div>
      </section>
    {/each}

    {#if loading}
      <div class="loading">
        Loading...
      </div>
    {/if}

    {#if error}
      <div class="error">
        {error}
      </div>
    {/if}

  </div>
</div>

<style>
  :global(html),
  :global(body) {
    margin: 0;
    padding: 0;
    background: #000;
    overflow: hidden;
  }

  :global(body) {
    min-height: 100vh;
  }

  .reels-page {
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100dvh;
    background: #000;
    overflow: hidden;
  }

  .feed {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    overscroll-behavior-y: contain;
    scroll-snap-type: y mandatory;
    -webkit-overflow-scrolling: touch;
    background: #000;
  }

  .reel {
    position: relative;
    width: 100%;
    height: 100dvh;
    min-height: 100dvh;
    scroll-snap-align: start;
    scroll-snap-stop: always;
    overflow: hidden;
    background: #000;
  }

  .top-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 5;

    display: flex;
    align-items: center;
    justify-content: space-between;

    padding:
      max(14px, env(safe-area-inset-top))
      16px
      14px;

    color: #fff;
    background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.45),
      transparent
    );
  }

  .top-overlay h1 {
    margin: 0;
    font-size: 18px;
    font-weight: 700;
  }

  .top-button {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;

    border: none;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.25);
    color: #fff;
    cursor: pointer;

    -webkit-tap-highlight-color: transparent;
  }

  .actions {
    position: absolute;
    right: 12px;
    bottom: 120px;
    z-index: 5;

    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 18px;

    color: #fff;
  }

  .action-button {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;

    padding: 0;
    border: none;
    background: transparent;
    color: #fff;

    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }

  .action-button span {
    font-size: 10px;
    font-weight: 600;
    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.7);
  }

  .bottom-overlay {
    position: absolute;
    left: 16px;
    right: 76px;
    bottom: 0;
    z-index: 5;

    padding:
      0
      0
      max(28px, env(safe-area-inset-bottom))
      0;

    color: #fff;

    background: linear-gradient(
      to top,
      rgba(0, 0, 0, 0.65),
      rgba(0, 0, 0, 0.15),
      transparent
    );
  }

  .author-row {
    display: flex;
    align-items: center;
    gap: 9px;
    margin-bottom: 10px;
  }

  .avatar,
  .avatar-placeholder {
    width: 38px;
    height: 38px;
    flex-shrink: 0;
    border-radius: 50%;
  }

  .avatar {
    object-fit: cover;
  }

  .avatar-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;

    background: #6b21a8;
    color: #fff;
    font-weight: 700;
  }

  .author-row strong {
    font-size: 14px;
    font-weight: 700;
    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.8);
  }

  .follow-button {
    margin-left: 4px;
    padding: 6px 12px;

    border: 1px solid rgba(255, 255, 255, 0.8);
    border-radius: 7px;

    background: transparent;
    color: #fff;

    font-size: 12px;
    font-weight: 700;
  }

  .caption {
    margin: 0 0 8px;
    max-width: 100%;

    font-size: 14px;
    line-height: 1.4;

    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.9);
  }

  .sound-row {
    display: flex;
    align-items: center;
    gap: 6px;

    font-size: 12px;
    opacity: 0.9;

    overflow: hidden;
  }

  .sound-row span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .loading,
  .error {
    min-height: 80px;

    display: flex;
    align-items: center;
    justify-content: center;

    color: #fff;
    background: #000;

    text-align: center;
  }

  .error {
    color: #fca5a5;
  }

  @media (min-width: 700px) {
    .actions {
      right: 24px;
      bottom: 140px;
    }

    .bottom-overlay {
      left: 28px;
      right: 100px;
      padding-bottom: 36px;
    }

    .top-overlay {
      padding-left: 28px;
      padding-right: 28px;
    }
  }
</style>
