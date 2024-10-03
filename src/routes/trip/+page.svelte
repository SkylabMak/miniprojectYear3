<script lang="ts">
	import MapCicleIcon from '$lib/components/MapCicleIcon.svelte';
	import Checkpoint from '$lib/components/trip/Checkpoint.svelte';
	import CheckpointEdit from '$lib/components/trip/CheckpointEdit.svelte';
	import EditTripBtn from '$lib/components/trip/EditTripBtn.svelte';
	import Go from '$lib/components/trip/Go.svelte';
	import TripFooter from '$lib/components/trip/TripFooter.svelte';
	import TripHeader from '$lib/components/trip/TripHeader.svelte';
	import { tripData } from '$lib/store/store';
	import Icon from '@iconify/svelte';
	import { onDestroy } from 'svelte';

	let canEdit = false;
	let editMode = false;
	let dataTrip: tripPageData;
	let indexPass = -1;
	let showEditPopup = false;
	const unsubscribe = tripData.subscribe((value) => {
		console.log(value);
		dataTrip = value;
		if (value) {
			canEdit = value.me || value.ownOrgTrip;
		}
		if (value) {
			indexPass = value.checkpoint.findIndex((e) => e.me === true);
		}
	});

	onDestroy(() => {
		unsubscribe();
	});

	function formatDate(dateString: string): string {
		const date = new Date(dateString);
		return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
	}
</script>

<div class="w-full mx-auto p-4 rounded-lg text-black">
	<div class="w-full flex justify-end">
		{#if canEdit}
			<EditTripBtn bind:editMode />
		{/if}
	</div>
	<TripHeader bind:editMode />

	<!-- Checkpoints Section -->
	<div class="flex justify-center flex-col text-sm text-black my-4">
		{#if dataTrip && dataTrip.checkpoint && Array.isArray(dataTrip.checkpoint)}
			{#each dataTrip.checkpoint as checkpoint, index}
				{#if index === 0}
					{#if !editMode}
						<Go type={'start'} {index} checkpointList={dataTrip.checkpoint} />
					{/if}
				{:else if checkpoint.type === 'D'}
					<Go type={'large'} {index} checkpointList={dataTrip.checkpoint} />
				{:else}
					<Go type={'mini'} {index} checkpointList={dataTrip.checkpoint} />
				{/if}
				<Checkpoint
					tripID={dataTrip.tripID}
					IDCheckpoint={checkpoint.IDCheckpoint}
					locationName={checkpoint.locationName}
					commentCount={checkpoint.commentCount}
					timeISO={checkpoint.time}
					progress={checkpoint.progress}
					type={checkpoint.type}
					unRead={checkpoint.unRead}
					pass={index > indexPass}
					started={dataTrip.started}
					join={dataTrip.join}
					canSend={dataTrip.join || dataTrip.me}
					canCheckpoint={(dataTrip.join || dataTrip.me) && dataTrip.started}
					me={checkpoint.me}
					tripType={dataTrip.booking}
					bind:editMode
				/>
			{/each}
			{#if !editMode && dataTrip.checkpoint.length > 0}
				<Go
					type={'end'}
					index={dataTrip.checkpoint.length - 1}
					checkpointList={dataTrip.checkpoint}
				/>
			{/if}
		{:else}
			<span>No checkpoints available</span>
		{/if}
		{#if editMode && dataTrip.booking != 'BE'}
			<div class="flex flex-col items-center text-xl">
				<div class={`text-accent2-500 text-3xl flex items-center justify-center`}>
					<Icon icon={'basil:arrow-down-solid'} />
				</div>
				<button
					on:click={() => {
						showEditPopup = true;
					}}
					class="border rounded-full shadow-lg p-2 bg-white"
				>
					<Icon icon="charm:plus" class="text-4xl text-black" />
				</button>
				<CheckpointEdit
					bind:showEditPopup
					tripID={dataTrip.tripID}
					checkPointID={''}
					locationName={''}
					typeCK={'D'}
					timeISOString={new Date(
						dataTrip.checkpoint.length > 0 &&
						dataTrip.checkpoint[dataTrip.checkpoint.length - 1]?.time
							? new Date(dataTrip.checkpoint[dataTrip.checkpoint.length - 1].time).getTime() +
								1 * 60 * 60 * 1000
							: new Date().getTime() // Fallback to the current date's timestamp
					).toISOString()}
					newCK={true}
				/>
			</div>
		{/if}
	</div>
	{#if !editMode}
		<div class="flex justify-end w-full">
			<button
				class="mt-[-80px] flex flex-col justify-center items-center bg-accent2 text-white rounded-lg p-2 focus:outline-none"
			>
				<MapCicleIcon />
				<span class="mt-1">AllMap</span>
			</button>
		</div>
	{/if}
</div>

<TripFooter bind:editMode />
