<script lang="ts">
	import ButtonMine from '$lib/components/ButtonMine.svelte';
	import IconContainer from '$lib/components/IconContainer.svelte';
	import Popup from '$lib/components/Popup.svelte';
	import { tripData } from '$lib/store/store';
	// export let visbleBtn: boolean = true;
	export let can: boolean;
	export let tripID: string;
	export let status: boolean;
	let goPopupShow = false;
	async function startAction() {
		const response = await fetch('/api/manageTripSetting/beginTrip/start', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				tripID: tripID,
				start: !status
			})
		});

		if (!response.ok) {
			console.log('join error ');
			throw new Error('Failed to fetch messages');
		}

		tripData.update((data) => {
			return {
				...data,
				started: !status
			};
		});
		goPopupShow = false;
	}
	console.log('can  go ? ', can);
</script>

<button
	class="m-1 focus:outline-none"
	disabled={!can}
	on:click={() => {
		goPopupShow = true;
	}}
>
	<IconContainer iconName="carbon:location-current" yes={status} />
</button>

<Popup bind:isOpen={goPopupShow} hideCloseBtn={true}>
	<div class="flex gap-2">
		<h2>คุณต้องการ</h2>
		<h2 class="font-bold italic">{`${status ? 'ปิดทริป' : 'เริ่มทริป'}`}</h2>
		<h2>หรือไม่</h2>
	</div>
	<div class="flex items-center gap-4 justify-center mt-4">
		<button
			on:click={() => {
				goPopupShow = false;
			}}
		>
			<ButtonMine>ปิด</ButtonMine>
		</button>

		<button on:click={startAction}>
			<ButtonMine>ใช่</ButtonMine>
		</button>
	</div>
</Popup>
