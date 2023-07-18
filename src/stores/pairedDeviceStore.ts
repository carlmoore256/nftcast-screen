import { writable } from 'svelte/store';

// Load deviceId from localStorage or set to null if not found
const initialDeviceId = localStorage.getItem('deviceId') || null;

// Create a writable store
export const deviceId = writable(initialDeviceId);

// Subscribe to the store
deviceId.subscribe(value => {
  if (value !== null)
    localStorage.setItem('deviceId', value);
});