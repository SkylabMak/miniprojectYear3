<script lang="ts">
	import { goto } from '$app/navigation';
	import { setActiveNavbarItem, tripData } from '$lib/store/store';
	import { formatDate } from '$lib/utilsFn/Date';
	import { getTripData } from '$lib/utilsFn/getTripData';
	import Icon from '@iconify/svelte';
	import Loading from '../Loading.svelte';

	export let tripID: string;
	export let tripTitle: string;
	export let tripSubtitle: string;
	export let tripDate: string;
	export let destCount: number;
	export let tripPeopleCount: number;
	export let tripPeopleMax: number;
	export let imageUrl: string =
		'https://di-uploads-pod5.dealerinspire.com/millsmotorsbuickgmc/uploads/2016/08/road-trip-1500x750.jpg'; // Placeholder for the image URL
	export let organization: string = 'โดย กรมท่องเที่ยวชว.'; // Default organization
	export let verified: boolean = true; // Default to verified
	let isLoading = false;
	async function handleClick() {
		isLoading = true;
		// alert('Card clicked!');
		const tripDataFromCard: tripPageData = await getTripData(tripID);
		tripData.set(tripDataFromCard);
		goto('/trip/' + tripID);
		// setActiveNavbarItem()
		// console.log(tripDataFromCard.tripID)
		isLoading = false;
	}
</script>

<button
	type="button"
	class="w-full bg-secondary4 p-4 rounded-lg shadow-lg cursor-pointer text-left"
	on:click={handleClick}
>
	<!-- Image Section -->
	<div class="image-placeholder bg-secondary2 w-full h-16 rounded-lg mb-2">
		{#if imageUrl}
			<img src={imageUrl} alt={tripTitle} class="w-full h-full rounded-lg object-cover" />
		{:else}
			<!-- Placeholder for missing image -->
			<div class="text-center pt-6">No Image</div>
		{/if}
	</div>

	<!-- Organization and Verification -->
	<div class="flex justify-end items-center text-sm mb-2">
		<span class="pr-2">{organization}</span>
		{#if verified}
			<Icon icon="icon-park-outline:check-one" class="text-2xl text-green" />
		{/if}
	</div>

	<!-- Title and Subtitle -->
	<h2 class="font-bold text-xl mb-1">{tripTitle}</h2>
	<p class="indent-8 text-sm text-gray-700 mb-3">{tripSubtitle}</p>

	<!-- Trip Info: Date and People Count -->
	<div class="flex justify-between text-sm text-gray-700">
		<div class="flex flex-wrap">
			<div class="flex items-center mr-2">
				<Icon icon="mingcute:time-line" class="text-2xl text-black" />
				<span class="ml-1">{formatDate(tripDate)}</span>
			</div>
			<div class="flex items-center mr-2">
				<Icon icon="solar:point-on-map-linear" class="text-2xl text-black" />
				<span class="ml-1">{destCount}</span>
			</div>
			<div class="flex items-center">
				<Icon icon="clarity:group-solid" class="text-2xl text-black" />
				<span>{tripPeopleCount}/{tripPeopleMax}</span>
			</div>
		</div>

		<div class="ml-1">
			<Icon icon="ic:round-save-alt" class="text-2xl text-black" />
		</div>
	</div>
</button>

<Loading {isLoading} />
