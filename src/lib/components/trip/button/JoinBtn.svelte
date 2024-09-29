<script lang="ts">
import ButtonMine from "$lib/components/ButtonMine.svelte";
import IconContainer from "$lib/components/IconContainer.svelte";
	import NotYetLogin from "$lib/components/NotYetLogin.svelte";
import Popup from "$lib/components/Popup.svelte";
	import { tripData } from "$lib/store/store";
export let visbleBtn: boolean;
export let can: boolean;
export let joined: boolean;
export let tripID : string
export let hasToken : boolean
let joinPopupShow = false

async function joinAction() {
    const response = await fetch('/api/manageTripSetting/beginTrip/join', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            tripID: tripID,
            join:(joined)?false:true
        }),
    });

    if (!response.ok) {
        console.log("join error ");
        throw new Error('Failed to fetch messages');
    }

    tripData.update(data => {
    joinPopupShow = false
    return {
        ...data, 
        join: !joined
    };

});
}
</script>

<button on:click={()=>{joinPopupShow = true}} class={`m-1 focus:outline-none ${visbleBtn ? "hidden" : ""}`} disabled={can}>
    <IconContainer iconName="material-symbols:group-add-outline" yes={can} />
</button>

<Popup bind:isOpen={joinPopupShow} hideCloseBtn={true}>
    {#if hasToken}
    <div class="flex gap-2">
        
        <h2>คุณต้องการ </h2>
        <h2 class="font-bold italic">{`${(joined)?"ออกการเข้าร่วม":"เข้าร่วม"}`}</h2>
        <h2> หรือไม่</h2>
    </div>
        <div class="flex items-center gap-4 justify-center mt-4">
            <button on:click={()=>{joinPopupShow = false}}>
                <ButtonMine>
                    ปิด
                </ButtonMine>
            </button>
    
            <button on:click={joinAction}>
                <ButtonMine>
                    ใช่
                </ButtonMine>
            </button>
        </div>
        {:else}
        <div class="flex items-center flex-col">
            <NotYetLogin/>
            <button on:click={()=>{joinPopupShow = false}}>
                <ButtonMine>
                    ปิด
                </ButtonMine>
            </button>
        </div>
        
    {/if}
</Popup>
