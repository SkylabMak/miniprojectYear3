<script lang="ts">
	import IconContainer from "$lib/components/IconContainer.svelte";
	import ChatComponent from "$lib/components/org/ChatComponent.svelte";
    // export let visbleBtn: boolean = true;
    export let can : boolean;
    export let tripID : string;
    export let hasToken : boolean
    export let unRead: boolean
    let showChatPopup = false

</script>
<ChatComponent tripID={tripID} custID={""} bind:showChatPopup={showChatPopup} hasToken={hasToken}/>
        <button class="m-1 focus:outline-none relative" disabled={!can} on:click={()=>{showChatPopup = true}}>
            <IconContainer iconName="ant-design:comment-outlined" yes={false}/>
            {#if unRead}
                <span class="absolute top-[-8px] right-[-8px] bg-red-500 text-white text-xs rounded-full p-1 flex items-center justify-center">
                    un read
                </span>
            {/if}
</button>