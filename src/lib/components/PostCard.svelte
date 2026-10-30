<script>
  import { afterUpdate } from 'svelte';
  import { posts as postsApi } from '../services/api.js';
  export let post = {};
  export let currentUserId = '';
  
  let liked = post.isLiked || false;
  let likesCount = post.likes?.length || 0;

$: if (post._id && !likeRequestPending) {
  const postLikes = Array.isArray(post.likes) ? post.likes : [];

  liked = postLikes.some((like) => {
    const likedUserId =
      like && typeof like === 'object' ? like._id : like;

    return String(likedUserId) === String(currentUserId || '');
  });
}

let expanded = false;
let postTextElement;
let textOverflows = false;
let carouselRatio = '4 / 5'

let currentImageIndex = 0;
let carouselElement;

function updateCurrentImage() {
  if (!carouselElement || postImages.length <= 1) return;

  const slideWidth = carouselElement.clientWidth;
  if (!slideWidth) return;

  currentImageIndex = Math.round(
    carouselElement.scrollLeft / slideWidth
  );
};

  $: hasImages = postImages.length > 0;
  $: lineLimit = hasImages ? 3 : 5;

  afterUpdate(() => {
  if (!postTextElement || expanded) return;

  const overflows =
    postTextElement.scrollHeight > postTextElement.clientHeight + 1;

  if (overflows !== textOverflows) {
    textOverflows = overflows;
  }
});

 $: postImages =
  Array.isArray(post.images) && post.images.length > 0
    ? post.images
    : post.image
      ? [post.image]
      : [];

  let likeRequestPending = false;

// Comment section state
  let commentsOpen = false;
  let comments = Array.isArray(post.comments)
    ? [...post.comments]
    : [];

  let commentText = '';
  let commentSubmitting = false;
  let commentError = '';

  // Private feedback state
  let privateFeedbackOpen = false;
  let privateFeedbackText = '';
  let privateFeedbackSubmitting = false;
  let privateFeedbackMessage = '';
  let privateFeedbackError = '';
  let myPrivateFeedback = [];
  let privateFeedbackLoading = false;
  let privateFeedbackLoadError = '';
  let receivedPrivateFeedback = [];
  let receivedPrivateFeedbackLoading = false;
  let receivedPrivateFeedbackError = '';

  async function loadReceivedPrivateFeedback() {
    if (
      post.visibility !== 'private' ||
      String(post.author?._id || post.author) !== String(currentUserId)
    ) return;

    receivedPrivateFeedbackLoading = true;
    receivedPrivateFeedbackError = '';

    try {
      const result = await postsApi.getPrivateFeedback(post._id);

      if (!result?.success || !Array.isArray(result.feedback)) {
        throw new Error('Could not load feedback received on this post.');
      }

      receivedPrivateFeedback = result.feedback;
    } catch (error) {
      receivedPrivateFeedbackError =
        error.message || 'Could not load feedback received on this post.';
    } finally {
      receivedPrivateFeedbackLoading = false;
    }
  }

  async function loadMyPrivateFeedback() {
    if (
      post.visibility !== 'private' ||
      String(post.author?._id || post.author) === String(currentUserId)
    ) return;

    privateFeedbackLoading = true;
    privateFeedbackLoadError = '';

    try {
      const result = await postsApi.getMyPrivateFeedback(post._id);

      if (!result?.success || !Array.isArray(result.feedback)) {
        throw new Error('Could not load your previous feedback.');
      }

      myPrivateFeedback = result.feedback;
    } catch (error) {
      privateFeedbackLoadError =
        error.message || 'Could not load your previous feedback.';
    } finally {
      privateFeedbackLoading = false;
    }
  }

  $: commentCount = comments.length;

  async function handleCommentSubmit(event) {
    event.preventDefault();

    if (commentSubmitting) return;

    const text = commentText.trim();

    if (!text) {
      commentError = 'Please write a comment first.';
      return;
    }

    if (text.length > 500) {
      commentError = 'Comments cannot exceed 500 characters.';
      return;
    }

    commentSubmitting = true;
    commentError = '';

    try {
      const result = await postsApi.comment(post._id, text);

      if (!result?.success || !result.comment) {
        throw new Error('The comment could not be saved. Please try again.');
      }

      // Add the server-confirmed comment to the visible list.
      comments = [...comments, result.comment];

      commentText = '';
      commentError = '';
    } catch (error) {
      commentError =
        error.message || 'Could not add your comment. Please try again.';
    } finally {
      commentSubmitting = false;
    }
  }


  async function handlePrivateFeedbackSubmit(event) {
    event.preventDefault();

    if (privateFeedbackSubmitting) return;

    const text = privateFeedbackText.trim();

    if (!text) {
      privateFeedbackError = 'Please write your feedback first.';
      return;
    }

    if (text.length > 500) {
      privateFeedbackError = 'Feedback cannot exceed 500 characters.';
      return;
    }

    privateFeedbackSubmitting = true;
    privateFeedbackError = '';
    privateFeedbackMessage = '';

    try {
      const result = await postsApi.sendPrivateFeedback(post._id, text);

      if (!result?.success) {
        throw new Error('Feedback could not be sent. Please try again.');
      }

      privateFeedbackText = '';
      privateFeedbackOpen = false;
      privateFeedbackMessage = 'Private feedback sent successfully.';
      await loadMyPrivateFeedback();
    } catch (error) {
      privateFeedbackError =
        error.message || 'Could not send feedback. Please try again.';
    } finally {
      privateFeedbackSubmitting = false;
    }
  }

