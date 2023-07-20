import { writable } from "svelte/store";

export const successStore = writable<string | null>(null);