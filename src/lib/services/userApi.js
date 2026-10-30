import { request } from './api.js';

/**
 * Search for users by username.
 * @param {string} query
 */
export async function searchUsers(query) {
  const params = new URLSearchParams();
  params.set('q', query.trim());

  return request(`/users/search?${params.toString()}`);
}

/**
 * Retrieve a user's public profile.
 * @param {string} userId
 */
export async function getUserProfile(userId) {
  if (!userId) {
    throw new Error('User ID is required');
  }

  return request(`/users/${encodeURIComponent(userId)}`);
}
