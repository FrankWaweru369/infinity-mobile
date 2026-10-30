import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { goto } from '$app/navigation';
import { request } from './api.js';

const TOKEN_KEY = 'infinityPushToken';

/** @type {Promise<void> | null} */
let initializationPromise = null;
let listenersRegistered = false;

/** @param {string} token */
async function registerTokenWithBackend(token) {
  if (!token || typeof token !== 'string') {
    return;
  }

  try {
    await request('/push-devices/register', {
      method: 'POST',
      body: JSON.stringify({
        token,
        platform: 'android'
      })
    });

    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, token);
    }
  } catch (error) {
    // Push registration must never interrupt normal app usage.
    console.warn(
      'Infinity push-device registration failed:',
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
}

function registerListeners() {
  if (listenersRegistered) {
    return;
  }

  listenersRegistered = true;

  PushNotifications.addListener('registration', async (token) => {
    await registerTokenWithBackend(token.value);
  });

  PushNotifications.addListener('registrationError', (error) => {
    console.warn(
      'Infinity push registration was unsuccessful:',
      error?.error || 'Unknown error'
    );
  });

  PushNotifications.addListener(
    'pushNotificationActionPerformed',
    async (action) => {
      const data = action?.notification?.data || {};
      const destination = data.path || data.url;

      // Only navigate to internal application paths.
      if (
        typeof destination === 'string' &&
        destination.startsWith('/') &&
        !destination.startsWith('//')
      ) {
        await goto(destination);
        return;
      }

      await goto('/notifications');
    }
  );
}

export async function initializePushNotifications() {
  if (!Capacitor.isNativePlatform() || Capacitor.getPlatform() !== 'android') {
    return;
  }

  if (initializationPromise) {
    return initializationPromise;
  }

  initializationPromise = (async () => {
    try {
      registerListeners();

      let permission = await PushNotifications.checkPermissions();

      if (permission.receive !== 'granted') {
        permission = await PushNotifications.requestPermissions();
      }

      if (permission.receive !== 'granted') {
        console.info('Infinity notifications are not enabled.');
        return;
      }

      await PushNotifications.register();
    } catch (error) {
      console.warn(
        'Infinity push notifications could not be initialized:',
        error instanceof Error ? error.message : 'Unknown error'
      );
    } finally {
      initializationPromise = null;
    }
  })();

  return initializationPromise;
}

export async function unregisterPushNotifications() {
  if (!Capacitor.isNativePlatform() || Capacitor.getPlatform() !== 'android') {
    return;
  }

  if (typeof localStorage === 'undefined') {
    return;
  }

  const token = localStorage.getItem(TOKEN_KEY);

  try {
    if (token) {
      await request('/push-devices/unregister', {
        method: 'POST',
        body: JSON.stringify({ token })
      });
    }
  } catch (error) {
    console.warn(
      'Infinity could not unregister the push device:',
      error instanceof Error ? error.message : 'Unknown error'
    );
  } finally {
    localStorage.removeItem(TOKEN_KEY);
  }
}
