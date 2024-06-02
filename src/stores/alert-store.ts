import { writable } from "svelte/store";


export type Alert = {
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    duration?: number;
};

export const alertStore = writable<Alert | null>(null);