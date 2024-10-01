<script lang="ts">
import OrgChat from "$lib/components/org/OrgChat.svelte";
import Popup from "$lib/components/Popup.svelte";
import Icon from "@iconify/svelte";
import {
    goto
} from '$app/navigation';
import {
    onMount
} from "svelte";
import NotYetLogin from "$lib/components/NotYetLogin.svelte";
import CreateTripPopup from "$lib/components/trip/CreateTripPopup.svelte";
import ImageInput from "$lib/components/ImageInput.svelte";
import ButtonMine from "$lib/components/ButtonMine.svelte";

export let data: {
    userToken: string
    data: profile;
    orgChat: orgChat[];
};

// console.log('Data passed to the page:', data.userToken);
let isImageError = false;
let originalName = "";
let originIMG = ""
let isModified = false;
if (data.userToken) {
    originalName = data.data.name
    originIMG = data.data.imgURL
}
$: isModified = data.data && (data.data.name !== originalName || data.data.imgURL !== originIMG);

// $: console.log(isModified, data.data.name )
async function changeName() {
    const response = await fetch('/api/account/edit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: data.data.name,
            org: data.data.Org,
            imgURL: data.data.imgURL,
            remove: false

        }),
    });
    if (!response.ok) {
        const errorMessage = await response.text();
        alert(`Error: ${errorMessage}`);
    } else {
        const result = await response.json(); // Assuming the API sends a JSON response
        console.log('Name changed successfully:', result);
    }
    isModified = false
}

let showPopup = false;
let inputIMGOpen = false

function openPopup() {
    showPopup = true;
}

function reset() {
    data.data.name = originalName
    data.data.imgURL = originIMG
    isImageError = false
}
</script>

{#if data.userToken}
<!-- Parent Container for Flex Column Layout -->
<div class="max-h-screen flex flex-col items-center gap-8">

    <!-- Profile Icon or Image -->
    <div class="flex items-center ">
        <div class="flex flex-col items-center">
            <button class="w-28 h-28 rounded-full flex items-center justify-center border-2 border-black mb-8" on:click={() => inputIMGOpen = true}>
                {#if !isImageError && data.data.imgURL && data.data.imgURL !== ""}
                    <img
                        src={data.data.imgURL}
                        alt={data.data.name}
                        class="w-full h-full rounded-full object-cover"
                        on:error={() => { isImageError = true }}
                    />
                {:else}
                    <span>click me to add image</span>
                {/if}
            </button>
            

            <!-- User's Name Input -->
            <div class="flex items-center min-w-3/4">
                <span class="w-fit whitespace-nowrap">ชื่อ :</span>
                <input
                    type="text"
                    bind:value={data.data.name}
                    class="border rounded px-4 py-1 text-black w-9/12 mx-4 grow-0"
                    />

            </div>
        </div>
        {#if isModified}
        <div class="flex flex-col gap-2 h-full whitespace-nowrap flex-none">
            <button on:click={reset}>
                <ButtonMine>
                    <Icon icon="radix-icons:cross-2" />
                </ButtonMine>
            </button>
            <button on:click={changeName}>
                <ButtonMine>
                    <Icon icon="ic:sharp-save-alt" />
                </ButtonMine>
            </button>
        </div>
        {/if}
    </div>

    {#if data.data.Org && data.orgChat}
    <div>
        <span>แชทลูกค้า : </span>
        <button class="bg-accent2 text-white px-4 py-2 rounded-lg" on:click={openPopup}>
            ยังไม่อ่าน {data.orgChat.filter(chat => chat.readed === false).length} จาก {data.orgChat.length}
        </button>
    </div>
    {/if}
    <!-- Confirm Organization Button -->
    <button disabled={data.data.Org} class={`${(data.data.Org)?"bg-gray-500	":"bg-accent1"}  text-white px-4 py-2 rounded-lg`}>{(data.data.Org)?"ยืนยันเป็นองค์กรเป็นองค์กรแล้ว":"ยืนยันเป็นองค์กร"}</button>

    <!-- Delete Account Button -->
    <button class="fixed bg-accent1 bottom-32 right-4 text-white px-4 py-2 rounded-lg">logout</button>

    <CreateTripPopup orgUser={data.data.Org}/>
        <ImageInput bind:inputIMGOpen={inputIMGOpen} bind:inputText={data.data.imgURL} originText={originIMG} bind:isImageError = {isImageError}/>
            <Popup bind:isOpen={showPopup}>
                {#if data.orgChat}
                {#each data.orgChat as message}
                <!-- {console.log("date ",message.startTime)} -->
                <OrgChat message={message}></OrgChat>
                {/each}
                {/if}
            </Popup>
            </div>
            {:else}
            <NotYetLogin/>
                {/if}
