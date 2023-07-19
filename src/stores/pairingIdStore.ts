import { writable } from 'svelte/store';

// pairingId represents an open pairing session
export const pairingId = writable<string | null>(null);