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

export let data: {
    userToken: string
    data: profile;
    orgChat: orgChat[];
};

// console.log('Data passed to the page:', data.userToken);
let originalName = "";
let isModified = false;
if (data.userToken) {
    originalName = data.data.name
}
$: isModified = data.data && data.data.name !== originalName;

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

function openPopup() {
    showPopup = true;
}
</script>

{#if data.userToken}
<!-- Parent Container for Flex Column Layout -->
<div class="min-h-screen flex flex-col items-center p-4 space-y-4text-xl	">

    <!-- Profile Icon or Image -->
    <div class="flex flex-col items-center ">
        <div class="w-1/4 h-1/4	rounded-full flex items-center justify-center border-2 border-black p-4 mb-8">
            {#if data.data.imgURL}
            <img src={data.data.imgURL} alt={data.data.name} class="w-full h-full rounded-full object-cover" />
            {:else}
            <span class="iconify text-5xl" data-icon="mdi:account-outline"></span>
            {/if}
        </div>

        <!-- User's Name Input -->
        <div class="flex items-center min-w-3/4">
            <span>ชื่อ :</span>
            <input
                type="text"
                bind:value={data.data.name}
                class="border rounded px-4 py-1 text-black w-9/12 mx-4"
                />
            {#if isModified}
            <button on:click={changeName} >
                <Icon icon="ic:sharp-save-alt" />
            </button>
            {/if}
        </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex flex-col items-center space-y-4 mt-4">
        <!-- Confirm Organization Button -->

        <button disabled={data.data.Org} class={`${(data.data.Org)?"bg-gray-500	":"bg-accent1"}  text-white px-4 py-2 rounded-lg`}>{(data.data.Org)?"ยืนยันเป็นองค์กรเป็นองค์กรแล้ว":"ยืนยันเป็นองค์กร"}</button>

        <!-- Create Trip Button -->
        <button class="bg-accent2 text-white px-4 py-2 rounded-lg">สร้าง ทริป</button>

        {#if data.orgChat}
        <div>
            <span>ลูกค้า : </span>
            <button class="bg-accent2 text-white px-4 py-2 rounded-lg" on:click={openPopup}>
                ยังไม่อ่าน {data.orgChat.filter(chat => chat.readed === false).length} จาก {data.orgChat.length}
            </button>
        </div>
        {/if}

        <!-- Delete Account Button -->
        <button class="bg-accent1 text-white px-4 py-2 rounded-lg">ลบบัญชี</button>
    </div>
    <Popup bind:isOpen={showPopup}>
        {#if data.orgChat}
        {#each data.orgChat as message}
        <OrgChat message={message}></OrgChat>
        {/each}
        {/if}
    </Popup>
</div>
{:else}
<NotYetLogin/>
{/if}
