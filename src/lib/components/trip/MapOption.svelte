<script lang="ts">
	import { tripData } from '$lib/store/store';
	import { findTypeDClosest } from '$lib/utilsFn/assistance';
	import Popup from '../Popup.svelte';

	export let checkPointList: (checkpoint | null)[];
	export let mapOptionOpen: boolean;

	let allCheckPointList: checkpoint[] = [];
	let selectedFirstCheckpoint: string = '';
	let selectedSecondCheckpoint: string = '';

	// Subscribe to tripData and populate allCheckPointList
	tripData.subscribe((value) => {
		allCheckPointList = value.checkpoint;
	});

	// Helper function to handle null checkpoints
	function handleNull(index: number): string {
		const text = 'Your location';
		if (checkPointList == null || checkPointList.length == 0) return text;
		return checkPointList[index] == null ? text : checkPointList[index].locationName;
	}

	// Watch mapOptionOpen and update selectedFirstCheckpoint and selectedSecondCheckpoint
	$: if (mapOptionOpen) {
		selectedFirstCheckpoint = handleNull(0);
		selectedSecondCheckpoint = handleNull(1);

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

<Popup bind:isOpen={mapOptionOpen}>
	<div class="flex flex-col gap-2">
		<!-- First checkpoint dropdown -->
		<div class="w-full ml-2 rounded-md">
			<select
				class="w-full bg-transparent text-gray-800 focus:outline-none text-base"
				bind:value={selectedFirstCheckpoint}
			>
				{#each allCheckPointList as ckt}
					<option value={ckt.locationName}>
						{ckt.locationName}
					</option>
				{/each}
			</select>
		</div>

		<div class="font-bold">ไป</div>

		<!-- Second checkpoint dropdown -->
		<div class="w-full ml-2 rounded-md">
			<select
				class="w-full bg-transparent text-gray-800 focus:outline-none text-base"
				bind:value={selectedSecondCheckpoint}
			>
				{#each allCheckPointList as ckt}
					<option value={ckt.locationName}>
						{ckt.locationName}
					</option>
				{/each}
			</select>
		</div>
	</div>
	<hr class="border-gray-400 w-full" />
</Popup>
