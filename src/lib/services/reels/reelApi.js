import { request } from '../api.js';

/**

* @typedef {Object} FetchReelsOptions
* @property {number} [limit=5]
* @property {string | null} [cursor=null]
*/

/**

* @typedef {Object} FetchUserReelsOptions
* @property {string} [userId]
* @property {number} [limit=5]
* @property {string | null} [cursor=null]
*/

/**

* Fetch the general Reels feed.
* @param {FetchReelsOptions} [options={}]
*/
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

/**

* Fetch Reels belonging to a specific user.
* @param {FetchUserReelsOptions} [options={}]
*/
export async function fetchUserReels({
userId,
limit = 5,
cursor = null,
} = {}) {
if (!userId) {
throw new Error('User ID is required');
}

const params = new URLSearchParams();

params.set('limit', String(limit));

if (cursor) {
params.set('cursor', cursor);
}

return request(
  `/reels/user/${encodeURIComponent(userId)}?${params.toString()}`
);
}
