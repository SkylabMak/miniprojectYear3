<script lang="ts">
    import IconContainer from "$lib/components/IconContainer.svelte";
    import MapCicleIcon from "$lib/components/MapCicleIcon.svelte";
	import ChatComponent from "$lib/components/org/ChatComponent.svelte";
	import ChatComments from "$lib/components/org/ChatComponent.svelte";
	import BookBtn from "$lib/components/trip/button/BookBtn.svelte";
	import ChatBtn from "$lib/components/trip/button/ChatBtn.svelte";
	import CopyBtn from "$lib/components/trip/button/CopyBtn.svelte";
	import GoBtn from "$lib/components/trip/button/GoBtn.svelte";
	import JoinBtn from "$lib/components/trip/button/JoinBtn.svelte";
	import Checkpoint from "$lib/components/trip/Checkpoint.svelte";
    import Go from "$lib/components/trip/Go.svelte";
    import { tripData } from "$lib/store/store";
    import Icon from "@iconify/svelte";
    import { onDestroy } from "svelte";

    let showChatPopup = false
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
                    join={Boolean(dataTrip.join)}
                    canSend={Boolean(dataTrip.join) || Boolean(dataTrip.me)}
                    canCheckpoint={(Boolean(dataTrip.join) || Boolean(dataTrip.me))&&Boolean(dataTrip.started)}
                    orderC={checkpoint.orderC}
                    me={checkpoint.me}
                />
            {/each}
            <Go type={"end"} />
        {:else}
            <span>No checkpoints available</span>
        {/if}
    </div>
    <div class="flex justify-end w-full">
        <button class="mt-[-80px] flex flex-col justify-center items-center bg-accent2 text-white rounded-lg p-2 focus:outline-none">
            <MapCicleIcon />
            <span class="mt-1">AllMap</span>
        </button>
    </div>

</div>

{#if dataTrip}
<div class="flex items-center justify-center flex-wrap">
    <div>
        <!-- Icon Buttons -->
        <JoinBtn hasToken={dataTrip.hasToken} joined={Boolean(dataTrip.join)} visbleBtn={dataTrip.booking !== "NM" || Boolean(dataTrip.me) } 
        can={Boolean(dataTrip.me)} tripID={dataTrip.tripID}/>
        <CopyBtn hasToken={dataTrip.hasToken} can={Boolean(dataTrip.me)} tripID={dataTrip.tripID}/>
        <GoBtn tripID={dataTrip.tripID} status={dataTrip.started} can={Boolean(dataTrip.me)}/>

    </div>
    <!-- {#if ((dataTrip.org || (dataTrip.booking === "BE" && dataTrip.me)))} -->
    {#if (dataTrip.booking !== "NM")}
    <div class={`border-l h-12 mx-4 border-black `}></div>
        <BookBtn tripOriginID={dataTrip.tripIDOrigin} tripID={dataTrip.tripID} hasToken={dataTrip.hasToken} can={Boolean(dataTrip.me||dataTrip.ownOrgTrip)}/>
        <ChatBtn can={Boolean(dataTrip.me)} tripID={dataTrip.tripID} hasToken={dataTrip.hasToken} unRead={Boolean(dataTrip.unread)}/>
    {/if}
    
</div>
{/if}

