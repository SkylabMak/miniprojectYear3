<script lang="ts">
	import BookCust from './BookCust.svelte';
	import ChatComponent from './ChatComponent.svelte';
	import DateChange from './DateChange.svelte';
	import { formatDate, formatTime } from '$lib/utilsFn/Date';
	import Icon from '@iconify/svelte';

	export let message: orgChat;
	export let cust: boolean;
	let showBookPopup = false;
	let showCustPopup = false;
	let datePopup = false;
	// Function to handle button click events (for example)
	function handleDayClick() {
		datePopup = true;
	}

	function handleStatusClick() {
		showBookPopup = true;
		// console.log('Status button clicked');
	}
	// const date = new Date(message.startTime);
	const formattedDate = formatDate(message.startTime);

	const formattedTime = formatTime(message.startTime);
</script>

<ChatComponent
	tripName={message.tripname}
	tripID={message.IDTrip}
	custID={message.IDAccount}
	bind:showChatPopup={showCustPopup}
	hasToken={true}
	{cust}
/>

<!-- Outer container with border -->
<div
	class="border-2 rounded-lg p-4 mb-4 space-y-2 {message.readed === false
		? 'border-accent1'
		: 'border-grayfocus'}"
>
	<!-- Top row with title, date, and time -->
	<button
		class="w-full"
		on:click={() => {
			showCustPopup = true;
			message.readed = true;
		}}
	>
		<div class="flex justify-between">
			<h3 class="font-bold text-lg text-start">{message.tripname}</h3>
			<div class="flex flex-col items-end">
				<span class="whitespace-nowrap">{formattedDate}</span>
				<span class="whitespace-nowrap">{formattedTime}</span>
			</div>
		</div>
	</button>
	<button
		class="w-full"
		on:click={() => {
			showCustPopup = true;
			message.readed = true;
		}}
	>
		<!-- Middle row with user profile image, username, and message -->
		<div class="flex items-start space-x-4">
			<img
				src={message.custImgUrl || 'https://via.placeholder.com/40'}
				alt="User profile"
				class="w-10 h-10 rounded-full"
			/>
			<div>
				<span class="font-bold">{message.custName}</span>
				<p class="text-sm text-text-gray">{message.Lastmessage}</p>
			</div>
		</div>
	</button>
	<!-- Bottom row with buttons -->
	<div class="flex gap-4 justify-center mr-2">
		{#if message.bookDone !== ''}
			<button
				class="grow"
				on:click={() => {
					showCustPopup = true;
					message.readed = true;
				}}
			>
				<div class="flex items-center">
					<Icon icon="clarity:group-solid" class="text-2xl text-black mr-2" />
					<span>{message.count}</span>
				</div>
			</button>
			{#if !cust}
				<button class="bg-accent2 text-white px-4 py-2 rounded-lg" on:click={handleDayClick}>
					วัน
				</button>
			{/if}

			<button
				class={`${message.bookDone === 'D' ? 'bg-accent1' : 'bg-accent2'} text-white px-4 py-2 rounded-lg`}
				on:click={handleStatusClick}
			>
				สถานะ
			</button>
		{/if}
	</div>
</div>

<BookCust
	tripID={message.IDTrip}
	bind:showBookPopup
	currentStatus={message.bookDone == 'D' ? 'BE' : 'BI'}
	custID={message.IDAccount}
	bind:message
	{cust}
/>
<DateChange
	tripID={message.IDTripCust}
	bind:stringISOString={message.startTime}
	bind:isDatePopup={datePopup}
/>
