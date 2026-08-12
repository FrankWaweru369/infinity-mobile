import { fetchReels } from './reelApi.js';

const DEFAULT_BATCH_SIZE = 5;

export function createReelLoader({
  batchSize = DEFAULT_BATCH_SIZE,
} = {}) {
  let reels = [];
  let nextCursor = null;
  let hasMore = true;
  let loading = false;

  async function loadNext() {
    if (loading || !hasMore) {
      return {
        reels,
        hasMore,
        nextCursor,
      };
    }

    loading = true;

    try {
      const response = await fetchReels({
        limit: batchSize,
        cursor: nextCursor,
      });

      const incomingReels = Array.isArray(response?.reels)
        ? response.reels
        : [];

      reels = [...reels, ...incomingReels];

      hasMore = response?.pagination?.hasMore === true;
      nextCursor = response?.pagination?.nextCursor || null;

      return {
        reels,
        hasMore,
        nextCursor,
      };
    } finally {
      loading = false;
    }
  }

  function getReels() {
    return reels;
  }

  function getState() {
    return {
      reels,
      hasMore,
      nextCursor,
      loading,
    };
  }

  function reset() {
    reels = [];
    nextCursor = null;
    hasMore = true;
    loading = false;
  }

  return {
    loadNext,
    getReels,
    getState,
    reset,
  };
}
