<script lang="ts">
	import NotYetLogin from '$lib/components/NotYetLogin.svelte';
	import TripCard from '$lib/components/trip/TripCard.svelte';

	export let data: {
		data: tripCard[];
	};

	// console.log('Data passed to the page:', data);
</script>

<!-- Parent Container for Flex Column Layout -->
<div class="min-h-screen flex flex-col items-center p-4">
	{#if data && data.data && data.data.length > 0}
		<ul class="flex flex-col items-center gap-4 w-full">
			{#each data.data as trip}
				<TripCard
					imageUrl={trip.imageURL}
					tripID={trip.tripID}
					tripTitle={trip.name}
					tripSubtitle={trip.detail}
					tripDate={trip.startDate}
					verified={trip.org}
					organization={trip.by}
					tripPeopleCount={trip.people}
					tripPeopleMax={trip.peopleMax}
					destCount={trip.count}
				/>
			{/each}
		</ul>
	{:else}
		<NotYetLogin />
	{/if}
</div>
