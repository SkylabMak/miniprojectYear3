// src/lib/store/navbarStore.ts
import { writable } from 'svelte/store';

type NavbarStatus = boolean[];

export const navbarStatus = writable<NavbarStatus>([true, false, false, false]);
export const searchedTrip = writable<tripCard[]>();
export const readChat = writable<string>('');
// export const newChatEvent = writable<boolean>(false)
export const closeChatEvent = writable<boolean>(false);
export const tripData = writable<tripPageData>();
export function setActiveNavbarItem(index: number) {
	navbarStatus.update((items) => {
		return items.map((_, i) => i === index);
	});
}
