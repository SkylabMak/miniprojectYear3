<script lang="ts">
	import Popup from '$lib/components/Popup.svelte';
	import IconContainer from '$lib/components/IconContainer.svelte';
	import ButtonMine from '$lib/components/ButtonMine.svelte';
	import NotYetLogin from '$lib/components/NotYetLogin.svelte';
	import { sendError } from '$lib/store/ErrorStore';
	// export let visbleBtn: boolean = true;
	export let can: boolean;
	export let tripID: string;
	export let hasToken: boolean;
	let copyPopupShow = false;
	let confirm = false;
	async function copyAction() {
		const response = await fetch('/api/manageTripSetting/beginTrip/saveTrip', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				tripID: tripID
			})
		});

		if (!response.ok) {
			console.log('copy error ');
			const data = (await response.json()) as customError;
			sendError(data.code.toString(), data.message);
			console.log('error data : ', data);
			copyPopupShow = false;
			throw new Error('Failed to fetch messages');
		}
		confirm = true;
	}
</script>

<button
	class="m-1 focus:outline-none"
	disabled={!can}
	on:click={() => {
		copyPopupShow = true;
	}}
>
	<IconContainer iconName="ic:round-save-alt" yes={!can} />
</button>

<Popup bind:isOpen={copyPopupShow} hideCloseBtn={true}>
	{#if hasToken}
		<div class="flex gap-2">
			{#if confirm}
				<div class="flex flex-col">
					<h1>คัดลอกเรียบร้อย</h1>
					<h2>
						คุณสามารถเข้าไปดูใน ที่จัดเก็บของคุณได้ และสามารถเข้ามาคัดลอกอีกครั้ง ในครั้งถัดไป
					</h2>
				</div>
			{:else}
				<div class="flex flex-col items-center">
					<h2>คุณต้องการ</h2>
					<h2 class="font-bold italic">{`คัดลอกเป็นของตัวเองหรือไม่`}</h2>
					<h2>หรือไม่</h2>
				</div>
			{/if}
		</div>
		<div class="flex items-center gap-4 justify-center mt-4">
			<button
				on:click={() => {
					copyPopupShow = false;
				}}
			>
				<ButtonMine>ปิด</ButtonMine>
			</button>
			{#if !confirm}
				<button on:click={copyAction}>
					<ButtonMine>ใช่</ButtonMine>
				</button>
			{/if}
		</div>
	{:else}
		<div class="flex items-center flex-col">
			<NotYetLogin />
			<button
				on:click={() => {
					copyPopupShow = false;
				}}
			>
				<ButtonMine>ปิด</ButtonMine>
			</button>
		</div>
	{/if}
</Popup>
