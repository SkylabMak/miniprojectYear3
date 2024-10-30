// src/stores/notificationStore.ts
import { writable } from 'svelte/store';
export type NotificationType = 'success' | 'error' | 'info' | 'chat';

export interface Notification {
	id: number;
	message: string;
	by: string;
	type: NotificationType;
}

export const notifications = writable<Notification[]>([]);

export function addNotification(
	message: string,
	by: string,
	type: NotificationType,
	duration = 5000
) {
	const id = Date.now();
	notifications.update((n) => [...n, { id, by, message, type }]);
	setTimeout(() => removeNotification(id), duration);
}

export function removeNotification(id: number) {
	notifications.update((n) => n.filter((notification) => notification.id !== id));
}
