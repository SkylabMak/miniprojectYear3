<script lang="ts">
	import BookCust from './BookCust.svelte';
	import ChatComponent from './ChatComponent.svelte';
	import DateChange from './DateChange.svelte';

	export let message: orgChat;
	let showBookPopup = false;
	let showCustPopup = false;
	let datePopup = false;
	// Function to handle button click events (for example)
	function handleDayClick() {
		datePopup = true;
	}

	function handleStatusClick() {
		showBookPopup = true;
		console.log('Status button clicked');
	}
	const date = new Date(message.startTime);
	const formattedDate = !isNaN(date.getTime())
		? `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`
		: 'None';

	const formattedTime = !isNaN(date.getTime())
		? `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
		: 'None';
</script>

<ChatComponent
	tripID={message.IDTrip}
	custID={message.IDAccount}
	bind:showChatPopup={showCustPopup}
	hasToken={true}
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
		}}
	>
		<div class="flex justify-between">
			<h3 class="font-bold text-lg">{message.tripname}</h3>
			<div class="flex flex-col items-end">
				<span>{formattedDate}</span>
				<span>{formattedTime}</span>
			</div>
		</div>
	</button>
	<button
		on:click={() => {
			showCustPopup = true;
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
	<div class="flex gap-4 justify-center">
		{#if message.bookDone !== ''}
			<button
				class="grow"
				on:click={() => {
					showCustPopup = true;
				}}
			>
			</button>
			<button class="bg-accent2 text-white px-4 py-2 rounded-lg" on:click={handleDayClick}>
				วัน
			</button>
			<button
				class={`${message.bookDone === 'D' ? 'bg-accent1' : 'bg-accent2'} text-white px-4 py-2 rounded-lg`}
				on:click={handleStatusClick}
			>
				สถานะ
			</button>
			<button
				class="grow"
				on:click={() => {
					showCustPopup = true;
				}}
			>
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
/>
<DateChange
	tripID={message.IDTripCust}
	bind:stringISOString={message.startTime}
	bind:isDatePopup={datePopup}
/>
