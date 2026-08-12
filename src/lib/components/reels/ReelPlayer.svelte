<script>
  import { onMount, onDestroy, tick, createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  export let reel;
  export let active = false;
  export let preload = false;
  export let soundEnabled = true;

  function toggleSound() {
  soundEnabled = !soundEnabled;

  if (video) {
    video.muted = !soundEnabled;
  }

  dispatch('soundchange', {
    enabled: soundEnabled
  });
}

  let video;
  let previousActive = false;
  let currentUrl = '';
  let preloadedUrl = '';

  function getVariants() {
    return reel?.media?.variants || {};
  }

  function getBestVideoUrl() {
    const variants = getVariants();

    const low =
      variants.low ||
      reel?.media?.url ||
      reel?.videoUrl ||
      '';

    const medium =
      variants.medium ||
      low;

    const high =
      variants.high ||
      medium;

    if (typeof window === 'undefined') {
      return medium;
    }

    const connection =
      navigator.connection ||
      navigator.mozConnection ||
      navigator.webkitConnection;

    // Data Saver explicitly enabled.
    if (connection?.saveData) {
      return low;
    }

    const effectiveType =
      connection?.effectiveType || '';

    // Slow connections.
    if (
      effectiveType === 'slow-2g' ||
      effectiveType === '2g' ||
      effectiveType === '3g'
    ) {
      return low;
    }

    // Use high quality only when there is
    // a reasonable connection AND a larger display.
    const isLargeDisplay =
      window.innerWidth >= 900;

    const hasFastConnection =
      effectiveType === '4g' ||
      connection?.type === 'wifi' ||
      (connection?.downlink &&
        connection.downlink >= 5);

    if (isLargeDisplay && hasFastConnection) {
      return high;
    }

    // Normal mobile/tablet experience.
    return medium;
  }

  function stopPlayback() {
    if (!video) return;

    video.pause();
    video.removeAttribute('src');
    video.load();

    currentUrl = '';
  }

  async function startPlayback(shouldPlay = true) {
  await tick();

  if (!video) return;

  const url = getBestVideoUrl();

  if (!url) return;

  if (currentUrl !== url) {
    video.pause();
    video.src = url;
    currentUrl = url;

    video.load();
  }

  if (!shouldPlay || !active) return;

  try {
    await video.play();
  } catch (error) {
  console.debug(
    'Reel autoplay unavailable:',
    error
  );
} 
}

  $: if (video && active !== previousActive) {
  previousActive = active;

  if (active) {
    startPlayback(true);
  } else if (!preload) {
    stopPlayback();
  }
}

$: if (video && preload && !active) {
  const url = getBestVideoUrl();

  if (url && url !== preloadedUrl) {
    preloadedUrl = url;
    startPlayback(false);
  }
}

  $: if (video && reel?.id) {
  const url = getBestVideoUrl();

  if (url && url !== preloadedUrl) {
    preloadedUrl = '';
  }

  if (
    active &&
    url &&
    url !== currentUrl
  ) {
    startPlayback(true);
  }
}

  onMount(() => {
    if (active) {
      startPlayback();
    }
  });

  onDestroy(() => {
    stopPlayback();
  });
</script>

<div class="reel-player">

<div class="reel-actions">
  <button
  class="reel-action"
  type="button"
  on:click={toggleSound}
  aria-label={soundEnabled ? 'Mute' : 'Unmute'}
>
  {soundEnabled ? '🔊' : '🔇'}
</button>
</div>

  {#if reel?.thumbnail?.url}
    <img
      class="reel-thumbnail"
      src={reel.thumbnail.url}
      alt=""
      aria-hidden="true"
    />
  {/if}

  <video
    bind:this={video}
    playsinline
    muted
    controls={false}
    preload="none"
    poster={reel?.thumbnail?.url || ''}
  ></video>

</div>

<style>
  .reel-player {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: #000;
  }

  .reel-thumbnail {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  video {
    position: relative;
    z-index: 1;
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
  }

.reel-actions {
  position: absolute;
  top: 100px;
  right: 20px;
  z-index: 9999;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
}

.reel-action {
  width: 46px;
  height: 46px;
  border: none;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.55);
  color: white;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 20px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
} 
</style>
