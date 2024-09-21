<script lang="ts">
    import IconContainer from "$lib/components/IconContainer.svelte";
    import MapCicleIcon from "$lib/components/MapCicleIcon.svelte";
    import Checkpoint from "$lib/components/trip/checkpoint.svelte";
    import Go from "$lib/components/trip/Go.svelte";
    import { tripData } from "$lib/store/store";
    import Icon from "@iconify/svelte";
    import { onDestroy } from "svelte";
    
    let dataTrip: tripPageData;
    let indexPass = -1;
    const unsubscribe = tripData.subscribe(value => {
        dataTrip = value;
        if (value) {
            indexPass = value.checkpoint.findIndex(e => e.me === true);
        }
        console.log(dataTrip);
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
    <!-- Image Section -->
    <div class="image-placeholder bg-gray-300 w-full h-32 rounded-lg mb-4">
        {#if dataTrip}
            {#if dataTrip.imageURL}
                <img src={dataTrip.imageURL} alt={dataTrip.tripID} class="w-full h-full rounded-lg object-cover" />
            {:else}
                <div class="text-center pt-6">Image goes here</div>
            {/if}
        {/if}
    </div>

    <!-- Title and Description -->
    <h2 class="font-bold text-xl mb-1">{dataTrip?.name}</h2>
    <p class="text-black mb-4">{dataTrip?.detail}</p>

    <!-- Preparation Section -->
    <h3 class="font-bold text-sm mb-2">สิ่งที่ต้องเตรียม</h3>
    <p class="text-sm text-black mb-4">{dataTrip?.preparation}</p>

    <!-- Date -->
    <div class="flex justify-center text-sm text-black">
        <div class="flex items-center">
            <Icon icon="mingcute:time-line" class="text-2xl text-black mr-2" />
            <span>{formatDate(dataTrip?.startDate)}</span>
        </div>
    </div>

    <!-- Checkpoints Section -->
    <div class="flex justify-center flex-col text-sm text-black my-4">
        {#if dataTrip && dataTrip.checkpoint && Array.isArray(dataTrip.checkpoint)}
            {#each dataTrip.checkpoint as checkpoint, index}
                {#if index === 0}
                    <Go type={"start"} />
                {:else if checkpoint.type === "D"}
                    <Go type={"large"} />
                {:else}
                    <Go type={"mini"} />
                {/if}
                <Checkpoint
                    IDCheckpoint={checkpoint.IDCheckpoint}
                    locationName={checkpoint.locationName}
                    commentCount={checkpoint.commentCount}
                    timeISO={checkpoint.time}
                    progress={checkpoint.progress}
                    type={checkpoint.type}
                    unRead={checkpoint.unRead}
                    pass={index > indexPass}
                    started={dataTrip.started}
                />
            {/each}
            <Go type={"end"} />
        {:else}
            <span>No checkpoints available</span>
        {/if}
    </div>
</div>

<div class="flex items-center justify-center flex-wrap">
    <!-- First Button with Text and Icon -->
    <button class="m-1 flex items-center bg-accent2 text-white rounded-lg p-2 focus:outline-none">
        <span class="mr-2">รับเส้นทางทั้งหมด</span>
        <MapCicleIcon />
    </button>

    <div>
        <!-- Icon Buttons -->
        <button class={`m-1 focus:outline-none ${(dataTrip.booking === "BE" || dataTrip.booking === "BI") ? "hidden" : ""}`} disabled={Boolean(dataTrip.me || dataTrip.join)}>
            <IconContainer iconName="material-symbols:group-add-outline" yes={Boolean(dataTrip.me || dataTrip.join)} />
        </button>

        <button class="m-1 focus:outline-none" disabled={Boolean(dataTrip.me)}>
            <IconContainer iconName="ic:round-save-alt" yes={Boolean(dataTrip.me)} />
        </button>

        <button class="m-1 focus:outline-none" disabled={Boolean(dataTrip.started)}>
            <IconContainer iconName="carbon:location-current" yes={Boolean(dataTrip.started)} />
        </button>
    </div>

    <p class={`${(dataTrip.org || (dataTrip.booking === "BE" && dataTrip.me)) ? "" : "hidden"}`}>
        <button class="m-1 focus:outline-none" disabled={Boolean(dataTrip.me)}>
            <IconContainer iconName="medical-icon:i-registration" yes={Boolean(dataTrip.me)} />
        </button>

        <button class="m-1 focus:outline-none relative" disabled={Boolean(dataTrip.me)}>
            <IconContainer iconName="ant-design:comment-outlined" yes={Boolean(dataTrip.me)} />
            {#if dataTrip.unread}
                <span class="absolute top-[-8px] right-[-8px] bg-red-500 text-white text-xs rounded-full p-1 flex items-center justify-center">
                    un read
                </span>
            {/if}
        </button>
    </p>
</div>