async function handleLike() {
  if (likeRequestPending) return;

  const previousLiked = liked;
  const previousCount = likesCount;
  const nextLiked = !previousLiked;

  // Update immediately for a responsive interface.
  liked = nextLiked;
  likesCount = Math.max(
    0,
    previousCount + (nextLiked ? 1 : -1)
  );

  likeRequestPending = true;

  try {
    const result = await postsApi.like(post._id, nextLiked);

    // Use the server's authoritative result.
    liked = result.liked;
    likesCount = result.likesCount;
  } catch (error) {
    // Roll back if the server rejects the request.
    liked = previousLiked;
    likesCount = previousCount;

    alert(error.message || 'Could not update like. Please try again.');
  } finally {
    likeRequestPending = false;
  }
}
  
  function formatDate(date) {
    if (!date) return '';
    const d = new Date(date);
    const now = new Date();
    const diff = Math.floor((now.getTime() - d.getTime()) / 1000);
    
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  }

  function handleFirstImageLoad(event) {
  if (postImages.length <= 1) return;

  const img = event.currentTarget;

  if (img.naturalWidth && img.naturalHeight) {
    carouselRatio = `${img.naturalWidth} / ${img.naturalHeight}`;
  }
}

  import { onMount } from 'svelte';

  onMount(() => {
    loadMyPrivateFeedback();
    loadReceivedPrivateFeedback();
  });

</script>

