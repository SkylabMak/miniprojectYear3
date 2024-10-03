<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Icon from '@iconify/svelte';

	export let searchTerm = '';
	// Create an event dispatcher
	const dispatch = createEventDispatcher();
	let inputRef: HTMLInputElement | null = null;
	let isFocused = false;
	// Function to handle search submission
	function handleSearch() {
		// console.log(searchTerm)
		dispatch('search', { term: searchTerm });
	}

	// Function to handle "Enter" key press
	function handleKeyPress(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			handleSearch();
		}
	}

	// Function to handle focus
	function handleFocus() {
		isFocused = true;
	}

	// Function to handle blur
	function handleBlur() {
		isFocused = false;
	}
</script>

<div class="flex items-center space-x-2 w-full p-4">
	<!-- Parent div with dynamic focus styling -->
	<div
		class="text-xl w-full rounded-full border bg-white border-grayfocus flex justify-between py-2 pr-4 px-8
         {isFocused ? 'ring-2 ring-ringblue' : ''}"
	>
		<input
			type="text"
			bind:value={searchTerm}
			class="outline-none"
			placeholder="Search..."
			on:keypress={handleKeyPress}
			on:focus={handleFocus}
			on:blur={handleBlur}
			bind:this={inputRef}
		/>
		<button class="p-2 rounded-full" on:click={handleSearch}>
			<Icon icon="ion:search" class="" />
		</button>
	</div>
</div>
