<script lang="ts">
	import Icon from '@iconify/svelte';

	// Optional props for customization
	export let color = 'black';
	export let thickness = 2;
	export let margin = 'my-4';
	export let open: boolean;
</script>

<div class="flex gap-1 items-center">
	<div
		class={`w-full flex-grow h-[${thickness}px] border-${color} ${margin} border-t bg-${color}`}
	></div>
	<button
		class="w-fit h-fit rounded-full border-black border-2 flex justify-center items-center"
		on:click={() => {
			open = !open;
		}}
	>
		<Icon
			icon="ic:round-arrow-drop-down"
			class={`text-2xl text-black m-[-4px] transition-transform duration-300 ${open ? '' : 'rotate-90'}`}
		/>
	</button>
</div>
