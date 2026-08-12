<script>
  import { onMount, onDestroy } from 'svelte';
  import ReelPlayer from '$lib/components/reels/ReelPlayer.svelte';
  import { createReelLoader } from '$lib/services/reels/reelLoader.js';

  /** @type {Array<any>} */
  let reels = [];

  /** @type {string|null} */
  let activeReelId = null;
  let soundEnabled = true;

  let activeReelIndex = -1;

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

        // Wait for the new DOM elements to exist,
        // then observe them.
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

	  activeReelIndex = currentIndex;

        // Start loading the next batch
        // when we reach the second-last reel.
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

  onMount(async () => {
    await loadMore();
  });

  onDestroy(() => {
    observer?.disconnect();
  });
</script>

<svelte:head>
  <title>Infinity Reels Test</title>
</svelte:head>

<div class="feed">
  {#each reels as reel (reel.id)}
    <section
      class="reel"
      data-reel-id={reel.id}
    >
      <ReelPlayer
  {reel}
  active={activeReelId === reel.id}
  preload={reels[activeReelIndex + 1]?.id === reel.id}
/>

      <div class="info">
        <strong>{reel.author?.username}</strong>

        {#if reel.content?.caption}
          <p>{reel.content.caption}</p>
        {/if}
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

<style>
  :global(body) {
    margin: 0;
    background: #000;
  }

  .feed {
    width: 100%;
    height: 100vh;
    overflow-y: auto;
    scroll-snap-type: y mandatory;
    background: #000;
  }

  .reel {
    position: relative;
    width: 100%;
    height: 100vh;
    scroll-snap-align: start;
    scroll-snap-stop: always;
    background: #000;
  }

  .info {
    position: absolute;
    left: 16px;
    right: 16px;
    bottom: 24px;
    z-index: 2;
    color: white;
  }

  .loading,
  .error {
    padding: 20px;
    color: white;
    text-align: center;
  }
</style>
