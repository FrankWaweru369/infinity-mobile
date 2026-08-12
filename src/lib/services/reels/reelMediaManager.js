const DEFAULT_MAX_ENTRIES = 6;

const PRIORITY = {
  SKIPPED: 0,
  DISTANT: 1,
  NEARBY: 2,
  CURRENT: 3,
};

export function createReelMediaManager({
  maxEntries = DEFAULT_MAX_ENTRIES,
} = {}) {
  const entries = new Map();

  function getEntry(reelId) {
    return entries.get(reelId) || null;
  }

  function setEntry(reelId, data = {}) {
    const existing = entries.get(reelId);

    const entry = {
      reelId,

      url: data.url ?? existing?.url ?? null,

      status: data.status ?? existing?.status ?? 'idle',

      priority:
        data.priority ??
        existing?.priority ??
        PRIORITY.DISTANT,

      lastUsedAt:
        data.lastUsedAt ??
        existing?.lastUsedAt ??
        Date.now(),

      shouldLoad:
        data.shouldLoad ??
        existing?.shouldLoad ??
        false,
    };

    entries.set(reelId, entry);

    trim();

    return entry;
  }

  function markCurrent(reelId, url) {
    return setEntry(reelId, {
      url,
      priority: PRIORITY.CURRENT,
      shouldLoad: true,
      lastUsedAt: Date.now(),
    });
  }

  function markNearby(reelId, url) {
    return setEntry(reelId, {
      url,
      priority: PRIORITY.NEARBY,
      shouldLoad: true,
      lastUsedAt: Date.now(),
    });
  }

  function markDistant(reelId, url) {
    return setEntry(reelId, {
      url,
      priority: PRIORITY.DISTANT,
      shouldLoad: false,
    });
  }

  function markSkipped(reelId) {
    const existing = entries.get(reelId);

    if (!existing) {
      return setEntry(reelId, {
        priority: PRIORITY.SKIPPED,
        shouldLoad: false,
        status: 'halted',
      });
    }

    existing.priority = PRIORITY.SKIPPED;
    existing.shouldLoad = false;
    existing.status = 'halted';
    existing.lastUsedAt = Date.now();

    return existing;
  }

  function markLoaded(reelId) {
    const entry = entries.get(reelId);

    if (!entry) {
      return null;
    }

    entry.status = 'loaded';
    entry.lastUsedAt = Date.now();

    return entry;
  }

  function markLoading(reelId) {
    const entry = entries.get(reelId);

    if (!entry) {
      return null;
    }

    entry.status = 'loading';
    entry.lastUsedAt = Date.now();

    return entry;
  }

  function remove(reelId) {
    entries.delete(reelId);
  }

  function clear() {
    entries.clear();
  }

  function getAll() {
    return Array.from(entries.values());
  }

  function trim() {
    if (entries.size <= maxEntries) {
      return;
    }

    const candidates = Array.from(entries.values())
      .sort((a, b) => {
        if (a.priority !== b.priority) {
          return a.priority - b.priority;
        }

        return a.lastUsedAt - b.lastUsedAt;
      });

    while (entries.size > maxEntries) {
      const candidate = candidates.shift();

      if (!candidate) {
        break;
      }

      entries.delete(candidate.reelId);
    }
  }

  return {
    getEntry,
    setEntry,
    markCurrent,
    markNearby,
    markDistant,
    markSkipped,
    markLoaded,
    markLoading,
    remove,
    clear,
    getAll,
  };
}

export { PRIORITY };
