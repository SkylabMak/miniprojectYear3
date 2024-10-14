<script lang="ts">
	import { goto } from '$app/navigation';
	import ButtonMine from '$lib/components/ButtonMine.svelte';
	import IconContainer from '$lib/components/IconContainer.svelte';
	import NotYetLogin from '$lib/components/NotYetLogin.svelte';
	import Popup from '$lib/components/Popup.svelte';
	import { tripData } from '$lib/store/store';
	import Go from '../Go.svelte';

	export let can: boolean;
	export let aleardy: boolean;
	export let tripID: string;
	export let hasToken: boolean;
	export let tripOriginID: string;

	let currentStatus = 'NM';
	let showBookPopup = false;
	let isLoading = true;
	let confirmPoup = false;
	let confirm = false;
	let cancel = false;
	let book = false;
	let done = false;
	let count = 1;
	let maxCount = 1;

	async function bookAction() {
		if (count > 0) {
			if (book) {
				const response = await fetch('/api/manageTripSetting/beginTrip/book', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						tripID: tripID,
						count: count,
						book: book
					})
				});
				if (!response.ok) {
					console.log('join error ');
					throw new Error('Failed to fetch messages');
				}
				tripData.update((data) => {
					showBookPopup = false;
					book = false;
					confirmPoup = false;
					return {
						...data,
						join: book,
						count: data.count + count
					};
				});
			} else if (cancel || done) {
				const response = await fetch('/api/manageTripSetting/beginTrip/changeBooking', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						tripID: tripOriginID != null ? tripOriginID : tripID,
						IDAccount: '',
						book: done
					})
				});
				if (!response.ok) {
					console.log('join error ');
					throw new Error('Failed to fetch messages');
				}
				showBookPopup = false;
				cancel = false;
				done = false;
				confirmPoup = false;
				goto('/');
			}
		}
	}

	async function fetchStatus() {
		if (hasToken) {
			// console.log("tripID in book",tripID)
			const response = await fetch('/api/getTrip/getStatusTrip', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					tripID: tripOriginID != null ? tripOriginID : tripID
				})
			});

			if (!response.ok) {
				console.log(await response.json());
				throw new Error('Failed to fetch messages');
			}

			const dataRes = (await response.json()).status as {
				status: string;
				remaining: number;
			};
			// console.log('status', dataRes);
			return dataRes;
		}
	}

	$: if (showBookPopup) {
		fetchStatus()
			.then((fetchedMessages) => {
				currentStatus = fetchedMessages?.status ?? '';
				maxCount = fetchedMessages?.remaining ?? 10;
				isLoading = false;
				// console.log("maxCount",maxCount)
			})
			.catch((error) => {
				isLoading = false;
				console.error('Error fetching messages:', error);
			});
	}

	// Enforce the min and max values on the `count`
	function validateCount() {
		// console.log(maxCount)
		// console.log(count)
		if (count > maxCount) {
			count = maxCount;
		}
		// console.log("count",count)
	}
</script>

<button
	class="m-1 focus:outline-none"
	disabled={!can}
	on:click={() => {
		showBookPopup = true;
	}}
>
	<IconContainer iconName="medical-icon:i-registration" yes={aleardy} />
</button>

<Popup bind:isOpen={showBookPopup}>
	{#if hasToken}
		<div class="flex flex-col items-center">
			<span class="text-xl">เลือกสถานะการจอง</span>
			<div class="flex gap-8 my-10 text-lg">
				{#if currentStatus == 'BI'}
					<button
						on:click={() => {
							confirmPoup = true;
							cancel = true;
						}}
					>
						<ButtonMine background={'bg-error'}>ยกเลิก</ButtonMine>
					</button>
				{/if}
				{#if currentStatus == 'NM'}
					<button
						on:click={() => {
							confirmPoup = true;
							book = true;
						}}
					>
						<ButtonMine background={'bg-accent2'}>ขอจอง</ButtonMine>
					</button>
				{/if}
				<!-- {#if currentStatus == 'BI'}
					<button
						on:click={() => {
							confirmPoup = true;
							done = true;
						}}
					>
						<ButtonMine background={'bg-success'}>สำเร็จ</ButtonMine>
					</button>
				{/if} -->
				{#if currentStatus == 'BE'}
					<span>คุณจองสำเร็จ หากต้องการ ยกเลิกโปรดติดที่พักโดยตรง</span>
				{/if}
			</div>
			<hr class="border-gray-300 mb-2 w-full" />
			<div class="flex flex-col items-start">
				<span>การติดต่อ : สามารถเข้ามาหน้าทริปจากที่เก็บจองคุณหรือหน้าโปรไฟล์เพื่อติดต่อได้โดยตรง</span>
				<div class="my-2"></div>
				<span class="text-xs"
					>หมายเหตุ : หากต้องการยกเลิกกาจจอง เมื่อมีการจองสำเร็จ โปรดติดต่อกับที่พักด้วยตรง</span
				>
			</div>
		</div>
	{:else}
		<div class="flex items-center flex-col">
			<NotYetLogin />
			<button
				on:click={() => {
					showBookPopup = false;
				}}
			>
				<ButtonMine>ปิด</ButtonMine>
			</button>
		</div>
	{/if}
</Popup>

<Popup bind:isOpen={confirmPoup} hideCloseBtn={true}>
	<div class="flex gap-2 items-center text-xl mb-8">
		<span>คุณยืนยันที่จะ</span>
		{#if cancel}
			<h2 class="font-bold italic text-xl">ยกเลิก</h2>
		{:else if book}
			<h2 class="font-bold italic text-xl">จอง</h2>
			<input
				type="number"
				min={1}
				bind:value={count}
				on:input={validateCount}
				class="border rounded px-4 py-1 text-black w-16"
			/>
			คน
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
				book = false;
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
