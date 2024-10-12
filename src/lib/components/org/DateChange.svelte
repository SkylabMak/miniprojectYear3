<script lang="ts">
	import Popup from '$lib/components/Popup.svelte';
	import { onMount } from 'svelte';
	import ButtonMine from '../ButtonMine.svelte';
	import { getTripData } from '$lib/utilsFn/getTripData';
	import { tripData } from '$lib/store/store';

	export let stringISOString: string;
	export let isDatePopup: boolean;
	export let tripID: string;
	let resultISOString = '';
	let selectedDate: string = '';
	let selectedTime: string = '';
	let can = false;

	async function dateAction() {
		updateISOString();
		// console.log("custID is ",custID)
		// console.log('stringISO', stringISOString);
		// console.log('resultISOString', resultISOString);
		// console.log('tripID', tripID);
		const response = await fetch('/api/manageTripSetting/manageTrip/changeDate', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				tripID: tripID,
				date: resultISOString
			})
		});
		if (!response.ok) {
			console.log('join error ');
			throw new Error('Failed to fetch messages');
		}
		// console.log(await response.json());
		const tripDataFromCard: tripPageData = await getTripData(tripID);
		tripData.set(tripDataFromCard);
		isDatePopup = false;
		stringISOString = resultISOString;
		isDateEdited = false;
		isTimeEdited = false;
	}

	// State to track if an input is edited
	let isDateEdited = false;
	let isTimeEdited = false;

	// Only run this once, when the component is mounted, to initialize the date and time from stringISOString
	$: if (isDatePopup) {
		if (stringISOString != '') {
			// console.log('stringISOString => ', stringISOString);
			// console.log('tripID => ', tripID);
			const parsedDate = new Date(stringISOString);
			selectedDate = parsedDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
			selectedTime = parsedDate.toTimeString().slice(0, 5); // Format as HH:MM
			resultISOString = stringISOString;
			can = true;
		}
	}

	// Update stringISOString only when the user changes selectedDate or selectedTime
	function updateISOString() {
		if (selectedDate && selectedTime) {
			const newDate = new Date(`${selectedDate}T${selectedTime}`);
			resultISOString = newDate.toISOString(); // Convert back to ISO string format
		}
	}

	// Functions to handle when inputs are edited
	function handleDateEdit() {
		isDateEdited = true;
		updateISOString();
	}

	function handleTimeEdit() {
		isTimeEdited = true;
		updateISOString();
	}
</script>

<Popup bind:isOpen={isDatePopup}>
	<div class="flex gap-4 flex-col mb-4">
		<!-- Date Input -->
		<div>
			<label for="date">Select Date:</label>
			<input
				id="date"
				type="date"
				bind:value={selectedDate}
				on:input={handleDateEdit}
				class={`border rounded px-4 py-2 ${isDateEdited ? 'border-warning' : 'border-grayfocus'}`}
				disabled={!can}
			/>
		</div>

		<!-- Time Input -->
		<div>
			<label for="time">Select Time:</label>
			<input
				id="time"
				type="time"
				bind:value={selectedTime}
				on:input={handleTimeEdit}
				class={`border rounded px-4 py-2 ${isTimeEdited ? 'border-warning' : 'border-gray-300'}`}
				disabled={!can}
			/>
		</div>
	</div>

	<p>Selected Date: {selectedDate}</p>
	<p>Selected Time: {selectedTime}</p>
	{#if isTimeEdited || isDateEdited}
		<div class="w-full flex justify-center">
			<button on:click={dateAction}>
				<ButtonMine>บันทึก</ButtonMine>
			</button>
		</div>
	{/if}
</Popup>
