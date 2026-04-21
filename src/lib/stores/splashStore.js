import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// Track if splash has been shown in this browser session
let initialValue = false;
if (browser) {
  initialValue = sessionStorage.getItem('splashShown') === 'true';
}

export const splashShown = writable(initialValue);

export function markSplashShown() {
  if (browser) {
    sessionStorage.setItem('splashShown', 'true');
    splashShown.set(true);
  }
}

export function resetSplash() {
  if (browser) {
    sessionStorage.removeItem('splashShown');
    splashShown.set(false);
  }
}
