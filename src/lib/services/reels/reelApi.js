import { request } from '../api.js';

export async function fetchReels({
  limit = 5,
  cursor = null,
} = {}) {
  const params = new URLSearchParams();

  params.set('limit', String(limit));

  if (cursor) {
    params.set('cursor', cursor);
  }

  return request(`/reels?${params.toString()}`);
}
