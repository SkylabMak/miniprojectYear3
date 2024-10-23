<script lang="ts">
	import TripPage from '$lib/components/trip/TripPage.svelte';
	import { page } from '$app/stores';
	import { tripData } from '$lib/store/store';
	import { onDestroy, onMount } from 'svelte';
	import { getTripData } from '$lib/utilsFn/getTripData';
	onMount(async () => {
		let id = $page.params.id;
		const tripDataFromCard: tripPageData = await getTripData(id);
		tripData.set(tripDataFromCard);
	});
</script>

<TripPage />
