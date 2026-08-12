import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// Get initial theme from localStorage or system preference
function getInitialTheme() {
  if (!browser) return 'dark'; // Default for SSR
  
  const stored = localStorage.getItem('theme');
  if (stored === 'light' || stored === 'dark') {
    return stored;
  }
  
  // Check system preference
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
}

// Create the store
export const theme = writable(getInitialTheme());

// Apply theme to DOM
export function applyTheme(themeValue) {
  if (!browser) return;
  
  if (themeValue === 'dark') {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }
}

// Toggle theme function
export function toggleTheme() {
  theme.update(current => {
    const newTheme = current === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    return newTheme;
  });
}

// Initialize theme on app start
if (browser) {
  const initialTheme = getInitialTheme();
  applyTheme(initialTheme);
  theme.set(initialTheme);
}
