<script lang="ts">
import {
    tripData
} from "$lib/store/store";
import {
    onDestroy
} from "svelte";
import EditTripBtn from "./EditTripBtn.svelte";
import Icon from "@iconify/svelte";
import {
    formatDate
} from "$lib/utilsFn/Date";
import ButtonMine from "../ButtonMine.svelte";

export let editMode: boolean
let dataTrip: tripPageData;
let originalName: string;
let originalDetail: string;
let originalPreparation: string;

let editedName: string;
let editedDetail: string;
let editedPreparation: string;

let isEdit = false
// let isEditingName = false;
// let isEditingDetail = false;
// let isEditingPreparation = false;
// let indexPass = -1;
let canEdit = false
const unsubscribe = tripData.subscribe(value => {
    dataTrip = value;
    if(value){
        canEdit = Boolean(value.me || value.ownOrgTrip)
        originalName = value.name;
        originalDetail = value.detail;
        originalPreparation = value.preparation;
        editedName = value.name;
        editedDetail = value.detail;
        editedPreparation = value.preparation;
    }

    console.log(dataTrip);
});

function isEdited(original: string, edited: string): boolean {
    if(!isEdit){
        isEdit =  original !== edited
    }
    return original !== edited;
}

// Function to handle save and reset original values
async function saveChanges() {
    
    console.log(isEdit)
    if (isEdit) {
        const response = await fetch('/api/manageTripSetting/manageTrip/saveTrip', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                tripID: dataTrip.tripID,
                tripName: editedName, //edit
                detail: editedDetail, //edit
                booking: dataTrip.booking,
                preparation: editedPreparation, //edit   
                maxJoiner: dataTrip.maxJoiner,
                tripPrivate: dataTrip.private
            }),
        });
        const newComment = (await response.json()) as chat;
        tripData.update(data => {
            
            return {
                ...data,
                name: editedName,
                detail: editedDetail,
                preparation: editedPreparation
            };
        })
        
    }
    // editMode = false
}

function cancelEdit() {
    editMode = false
    editedName = originalName;
    editedDetail = originalDetail;
    editedPreparation = originalPreparation;
}

onDestroy(() => {
    unsubscribe();
});
</script>

<div class="w-full flex justify-end">

</div>
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

<div class="mb-4">
    {#if editMode&&dataTrip}
    <span class="text-lg"> ชื่อทริป </span>
    <input
        type="text"
        bind:value={editedName}
        class="border rounded w-full px-2 py-1 mb-2 text-xl font-bold focus:outline-none"
        class:border-warning-500={isEdited(originalName, editedName)}
        />
    {:else}
    {#if dataTrip}
        <h2 class="font-bold text-xl mb-1" >{dataTrip.name}</h2>
    {/if}
    {/if}
</div>

<!-- Detail Section -->
<div class="mb-4">
    {#if editMode}
    <span class="text-lg"> คำอธิบาย </span>
    <textarea
        bind:value={editedDetail}
        class="border rounded w-full px-2 py-1 text-black focus:outline-none"
        class:border-warning-500={isEdited(originalDetail, editedDetail)}
        ></textarea>
    {:else}
    {#if dataTrip}
        <p class="text-black mb-4 pl-2">{dataTrip.detail}</p>
    {/if}
    {/if}
</div>

<!-- Preparation Section -->
<div class="mb-4">
    {#if editMode}
    <span class="text-lg"> สิ่งที่ต้องเตียมตัว </span>
    <textarea
        bind:value={editedPreparation}
        class="border rounded w-full px-2 py-1 text-sm focus:outline-none"
        class:border-warning-500={isEdited(originalPreparation, editedPreparation)}
        ></textarea>
    {:else}
    <h3 class="font-bold text-sm mb-2" >สิ่งที่ต้องเตรียม</h3>
    {#if dataTrip}
        <p class="text-sm text-black mb-4" >{dataTrip.preparation}</p>
    {/if}
    {/if}
</div>

<!-- Save and Cancel Buttons -->
<div class="my-4 flex gap-4 justify-center">
    {#if editMode}
    <button on:click = {cancelEdit}>
        <ButtonMine background={"bg-warning"}>
            ยกเลิก
        </ButtonMine>
    </button>
    <button on:click={saveChanges}>
        <ButtonMine>
            บันทึก
        </ButtonMine>
    </button>
    {/if}
</div>

<!-- Date -->
<div class="flex justify-center text-sm text-black">
    <div class="flex items-center">
        <Icon icon="mingcute:time-line" class="text-2xl text-black mr-2" />
        <span>{formatDate(dataTrip?.startDate)}</span>
    </div>
</div>
