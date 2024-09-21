// src/lib/store/navbarStore.ts
import { writable } from 'svelte/store';

type NavbarStatus = boolean[];

export const navbarStatus = writable<NavbarStatus>([true, false, false, false]);
export const searchedTrip = writable<tripCard[]>()
export const tripData = writable<tripPageData>()
export function setActiveNavbarItem(index: number) {
  navbarStatus.update((items) => {
    return items.map((_, i) => i === index);
  });
}
