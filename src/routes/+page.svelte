<script lang="ts">
	import TripCard from '$lib/components/trip/TripCard.svelte';
	import { searchedTrip } from '$lib/store/store';

	let data: tripCard[];
	searchedTrip.subscribe((value) => {
		data = value;
	});
	// console.log('Data passed to the page:', data);
</script>

<!-- Parent Container for Flex Column Layout -->
<div class="min-h-screen flex flex-col items-center p-4">
	{#if data}
		<ul class="flex flex-col items-center gap-4 w-full">
			{#each data as trip}
				<TripCard
					tripID={trip.tripID}
					imageUrl={trip.imageURL}
					tripTitle={trip.name}
					tripSubtitle={trip.detail}
					tripDate={trip.startDate}
					verified={trip.org}
					organization={trip.by}
					tripPeopleCount={trip.people}
					destCount={trip.count}
					tripPeopleMax={trip.peopleMax}
				/>
			{/each}
		</ul>
	{:else}
		<p>Fetching data.</p>
	{/if}
</div>
