<script lang="ts">
	import ButtonMine from './ButtonMine.svelte';
	import Popup from './Popup.svelte';

	export let inputText: string = '';
	export let inputIMGOpen: boolean = false;
	export let originText = '';
	export let isImageError;

	function closeReset() {
		inputText = originText;
		inputIMGOpen = false;
		isImageError = false;
	}

	function checkImageURL(url: string) {
		const img = new Image();
		img.onload = () => {
			isImageError = false; // Image loaded successfully, no error
		};
		img.onerror = () => {
			isImageError = true; // Error loading image, set error to true
		};
		img.src = url;
	}

	// Update isImageError whenever inputText changes
	$: checkImageURL(inputText);
</script>

<Popup bind:isOpen={inputIMGOpen} hideCloseBtn={true} background={'bg-secondary4'}>
	<div class="w-full">
		<input
			type="text"
			bind:value={inputText}
			class={`rounded-md px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500`}
		/>
		<div class="flex items-center gap-4 justify-center mt-4">
			<button on:click={closeReset}>
				<ButtonMine>ยกเลิก</ButtonMine>
			</button>
			<button
				on:click={() => {
					inputIMGOpen = false;
				}}
			>
				<ButtonMine>ยืนยัน</ButtonMine>
			</button>
		</div>
	</div>
</Popup>
