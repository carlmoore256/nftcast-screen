import { writable } from 'svelte/store';

interface ILog {
    type: 'log' | 'error';
    message: string;
}

export const logs = writable<ILog[]>([]);