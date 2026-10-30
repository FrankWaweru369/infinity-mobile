import { io } from 'socket.io-client';
import { writable } from 'svelte/store';
import { getAccessToken } from './session.js';
import { notifications } from './api.js';

const SOCKET_URL = import.meta.env.PROD
  ? 'https://infinity-app-mobile-backend.onrender.com'
  : 'http://localhost:10001';

export const unreadNotificationCount = writable(0);
export const latestNotification = writable(null);
export const notificationConnectionStatus = writable('disconnected');

let socket = null;
let activeToken = null;
let countRequestInProgress = false;

async function refreshUnreadCount() {
  if (countRequestInProgress || !getAccessToken()) return;

  countRequestInProgress = true;

  try {
    const result = await notifications.getUnreadCount();
    unreadNotificationCount.set(Number(result.unreadCount) || 0);
  } catch (error) {
    console.error('Could not refresh notification count:', error.message);
  } finally {
    countRequestInProgress = false;
  }
}

export function connectNotifications() {
  const token = getAccessToken();

  if (!token) {
    disconnectNotifications();
    return null;
  }

  if (socket?.connected && activeToken === token) {
    return socket;
  }

  if (socket && activeToken !== token) {
    socket.disconnect();
    socket = null;
  }

  if (socket) {
    return socket;
  }

  activeToken = token;

  socket = io(SOCKET_URL, {
    autoConnect: false,
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 10000,
    timeout: 10000,
    auth: (callback) => {
      callback({ token: getAccessToken() });
    }
  });

  socket.on('connect', () => {
    notificationConnectionStatus.set('connected');
    refreshUnreadCount();
  });

  socket.on('disconnect', () => {
    notificationConnectionStatus.set('disconnected');
  });

  socket.on('connect_error', (error) => {
    notificationConnectionStatus.set('error');
    console.error('Notification connection failed:', error.message);
  });

  socket.on('notification:new', (notification) => {
    latestNotification.set(notification);

    if (!notification.readAt) {
      unreadNotificationCount.update((count) => count + 1);
    }
  });

  socket.connect();

  // Also retrieve the persisted count if the socket takes time to connect.
  refreshUnreadCount();

  return socket;
}

export function disconnectNotifications() {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }

  activeToken = null;
  countRequestInProgress = false;
  unreadNotificationCount.set(0);
  latestNotification.set(null);
  notificationConnectionStatus.set('disconnected');
}

export async function syncUnreadNotificationCount() {
  await refreshUnreadCount();
}

export function decrementUnreadNotificationCount() {
  unreadNotificationCount.update((count) => Math.max(0, count - 1));
}

export function clearUnreadNotificationCount() {
  unreadNotificationCount.set(0);
}
