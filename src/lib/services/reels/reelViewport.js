const DEFAULT_THRESHOLD = 0.75;

export function createReelViewport({
  onActive,
  onNearby,
  onInactive,
  threshold = DEFAULT_THRESHOLD,
} = {}) {
  let observer = null;
  const elements = new Map();

  function handleIntersection(entries) {
    for (const entry of entries) {
      const reelId = elements.get(entry.target);

      if (!reelId) {
        continue;
      }

      const visibility = entry.intersectionRatio;

      if (visibility >= threshold) {
        onActive?.(reelId, entry.target);
        continue;
      }

      if (visibility > 0) {
        onNearby?.(reelId, visibility, entry.target);
        continue;
      }

      onInactive?.(reelId, entry.target);
    }
  }

  function createObserver() {
    if (typeof IntersectionObserver === 'undefined') {
      return null;
    }

    observer = new IntersectionObserver(handleIntersection, {
      threshold: [0, 0.25, 0.5, 0.75, 1],
    });

    return observer;
  }

  function observe(element, reelId) {
    if (!element || !reelId) {
      return;
    }

    if (!observer) {
      createObserver();
    }

    if (!observer) {
      return;
    }

    elements.set(element, reelId);
    observer.observe(element);
  }

  function unobserve(element) {
    if (!element) {
      return;
    }

    observer?.unobserve(element);
    elements.delete(element);
  }

  function destroy() {
    observer?.disconnect();
    observer = null;
    elements.clear();
  }

  return {
    observe,
    unobserve,
    destroy,
  };
}
