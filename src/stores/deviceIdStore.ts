import { writable } from 'svelte/store';

// Load deviceId from localStorage or set to null if not found
const initialDeviceId = localStorage.getItem('deviceId') || null;

// Create a writable store
export const deviceIdStore = writable(initialDeviceId);

// here we could check the api to see if it's valid, or not

// Subscribe to the store
deviceIdStore.subscribe(value => {
  console.log('deviceId changed to: ' + value);
  if (value !== null)
    localStorage.setItem('deviceId', value);
});