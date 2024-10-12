<script lang="ts">
	import ButtonMine from '$lib/components/ButtonMine.svelte';
	import Popup from '$lib/components/Popup.svelte';

	export let tripID: string;
	export let currentStatus;
	export let showBookPopup: boolean;
	export let custID: string;
	export let cust: boolean;
	export let message: orgChat;

	let confirmPoup = false;
	let cancel = false;
	let done = false;

	async function bookAction() {
		console.log(custID);
		console.log('custID is ', custID);
		done = !(done && cancel);
		const response = await fetch('/api/manageTripSetting/beginTrip/changeBooking', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				tripID: tripID,
				IDAccount: cust ? '' : (custID as string),
				book: done
			})
		});
		if (!response.ok) {
			console.log('join error ');
			throw new Error('Failed to fetch messages');
		}

		if (done) {
			message = {
				...message,
				bookDone: 'D'
			};
		} else {
			message = {
				...message,
				bookDone: ''
			};
		}
		showBookPopup = false;
		cancel = false;
		done = false;
		confirmPoup = false;
	}
</script>

<Popup bind:isOpen={showBookPopup}>
	<div class="flex flex-col items-center">
		<span class="text-xl">เลือกสถานะการจอง</span>
		<div class="flex gap-8 my-10 text-lg">
			{#if cust && currentStatus == 'BE'}
				<span>คุณจองสำเร็จ หากต้องการ ยกเลิกโปรดติดที่พักโดยตรง</span>
			{:else}
				<button
					on:click={() => {
						confirmPoup = true;
						cancel = true;
					}}
				>
					<ButtonMine background={'bg-error'}>ยกเลิก</ButtonMine>
				</button>
			{/if}

			{#if currentStatus != 'BE'}
				<button
					on:click={() => {
						confirmPoup = true;
						done = true;
					}}
				>
					<ButtonMine background={'bg-success'}>สำเร็จ</ButtonMine>
				</button>
			{:else}
				<button
					on:click={() => {
						confirmPoup = true;
						done = true;
						cancel = true;
					}}
				>
					<ButtonMine background={'bg-success'}>ปิดทริป</ButtonMine>
				</button>
			{/if}
		</div>
		<hr class="border-grayfocus mb-2 w-full" />

		<div class="flex flex-col items-start">
			<span>{cust ? '' : 'แจ้งเตือน : ระวังในการยกเลิกทริปที่ส่งผลให้ลูกค้าไม่พอใจ'}</span>
			<div class="my-2"></div>
			<span class="text-xs">หมายเหตุ :</span>
			<span class="text-xs">- ลูกค้าไม่สามารถยกเลิกได้เอง ถ้าจองสำเร็จ</span>
			<span class="text-xs">- ลูกค้าไม่สามารถขอจองได้อีก ถ้ายังไม่ปิดทริป</span>
		</div>
	</div>
</Popup>

<Popup bind:isOpen={confirmPoup} hideCloseBtn={true}>
	<div class="flex gap-2 items-center text-xl mb-8">
		<span>คุณยืนยันที่จะ</span>
		{#if cancel && done}
			<h2 class="font-bold italic text-xl">ปิดทริป</h2>
		{:else if cancel}
			<h2 class="font-bold italic text-xl">ยกเลิก</h2>
		{:else}
			<h2 class="font-bold italic text-xl">จองสำเร็จ</h2>
		{/if}
		<span>หรือไม่</span>
	</div>
	<div class="flex items-center gap-8 justify-center mt-4 text-lg">
		<button
			on:click={() => {
				confirmPoup = false;
				cancel = false;
				done = false;
			}}
		>
			<ButtonMine background={'bg-warning'}>ปิด</ButtonMine>
		</button>
		<button on:click={bookAction}>
			<ButtonMine>ใช่</ButtonMine>
		</button>
	</div>
</Popup>
