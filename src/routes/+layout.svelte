<script lang="ts">
	import '../app.css';
	import Navbar from '$lib/components/layout/Navbar.svelte';
	import SearchBar from '$lib/components/layout/SearchBar.svelte';
	import { searchedTrip, setActiveNavbarItem } from '$lib/store/store';
	import { onDestroy, onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { get } from 'svelte/store';
	import { navNumber } from '$lib/utilsFn/pageNumber';
	let searchTerm = '';

	async function getSearchTrip() {
		const response = await fetch('/api/search', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				Text: searchTerm
			})
		});
		const data = (await response.json()).Trip;
		// console.log("searched data",data)
		searchedTrip.set(data);
		setActiveNavbarItem(0);
		goto('/');
	}

	function handleSearch(event: CustomEvent) {
		// console.log('Search term:', event.detail.term);
		getSearchTrip();
	}

	// Function to handle "back" navigation detection
	// function handlePopState(event: PopStateEvent) {
	// 	console.log('User navigated back or forward in history');
	// 	const currentPath = get(page).url.pathname; // Get the current path when popstate is triggered
	// 	console.log('Current path after navigation:', currentPath);
	// }

	onMount(() => {
		const unsubscribe = page.subscribe((p) => {
			if (p.url.pathname === '/') {
				// console.log('Path is "/", running getSearchTrip()');
				getSearchTrip(); // Run getSearchTrip() only if the path is "/"
			} else if (p.url.pathname.includes('trip')) {
			} else {
				console.log('page change');
				setActiveNavbarItem(navNumber[p.url.pathname as keyof typeof navNumber]);
			}
		});

		// Clean up the subscription when the component is destroyed
		return () => {
			unsubscribe();
		};
	});
</script>

<!-- <svelte:window on:popstate={handlePopState} /> -->
<div class="app bg-primary">
	<SearchBar bind:searchTerm on:search={handleSearch} />

	<main>
		<slot />
	</main>

	<Navbar />
</div>

<style lang="postcss">
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		padding-bottom: 6rem;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		max-width: 64rem;
		margin: 0 auto;
		box-sizing: border-box;
		font-family: 'Roboto', sans-serif;
	}
</style>