<div class="post-card">
  <div class="post-header">
    <div class="user-info">
      <div class="avatar">
        {#if post.author?.profilePicture}
          <img src={post.author.profilePicture} alt={post.author.username} />
        {:else}
          <div class="avatar-placeholder">
            {post.author?.username?.charAt(0)?.toUpperCase() || 'U'}
          </div>
        {/if}
      </div>
      <div class="user-details">
        <span class="username">{post.author?.username || 'Unknown'}</span>
        <span class="timestamp">{formatDate(post.createdAt)}</span>
      </div>
    </div>
  </div>
  
  <div class="post-content">
    <p
  bind:this={postTextElement}
  class="post-text"
  class:has-images={hasImages}
  class:expanded={expanded}
>{post.content || ''}</p>

{#if textOverflows}
  <button
    class="read-more-btn"
    on:click={() => (expanded = !expanded)}
  >
    {expanded ? 'Show less' : 'Read more'}
  </button>
{/if}
    {#if postImages.length > 0}
 <div
  bind:this={carouselElement}
  class="post-image-carousel"
  class:multi-image-carousel={postImages.length > 1}
  style:--carousel-ratio={carouselRatio}
  on:scroll={updateCurrentImage}
>
    {#each postImages as image, index}
      <div class="post-image-slide">
        <img
  src={image}
  alt="Post image {index + 1}"
  class="post-image"
  loading={index === 0 ? 'eager' : 'lazy'}
  on:load={index === 0 ? handleFirstImageLoad : undefined}
/>
      </div>
    {/each}
  </div>

  {#if postImages.length > 1}
    <div class="carousel-indicators">
      <div class="carousel-dots">
        {#each postImages as image, index}
          <span
            class="carousel-dot"
            class:active={currentImageIndex === index}
          ></span>
        {/each}
      </div>

      <span class="carousel-counter">
        {currentImageIndex + 1}/{postImages.length}
      </span>
    </div>
  {/if}
{/if}
  </div>
  
  {#if post.visibility !== 'private'}
  <div class="post-actions">
    {#if post.allowLikes !== false}
      <button
        class="like-btn"
        class:liked
        on:click={handleLike}
        disabled={likeRequestPending}
      >
        <span class="action-icon">{liked ? '❤️' : '🤍'}</span>
        <span class="action-count">{likesCount}</span>
      </button>
    {/if}

    {#if post.allowComments !== false}
      <button
        class="comment-btn"
        aria-expanded={commentsOpen}
        on:click={() => {
          commentsOpen = !commentsOpen;
          commentError = '';
        }}
      >
        <span class="action-icon">💬</span>
        <span class="action-count">{commentCount}</span>
      </button>
    {/if}
  </div>
{/if}

  {#if post.visibility === 'private' && String(post.author?._id || post.author) === String(currentUserId)}
    <section class="received-private-feedback-inbox">
      <h3>Private Feedback Inbox</h3>

      {#if receivedPrivateFeedbackLoading}
        <p>Loading feedback received…</p>
      {:else if receivedPrivateFeedbackError}
        <p class="comment-error" role="alert">{receivedPrivateFeedbackError}</p>
      {:else if receivedPrivateFeedback.length === 0}
        <p>No private feedback received yet.</p>
      {:else}
        {#each receivedPrivateFeedback as feedback (feedback._id)}
          <article class="my-private-feedback-item">
            <p>{feedback.text}</p>
            {#if feedback.createdAt}
              <small>{formatDate(feedback.createdAt)}</small>
            {/if}
            <span>Private feedback</span>
          </article>
        {/each}
      {/if}
    </section>
  {/if}

  {#if post.visibility === 'private' && String(post.author?._id || post.author) !== String(currentUserId)}
    <section class="private-feedback-section">
      <button
        type="button"
        class="private-feedback-toggle"
        aria-expanded={privateFeedbackOpen}
        on:click={() => {
          privateFeedbackOpen = !privateFeedbackOpen;
          privateFeedbackError = '';
          privateFeedbackMessage = '';
        }}
      >
        {privateFeedbackOpen ? 'Cancel feedback' : 'Send private feedback'}
      </button>

      {#if privateFeedbackOpen}
        <form class="private-feedback-form" on:submit={handlePrivateFeedbackSubmit}>
          <label class="sr-only" for="private-feedback-{post._id}">
            Write private feedback
          </label>
          <textarea
            id="private-feedback-{post._id}"
            bind:value={privateFeedbackText}
            maxlength="500"
            placeholder="Write feedback visible only to the post author..."
            disabled={privateFeedbackSubmitting}
            rows="3"
          ></textarea>

          <div class="private-feedback-footer">
            <small>{privateFeedbackText.length}/500</small>
            <button
              type="submit"
              disabled={privateFeedbackSubmitting || !privateFeedbackText.trim()}
            >
              {privateFeedbackSubmitting ? 'Sending…' : 'Send privately'}
            </button>
          </div>
        </form>
      {/if}

      {#if privateFeedbackMessage}
        <p class="private-feedback-success" role="status">{privateFeedbackMessage}</p>
      {/if}

      <div class="my-private-feedback" aria-live="polite">
        <h4>Your private feedback</h4>

        {#if privateFeedbackLoading}
          <p>Loading your feedback…</p>
        {:else if privateFeedbackLoadError}
          <p class="comment-error" role="alert">{privateFeedbackLoadError}</p>
        {:else if myPrivateFeedback.length === 0}
          <p>You haven't sent feedback on this post yet.</p>
        {:else}
          {#each myPrivateFeedback as feedback (feedback._id)}
            <article class="my-private-feedback-item">
              <p>{feedback.text}</p>
              {#if feedback.createdAt}
                <small>{formatDate(feedback.createdAt)}</small>
              {/if}
              <span>Sent privately</span>
            </article>
          {/each}
        {/if}
      </div>

      {#if privateFeedbackError}
        <p class="comment-error" role="alert">{privateFeedbackError}</p>
      {/if}
    </section>
  {/if}

  {#if commentsOpen && post.visibility !== 'private'}
<section class="comments-section">
<h3>Comments ({commentCount})</h3>

  {#if comments.length === 0}
    <p class="comments-empty">No comments yet. Start the conversation.</p>
  {:else}
    <div class="comments-list">
      {#each comments as comment (comment._id)}
        <article class="comment-item">
          <div class="comment-avatar">
            {#if comment.user?.profilePicture}
              <img
                src={comment.user.profilePicture}
                alt={comment.user.username || 'User'}
              />
            {:else}
              <span>
                {(comment.user?.username || 'U').charAt(0).toUpperCase()}
              </span>
            {/if}
          </div>

          <div class="comment-body">
            <strong>{comment.user?.username || 'User'}</strong>
            <p>{comment.text}</p>
            {#if comment.createdAt}
              <small>{formatDate(comment.createdAt)}</small>
            {/if}
          </div>
        </article>
      {/each}
    </div>
  {/if}

  <form class="comment-form" on:submit={handleCommentSubmit}>
    <label class="sr-only" for="comment-{post._id}">Write a comment</label>
    <input
      id="comment-{post._id}"
      bind:value={commentText}
      maxlength="500"
      placeholder="Write a comment..."
      disabled={commentSubmitting}
    />
    <button
      type="submit"
      disabled={commentSubmitting || !commentText.trim()}
    >
      {commentSubmitting ? 'Sending…' : 'Send'}
    </button>
  </form>

  {#if commentError}
    <p class="comment-error" role="alert">{commentError}</p>
  {/if}
</section>

{/if}

</div>

<style>
  .post-card {
  background: var(--card-bg);
  width: 100%;
  margin: 0 0 3px 0;
  padding: 0;
  border: none;
  border-radius: 0;
  box-shadow: none;
}
  
  .post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 14px;
  margin: 0;
}
  
  .user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
}
  
  .avatar {
  width: 46px;
  height: 46px;
  min-width: 46px;
  min-height: 46px;
  border-radius: 50%;
  overflow: hidden;
  background: #2a2a2a;
  flex-shrink: 0;
  display: block;
}

.avatar img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: linear-gradient(135deg, #8b5cf6, #ec4899);
  color: white;
  font-weight: bold;
  font-size: 18px;
}
  
  .user-details {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  max-width: 75%;
}
  
 .username {
  display: block;
  max-width: 75%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 600;
  font-size: 17px;
  line-height: 1.3;
  color: var(--text-primary);
}
  
  .timestamp {
  font-size: 12px;
  color: var(--text-secondary);
}
  
  .post-content {
  padding: 0 0 8px 0;
  margin: 0;
}
  
.post-text {
  font-size: 16px;
  line-height: 1.6;
  margin: 0 0 4px 0;
  padding: 0 16px;
  color: var(--text-primary);
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-text:not(.expanded):not(.has-images) {
  -webkit-line-clamp: 5;
  line-clamp: 5;
}

.post-text:not(.expanded).has-images {
  -webkit-line-clamp: 3;
  line-clamp: 3;
}

.post-text.expanded {
  display: block;
  overflow: visible;
}

.read-more-btn {
display: block;
margin: 0 16px 12px;
padding: 0;
border: none;
background: none;
color: #8b5cf6;
font-size: 14px;
font-weight: 600;
cursor: pointer;
}
  
  .post-image-carousel {
  display: flex;
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
  background: transparent;
}

.post-image-carousel::-webkit-scrollbar {
  display: none;
}

.post-image-slide {
  flex: 0 0 100%;
  width: 100%;
  min-width: 0;
  scroll-snap-align: start;
}

/* Preserve the original single-image appearance */
.post-image-carousel:not(.multi-image-carousel) .post-image-slide {
  aspect-ratio: auto;
}

.post-image-carousel:not(.multi-image-carousel) .post-image {
  display: block;
  width: 100%;
  height: auto;
  max-height: 600px;
  object-fit: contain;
  border-radius: 0;
}

/* Multiple-image posts share the first image's proportions */
.multi-image-carousel .post-image-slide {
  aspect-ratio: var(--carousel-ratio, 4 / 5);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: var(--bg-secondary);
}

.multi-image-carousel .post-image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 0;
}
  
  .post-actions {
    display: flex;
    gap: 24px;
    padding: 8px 16px 12px 16px;
    margin: 0;
    border: none;
  }
  
  .like-btn, .comment-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 6px 8px;
    border-radius: 8px;
    font-size: 14px;
    transition: all 0.2s;
  }
  
  .like-btn:active, .comment-btn:active {
    background: var(--bg-secondary);
    transform: scale(0.96);
  }
  
  .action-icon {
    font-size: 20px;
  }
  
  .action-count {
    font-size: 13px;
    color: var(--text-secondary);
  }
  
  .like-btn.liked .action-icon {
    color: #ec4899;
  }
  
  .like-btn.liked .action-count {
    color: #ec4899;
  }
  
  @media (max-width: 640px) {
    .post-header {
      padding: 10px 12px;
    }
    
    .post-content {
  padding: 0 0 8px 0;
}

.post-text {
  padding: 0 12px;
}

.post-image {
  width: 100%;
}
    
    .post-actions {
      padding: 6px 12px 10px 12px;
    }
  }

  .carousel-indicators {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  min-height: 28px;
  padding: 4px 16px;
}

.carousel-dots {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}

.carousel-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--text-secondary);
  opacity: 0.4;
  transition: background 0.2s ease, opacity 0.2s ease;
}

.carousel-dot.active {
  background: #8b5cf6;
  opacity: 1;
  transform: scale(1.2);
}

.carousel-counter {
  position: absolute;
  right: 14px;
  font-size: 12px;
  color: var(--text-secondary);
}

/* Comments section */
  .comments-section {
    padding: 12px 16px 16px;
    border-top: 1px solid var(--bg-secondary);
  }

  .comments-section h3 {
    margin: 0 0 12px;
    font-size: 15px;
    font-weight: 600;
    color: var(--text-primary);
  }

  .comments-empty {
    margin: 0 0 14px;
    color: var(--text-secondary);
    font-size: 13px;
  }

  .comments-list {
    display: flex;
    flex-direction: column;
    gap: 14px;
    margin-bottom: 16px;
  }

  .comment-item {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    min-width: 0;
  }

  .comment-avatar {
    width: 34px;
    height: 34px;
    flex: 0 0 34px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    border-radius: 50%;
    background: var(--bg-secondary);
    color: var(--text-primary);
    font-size: 13px;
    font-weight: 600;
  }

  .comment-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .comment-body {
    min-width: 0;
    flex: 1;
  }

  .comment-body strong {
    display: block;
    margin-bottom: 3px;
    color: var(--text-primary);
    font-size: 13px;
  }

  .comment-body p {
    margin: 0;
    overflow-wrap: anywhere;
    color: var(--text-primary);
    font-size: 14px;
    line-height: 1.45;
    white-space: pre-wrap;
  }

  .comment-body small {
    display: block;
    margin-top: 4px;
    color: var(--text-secondary);
    font-size: 11px;
  }

  .comment-form {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .comment-form input {
    min-width: 0;
    flex: 1;
    padding: 11px 12px;
    border: 1px solid var(--bg-secondary);
    border-radius: 20px;
    outline: none;
    background: var(--card-bg);
    color: var(--text-primary);
    font: inherit;
    font-size: 14px;
  }

  .comment-form input:focus {
    border-color: var(--text-secondary);
  }

  .comment-form button {
    min-height: 40px;
    padding: 0 14px;
    border: none;
    border-radius: 20px;
    background: var(--text-primary);
    color: var(--card-bg);
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
  }

  .comment-form button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .comment-error {
    margin: 8px 0 0;
    color: #dc2626;
    font-size: 12px;
  }

.private-feedback-section {
    padding: 12px 14px;
    border-top: 1px solid var(--border-color, #e5e7eb);
  }

  .private-feedback-toggle {
    width: 100%;
    padding: 10px 14px;
    border: 1px solid var(--border-color, #d1d5db);
    border-radius: 10px;
    background: transparent;
    color: var(--text-color, inherit);
    font: inherit;
    cursor: pointer;
  }

  .private-feedback-form {
    margin-top: 12px;
  }

  .private-feedback-form textarea {
    display: block;
    width: 100%;
    box-sizing: border-box;
    padding: 12px;
    border: 1px solid var(--border-color, #d1d5db);
    border-radius: 10px;
    background: var(--card-bg, #fff);
    color: var(--text-color, inherit);
    font: inherit;
    resize: vertical;
  }

  .private-feedback-form textarea:focus {
    outline: 2px solid var(--accent-color, #777);
    outline-offset: 2px;
  }

  .private-feedback-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    margin-top: 8px;
  }

  .private-feedback-footer button {
    padding: 9px 14px;
    border: none;
    border-radius: 8px;
    background: var(--accent-color, #333);
    color: white;
    font: inherit;
    cursor: pointer;
  }

  .private-feedback-footer button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .private-feedback-success {
    margin: 10px 0 0;
    font-size: 0.9rem;
    color: #16803c;
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  .my-private-feedback {
    margin-top: 14px;
  }

  .my-private-feedback h4 {
    margin: 0 0 8px;
    font-size: 0.95rem;
  }

  .my-private-feedback-item {
    padding: 10px 12px;
    margin-top: 8px;
    border-radius: 10px;
    background: var(--card-bg, #f5f5f5);
    overflow-wrap: anywhere;
  }

  .my-private-feedback-item p {
    margin: 0 0 8px;
    white-space: pre-wrap;
  }

  .my-private-feedback-item small,
  .my-private-feedback-item span {
    display: inline-block;
    margin-right: 10px;
    font-size: 0.8rem;
    opacity: 0.75;
  }

</style>
