<script lang="ts">
import {
    checkpointTypeText
} from "$lib/res/word";
import {
    tripData
} from "$lib/store/store";
import Popup from "../Popup.svelte";

export let tripID: string
export let checkPointID: string
export let showDetailPopup: boolean;
export let typeCK: string
export let orderC: number
export let canCheckpoint: boolean
let isLoading: boolean = true;
let checkpointDetail = ""

async function fetchMessages(): Promise < string > {
    const response = await fetch('/api/getTrip/checkpoint', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            checkpointID: checkPointID,
        }),
    });

    if (!response.ok) {
        console.log("checkpoint error at ", checkPointID);
        throw new Error('Failed to fetch messages');
    }

    const data: string = (await response.json()).detail;
    return data;
}

$: if (showDetailPopup) {
    fetchMessages().then(fetchedMessages => {
        checkpointDetail = fetchedMessages;
        isLoading = false;
    }).catch(error => {
        isLoading = false;
        console.error('Error fetching messages:', error);
    });
}

async function checkPoint() {
    const response = await fetch('/api/manageTripSetting/progression/save', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            tripID: tripID,
            checkpointID: checkPointID,
        }),
    });

    if (!response.ok) {
        console.log("checkpoint error at ", checkPointID);
        throw new Error('Failed to fetch messages');
    }

    tripData.update(data => {
        const updatedCheckpoints = data.checkpoint.map((cp) => {
            if (cp.orderC == orderC) {
                cp.me = true
            } else {
                cp.me = false
            }
            return cp;
        });
        return {
            ...data,
            checkpoint: updatedCheckpoints, // Set the modified checkpoints back
        };
    })
    showDetailPopup = false
    console.log("check point clicked");
}
</script>

<Popup bind:isOpen={showDetailPopup} hideCloseBtn={true} background={"secondary4"}>
    <div class="bg-blue-100 p-4 rounded-lg w-64 shadow-md">
        <h2 class="font-bold text-gray-800 mb-2">{checkpointTypeText.get(typeCK) }</h2>
        <hr class="border-gray-300 mb-2">

        <span>
            {checkpointDetail}
        </span>

        <div class="flex gap-4 justify-center mt-4">
            <button
                class="bg-accent2 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                on:click={()=>{showDetailPopup = false}}
                >
                ปิด
            </button>

            {#if canCheckpoint}
            <button
                class="bg-accent2 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                on:click={checkPoint}>
                check point
            </button>
            {/if}

        </div>
    </div>
</Popup>
