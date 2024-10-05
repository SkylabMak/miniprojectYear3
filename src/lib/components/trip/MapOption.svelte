<script lang="ts">
	import { tripData } from '$lib/store/store';
	import { filterDest, genGoogleMapsURL_WithText } from '$lib/utilsFn/assistance';
	import ButtonMine from '../ButtonMine.svelte';
	import MapCicleIcon from '../MapCicleIcon.svelte';
	import Popup from '../Popup.svelte';

	export let checkPointList: (checkpoint | null)[];
	export let mapOptionOpen: boolean;

	let allCheckPointList: checkpoint[] = [];
	let selectedFirstCheckpoint: string = '';
	let selectedSecondCheckpoint: string = '';

	// Subscribe to tripData and filter destinations
	tripData.subscribe((value) => {
		allCheckPointList = filterDest(value.checkpoint);
	});

	// Helper function to handle null or empty checkpoint values
	function getLocationName(index: number): string {
		return checkPointList?.[index]?.locationName ?? 'Your location';
	}

	// Function to open Google Maps with selected checkpoints
	function openGoogleMap() {
		const mapURL = genGoogleMapsURL_WithText([
			selectedFirstCheckpoint === 'Your location' ? null : selectedFirstCheckpoint,
			selectedSecondCheckpoint === 'Your location' ? null : selectedSecondCheckpoint
		]);
		window.open(mapURL, '_blank');
	}

	//selectedFirstCheckpoint && electedSecondCheckpoint is empty or not yet set.
	$: if (mapOptionOpen && !selectedFirstCheckpoint && !selectedSecondCheckpoint) {
		// Initialize only when mapOptionOpen is true and selections are not already set
		selectedFirstCheckpoint = getLocationName(0);
		selectedSecondCheckpoint = getLocationName(1);

		// Add "Your location" option at the top of allCheckPointList if it's not already there
		if (!allCheckPointList.some((ck) => ck.locationName === 'Your location')) {
			allCheckPointList = [
				{
					IDCheckpoint: '',
					time: '',
					locationName: 'Your location',
					type: '',
					commentCount: 0,
					unRead: 0,
					orderC: 0,
					progress: [],
					me: false
				},
				...allCheckPointList
			];
		}
	}
</script>

<Popup bind:isOpen={mapOptionOpen} background="bg-secondary4">
	<div class="bg-secondary4 flex flex-col items-center">
		<div class="flex flex-col gap-2 items-center">
			<!-- First checkpoint dropdown -->
			<div
				class="flex items-center bg-secondary4 text-black font-bold py-2 px-4 rounded-lg border-2 border-black"
			>
				<select
					class="w-full bg-transparent text-black focus:outline-none text-base"
					bind:value={selectedFirstCheckpoint}
				>
					{#each allCheckPointList as ckt}
						<option value={ckt.locationName}>{ckt.locationName}</option>
					{/each}
				</select>
			</div>

			<div class="font-bold text-accent1">ไป</div>

			<!-- Second checkpoint dropdown -->
			<div
				class="flex items-center bg-secondary4 text-black font-bold py-2 px-4 rounded-lg border-2 border-black"
			>
				<select
					class="w-full bg-transparent text-black focus:outline-none text-base"
					bind:value={selectedSecondCheckpoint}
				>
					{#each allCheckPointList as ckt}
						<option value={ckt.locationName}>{ckt.locationName}</option>
					{/each}
				</select>
			</div>
		</div>

		<hr class="border-gray-400 w-full my-4" />

		<button on:click={openGoogleMap}>
			<ButtonMine>
				<div class="flex gap-2 items-center">
					ใช้ googlemap <MapCicleIcon />
				</div>
			</ButtonMine>
		</button>
	</div>
</Popup>
