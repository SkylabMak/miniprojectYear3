<script lang="ts">
	import Popup from '$lib/components/Popup.svelte';
	import Icon from '@iconify/svelte';
	import { tick } from 'svelte'; // Import tick from svelte

	export let editMode: boolean;
	let showEditTripPopup = false;
	let editTripButton: HTMLButtonElement | null = null;

	async function togglePopup() {
		showEditTripPopup = showEditTripPopup ? false : true;
		if (showEditTripPopup) {
			await tick();
			editTripButton?.focus();
		}
	}
	// $:console.log(showEditTripPopup)
</script>

<div class="relative">
	<!-- Ellipsis Button -->
	<button
		class="flex items-center justify-center w-fit h-[100%] rounded-full border-grayfocus-100 shadow-md px-4 py-1"
		on:click={togglePopup}
	>
		<Icon icon={'ri:more-fill'} class={`text-2xl flex justify-center`} />
	</button>

	<!-- Edit Trip Popup Button positioned on the left bottom of the ellipsis button -->
	{#if showEditTripPopup}
		<button
			on:blur={() => {
				showEditTripPopup = false;
			}}
			bind:this={editTripButton}
			on:click={() => {
				editMode = !editMode;
				showEditTripPopup = false;
			}}
			class="absolute left-[-140px] bottom-[-40px] bg-accent2 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2"
		>
			<span class={'text-lg'}>{editMode ? 'ปิดการแก้ไขทริป' : 'แก้ไขทริป'}</span>
			<Icon icon={'material-symbols-light:draw-outline'} class={'text-4xl'} />
		</button>
	{/if}
</div>
