<script lang="ts">
	import { goto } from '$app/navigation';
	import { tripData } from '$lib/store/store';
	import { getTripData } from '$lib/utilsFn/getTripData';
	import ButtonMine from '../ButtonMine.svelte';
	// import ButtonMine from '../ButtonMine.svelte';
	import Popup from '../Popup.svelte';
	let border = '';
	export let privateTripOpen: boolean;
	let inputText: string = '';

	function closeReset() {
		inputText = '';
		privateTripOpen = false;
	}

	async function visit() {
		if (inputText.trim().length != 0) {
			const tripId = inputText.split('/').pop();
			if (tripId) {
				try {
					const tripDataFromCard: tripPageData = await getTripData(tripId);
					console.log('tripDataFromCard ', tripDataFromCard);
					tripData.set(tripDataFromCard);
					goto('/trip/' + tripDataFromCard.tripID);
				} catch (error) {
					console.log('error');
					border = 'ring-2	ring-error';
					setTimeout(() => {
						border = '';
					}, 1000);
				}
			}
		}
	}
</script>

<Popup bind:isOpen={privateTripOpen} hideCloseBtn={true} background={'bg-secondary4'}>
	<div class="w-full flex flex-col items-center px-1">
		<span>ใส่ trip id</span>
		<input
			type="text"
			bind:value={inputText}
			class={`${border} rounded-md px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-accent2-500`}
		/>
		<div class="flex items-center gap-4 justify-center mt-4">
			<button on:click={closeReset}>
				<ButtonMine>ยกเลิก</ButtonMine>
			</button>
			<button on:click={visit}>
				<ButtonMine>เยี่ยม</ButtonMine>
			</button>
		</div>
	</div>
</Popup>
