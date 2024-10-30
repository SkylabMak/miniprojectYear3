<script lang="ts">
	import EditTripBtn from './button/EditTripBtn.svelte';
	import Icon from '@iconify/svelte';
	import { formatDate } from '$lib/utilsFn/Date';
	import { tripData } from '$lib/store/store';
	import ButtonMine from '../ButtonMine.svelte';
	import Popup from '../Popup.svelte';
	import { goto } from '$app/navigation';

	export let orgUser: boolean;
	let createTripShowPopup = false;
	let tripName = '';
	let bookingChoice = false;

	// Function to handle save and reset original values
	async function createAction() {
		if (tripName.length != 0) {
			console.log(tripName);
			console.log(bookingChoice);
			const response = await fetch('/api/manageTripSetting/manageTrip/createTrip', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					tripName: tripName,
					booking: bookingChoice
				})
			});
			if (!response.ok) {
				console.log('checkpoint error at ');
				throw new Error('Failed to fetch messages');
			}
			const newTripResDate = (await response.json()).newTrip as tripPageData;
			tripData.update(() => {
				return newTripResDate;
			});
			console.log('newTripResDate ', newTripResDate);
			closePopup();
			goto('/trip/' + newTripResDate.tripID);
		}
	}
	function closePopup() {
		tripName = '';
		createTripShowPopup = false;
	}
	$: nameInputClass = tripName.length == 0 ? 'border-2 border-warning' : '';
</script>

<button
	on:click={() => {
		createTripShowPopup = true;
	}}
>
	<ButtonMine>สร้างทริป</ButtonMine>
</button>

<Popup isOpen={createTripShowPopup} hideCloseBtn={true} background={'bg-secondary4'}>
	<div class="bg-secondary4 w-fit rounded-xl flex flex-col gap-4 p-1">
		<div class="w-full flex gap-2 flex-col items-center">
			<span class="font-bold">ชื่อทริป</span>
			<input
				type="text"
				bind:value={tripName}
				class={`${nameInputClass} rounded-lg px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-accent2-500`}
			/>
		</div>

		{#if orgUser}
			{#if orgUser == true}
				<div class="flex justify-center items-center gap-8">
					<span class="before:content-['•'] before:mr-2">จอง</span>
					<div class={`flex gap-2 rounded-full`}>
						<label class="flex items-center">
							<input
								type="radio"
								name="public"
								value={true}
								bind:group={bookingChoice}
								class="hidden"
							/>
							<span
								class={`px-2 py-1 text-center w-12 rounded-full cursor-pointer ${bookingChoice === true ? 'bg-success border-2 border-green-700' : 'bg-gray-300'}`}
								>ใช่</span
							>
						</label>
						<label class="flex items-center">
							<input
								type="radio"
								name="public"
								value={false}
								bind:group={bookingChoice}
								class="hidden"
							/>
							<span
								class={`px-2 py-1 text-center w-12 rounded-full cursor-pointer ${bookingChoice === false ? 'bg-error border-2 border-red-800' : 'bg-gray-300'}`}
								>ไม่</span
							>
						</label>
					</div>
				</div>
			{/if}
		{/if}
		<span class="text-xs">หมายเหตุ : การตั้งค่าเพิ่มเติมสามารถตั้งค่าในทริปได้</span>
		<!-- Buttons -->
		<div class="flex justify-center mt-5 gap-4">
			<button
				on:click={closePopup}
				class="bg-accent2 text-white px-4 py-2 rounded-md hover:bg-gray-900 transition-all"
				>ปิด</button
			>
			<button
				on:click={createAction}
				class="bg-accent2 text-white px-4 py-2 rounded-md hover:bg-gray-900 transition-all"
				>สร้าง</button
			>
		</div>
	</div>
</Popup>
