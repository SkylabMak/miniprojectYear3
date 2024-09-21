<script lang="ts">
import {
    formatDate,

	formatTime

} from "$lib/utilsFn/Date";
import Icon from "@iconify/svelte";

export let IDCheckpoint: string;
export let locationName: string;
export let commentCount: number;
export let timeISO: string;
export let progress: progress[];
export let type: string;
export let unRead: number;
export let pass: boolean;
export let started :boolean;

const iconType = new Map<string, string>([
    ['D', "solar:point-on-map-linear"],
    ['G', "clarity:group-solid"],
    ['A', "mingcute:target-line"]
]);

</script>

<div class={`w-full px-4 py-2 ${pass?"bg-white shadow-md":""}  rounded-lg  flex flex-col items-center justify-between`}>
    <!-- Location Icon -->
     <div class="w-full flex items-center justify-between space-x-2">
        <div class="flex items-center">
            <Icon icon={iconType.get(type)??""} class="text-2xl text-black mr-2" />
        </div>
    
        <!-- Location Name with Background -->
        <div class="flex-1 bg-blue-200 p-2 rounded-lg flex justify-between items-center">
            <span>{locationName}</span>
            {#if started}
            <Icon icon="icon-park-outline:check-one" class={`text-2xl ${pass?"text-black":"text-emerald-600"}`} />
            {/if}
        </div>
    
        <!-- Comment Count -->
        <div class="relative flex items-center space-x-1">
            <Icon icon="ant-design:comment-outlined" class="text-2xl text-black" />
            <span>{commentCount}</span>

            <!-- Unread Badge -->
            {#if unRead > 0}
                <span class="absolute top-[-8px] right-[5px] bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {unRead}
                </span>
            {/if}
        </div>
     </div>
    
    <div class="w-full flex items-center justify-between space-x-1 mt-2">
        <div class="flex items-start">
            {#if progress.length>0}
            {#each progress as img}
                <div class="w-4 h-4 rounded-full border-black border-2 shadow-sm mr-[-8px]" >
                    <img src={img.imgURL} alt={IDCheckpoint} class="w-full h-full rounded-lg object-cover" />
                </div>
            {/each}
            {/if}
            {#if !pass}
                <div class="bg-emerald-500 border-black border-2 rounded-full w-4 h-4"></div>
            {/if}
        </div>
        <!-- Time and Date -->
        <div class="flex items-center justify-end mt-2 text-sm text-gray-700">
            <!-- Time -->
            <div class="flex items-center mr-2">
                <Icon icon="mingcute:time-line" class="text-xl text-black mr-1" />
                <span>{formatTime(timeISO)}</span>
            </div>
    
            <!-- Date -->
            <div class="flex items-center">
                <Icon icon="ic:baseline-calendar-today" class="text-xl text-black mr-1" />
                <span>{formatDate(timeISO)}</span>
            </div>
        </div>
    </div>
</div>


