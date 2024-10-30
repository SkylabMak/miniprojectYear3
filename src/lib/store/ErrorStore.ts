// src/stores/notificationStore.ts
import { writable } from 'svelte/store';

export const errorDetail = writable<string[]>(['', '']);
export const errorShow = writable<boolean>(false);
export function sendError(message: string, code: string) {
	errorDetail.set([code, message]);
	errorShow.set(true);
}
