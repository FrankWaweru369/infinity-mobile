const activeRequests = new Map();

export async function loadReelMedia(reelId, url) {
  if (!reelId || !url) {
    throw new Error('Reel ID and media URL are required');
  }

  const existing = activeRequests.get(reelId);

  if (existing) {
    return existing.promise;
  }

  const controller = new AbortController();

  const promise = fetch(url, {
    method: 'GET',
    signal: controller.signal,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `Media request failed with status ${response.status}`
        );
      }

      return response;
    })
    .finally(() => {
      activeRequests.delete(reelId);
    });

  activeRequests.set(reelId, {
    controller,
    promise,
  });

  return promise;
}

export function cancelReelMedia(reelId) {
  const request = activeRequests.get(reelId);

  if (!request) {
    return false;
  }

  request.controller.abort();
  activeRequests.delete(reelId);

  return true;
}

export function isReelMediaLoading(reelId) {
  return activeRequests.has(reelId);
}

export function cancelAllReelMedia() {
  for (const request of activeRequests.values()) {
    request.controller.abort();
  }

  activeRequests.clear();
}
