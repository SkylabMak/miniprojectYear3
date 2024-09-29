<script lang="ts">
import {
    formatDate,
    formatTime
} from "$lib/utilsFn/Date";
import Icon from "@iconify/svelte";
import Popup from "../Popup.svelte";
import CommentsComponent from "./CommentsComponent.svelte";
import CheckpointDetail from "./CheckpointDetail.svelte";

export let tripID: string;
export let IDCheckpoint: string;
export let locationName: string;
export let commentCount: number;
export let timeISO: string;
export let progress: progress[];
export let type: string;
export let unRead: number;
export let pass: boolean;
export let started: boolean;
export let join: boolean;
export let canSend: boolean;
export let canCheckpoint: boolean;
export let orderC: number;
export let me: boolean;

let showCommentPopup = false;
let showDetailPopup = false;

const iconType = new Map < string,
    string > ([
        ['D', "solar:point-on-map-linear"],
        ['G', "clarity:group-solid"],
        ['A', "mingcute:target-line"]
    ]);

// $:if(showDetailPopup == true){
//     showCommentPopup
// }
</script>

<div class={`w-full px-4 py-2 ${pass?"bg-white shadow-md":""}  rounded-lg  flex flex-col items-center justify-between`}>
    <!-- Location Icon -->
    <div class="w-full flex items-center justify-between space-x-2">
        <button class="w-full flex items-center justify-between space-x-2" on:click={()=>{showDetailPopup = true }}>
            <div class="flex items-center">
                <Icon icon={iconType.get(type) ?? ""} class="text-2xl text-black mr-2" />
            </div>

            <!-- Location Name with Background -->
            <div class="flex-1 bg-blue-200 p-2 rounded-lg flex justify-between items-center">
                <span>{locationName}</span>
                {#if started && (canCheckpoint)}
                <Icon icon="icon-park-outline:check-one" class={`text-2xl ${pass?"text-black":"text-emerald-600"}`} />
                {/if}
            </div>
        </button>
        <!-- Comment -->
        <div class="relative flex items-center space-x-1">
            <button on:click={() => { showCommentPopup = true}}>
                <Icon icon="ant-design:comment-outlined" class="text-2xl text-black" />
            </button>
            <span>{commentCount}</span>
            <CommentsComponent
                tripID={tripID}
                iDcheckpoint={IDCheckpoint}
                bind:showCommentPopup={showCommentPopup}
                canSend={canSend}
                />
                <!-- Unread Badge -->
                {#if unRead > 0 && join}
                <span class="absolute top-[-8px] right-[5px] bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {unRead}
                </span>
                {/if}
                </div>
                </div>
                <button class="w-full flex items-center justify-between space-x-1 mt-2" on:click={()=>{showDetailPopup = true }}>
                    <!-- Progress and Time -->
                    <div class="flex items-start">
                        {#if progress.length > 0}
                        {#each progress as img}
                        <div class="w-4 h-4 rounded-full border-black border-2 shadow-sm mr-[-8px]">
                            <img src={img.imgURL} alt={IDCheckpoint} class="w-full h-full rounded-lg object-cover" />
                        </div>
                        {/each}
                        {/if}
                        {#if me}
                        <div class="bg-emerald-500 border-black border-2 rounded-full w-4 h-4"></div>
                        {/if}
                    </div>

                    <!-- Time and Date -->
                    <div class="flex items-center justify-end mt-2 text-sm text-gray-700">
                        <div class="flex items-center mr-2">
                            <Icon icon="mingcute:time-line" class="text-xl text-black mr-1" />
                            <span>{formatTime(timeISO)}</span>
                        </div>

                        <div class="flex items-center">
                            <Icon icon="ic:baseline-calendar-today" class="text-xl text-black mr-1" />
                            <span>{formatDate(timeISO)}</span>
                        </div>
                    </div>
                </button>
                </div>

                {#if !showCommentPopup && showDetailPopup}
                <CheckpointDetail bind:showDetailPopup={showDetailPopup}
                    checkPointID={IDCheckpoint}
                    typeCK={type}
                    orderC={orderC}
                    canCheckpoint={canCheckpoint}
                    tripID={tripID}
                    />
                    {/if}
