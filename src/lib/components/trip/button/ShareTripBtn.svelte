<script lang="ts">
	import Icon from '@iconify/svelte';
	let textShow = 'Share';
	let background = 'bg-white';
	async function copyURL() {
		try {
			await navigator.clipboard.writeText(window.location.href);
			textShow = 'Copied!';
			background = 'bg-success text-white';
			setTimeout(() => {
				textShow = 'Share';
				background = 'bg-white '; // Reset color after 2 seconds
			}, 3000);
		} catch (err) {
			console.error('Failed to copy URL: ', err);
		}
	}
</script>

<div class="relative">
	<button
		class={`${background} flex items-center justify-between w-fit h-full rounded-full border border-grayfocus-100 shadow-md px-4 py-1`}
		on:click={copyURL}
	>
		<span class=" font-medium">{textShow}</span>
		<div
			class={`${background} flex items-center justify-center w-6 h-6 border border-grayfocus-100 shadow-md rounded-full ml-2`}
		>
			<Icon icon="mdi:share" class="" />
		</div>
	</button>
</div>
