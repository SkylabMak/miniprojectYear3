<script lang="ts">
    import TripCard from "$lib/components/TripCard.svelte";
  
    export let data: {
      data: tripCard[];
    };
  
    // console.log('Data passed to the page:', data);
  </script>
  
  <!-- Parent Container for Flex Column Layout -->
  <div class="min-h-screen flex flex-col  items-center p-4">
    {#if data && data.data && data.data.length > 0}
      <ul class="flex flex-col items-center gap-4 w-full">
        {#each data.data as trip}    
            <TripCard
              imageUrl={trip.imageURL}
              tripID={trip.tripID}
              tripTitle={trip.name}
              tripSubtitle={trip.detail}
              tripDate={trip.startDate}
              tripPeopleCount={trip.count}
              verified={trip.org}
              organization={trip.by}
            />
        {/each}
      </ul>
    {:else}
      <p>No data found.</p>
    {/if}
  </div>
  