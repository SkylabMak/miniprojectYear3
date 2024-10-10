<script>
	import { Circle2 as CircleLoader } from 'svelte-loading-spinners';
	import Popup from './Popup.svelte';
	export let isLoading = false;
</script>

<Popup isOpen={isLoading} hideCloseBtn={true} background="shadow-none overflow-hidden">
	<div class="flex flex-col items-center w-[200px] h-[200px] p-1 m-1 gap-4">
		{#if isLoading}
			<span class="text-white text-xl">รอสักครู่</span>
			<CircleLoader size="100" />
		{/if}
	</div>
</Popup>
