<script>
	export let isOpen = false;
	export let hideCloseBtn = false;
	export let background = 'bg-primary';
	export let cusWeight = 'max-w-[90%]';
	export let cusHeight = 'max-h-[83.33%]';
	export let custPadding = 'p-6'
	export let cusClass = '';
	// Function to close the popup
	function closePopup() {
		isOpen = false;
	}
</script>

{#if isOpen}
	<div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
		<!-- Popup Content -->
		<div
			class={`${background} rounded-lg ${custPadding} ${cusHeight} ${cusWeight} space-y-4 relative shadow-lg flex flex-col justify-center items-center overflow-y-auto ${cusClass}`}
		>
			<div class={`w-full overflow-y-auto `}>
				<slot />
			</div>
			<!-- Close Button -->
			<button
				class={`bg-accent2 w-fit text-white px-4 py-2 rounded-lg ${hideCloseBtn ? 'hidden' : ''}`}
				on:click={closePopup}
			>
				ปิด
			</button>
		</div>
	</div>
{/if}

<style>
	/* Styles for the popup backdrop and content */
	.fixed {
		position: fixed;
		top: 0;
		left: 0;
		max-width: 100%;
		max-height: 100%;
		z-index: 999;
	}

	/* Ensure that the slot container is scrollable if content exceeds the max height */
	.overflow-y-auto {
		overflow-y: auto;
	}
</style>
