<script lang="ts">
	import { goto } from "$app/navigation";
	import { setActiveNavbarItem, tripData } from "$lib/store/store";
	import { getTripData } from "$lib/utilsFn/getTripData";
import Icon from "@iconify/svelte";

export let tripID : string;
export let tripTitle: string;
export let tripSubtitle: string;
export let tripDate: string;
export let tripPeopleCount: number;
export let imageUrl: string = 'https://di-uploads-pod5.dealerinspire.com/millsmotorsbuickgmc/uploads/2016/08/road-trip-1500x750.jpg'; // Placeholder for the image URL
export let organization: string = 'โดย กรมท่องเที่ยวชว.'; // Default organization
export let verified: boolean = true; // Default to verified
async function handleClick() {
    // alert('Card clicked!');
    const tripDataFromCard: tripPageData = await getTripData(tripID);
    tripData.set(tripDataFromCard);
    goto("/trip")
    // setActiveNavbarItem()
    // console.log(tripDataFromCard.tripID)
}
</script>

<button type="button" class="w-4/5 bg-secondary4 p-4 rounded-lg shadow-lg cursor-pointer text-left" on:click={handleClick}>
    <!-- Image Section -->
    <div class="image-placeholder bg-secondary2 w-full h-16 rounded-lg mb-2">
        {#if imageUrl}
        <img src={imageUrl} alt={tripTitle} class="w-full h-full rounded-lg object-cover" />
        {:else}
        <!-- Placeholder for missing image -->
        <div class="text-center pt-6">Image goes here</div>
        {/if}
    </div>
    
    <!-- Organization and Verification -->
    <div class="flex justify-end items-center text-sm mb-2">
        <span class="pr-2">{organization}</span>
        {#if verified}
        <Icon icon="icon-park-outline:check-one" class="text-2xl text-green-500" />
        {/if}
    </div>

    <!-- Title and Subtitle -->
    <h2 class="font-bold text-xl mb-1">{tripTitle}</h2>
    <p class="indent-8 text-sm text-gray-700 mb-3">{tripSubtitle}</p>

    <!-- Trip Info: Date and People Count -->
    <div class="flex justify-between text-sm text-gray-700">
        <div class="flex">
            <div class="flex items-center mr-2">
                <Icon icon="mingcute:time-line" class="text-2xl text-black" />
                <span class="ml-2">{new Date(tripDate).getDate()}/{new Date(tripDate).getMonth() + 1}/{new Date(tripDate).getFullYear()}</span>
            </div>
            <div class="flex items-center">
                <Icon icon="solar:point-on-map-linear" class="text-2xl text-black" />
                <span>{tripPeopleCount}</span>
            </div>
        </div>

        <div>
            <Icon icon="ic:round-save-alt" class="text-2xl text-black" />
        </div>
    </div>
</button>