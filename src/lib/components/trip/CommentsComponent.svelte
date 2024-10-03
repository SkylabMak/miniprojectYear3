<script lang="ts">
	import { formatDate, formatTime } from '$lib/utilsFn/Date';
	import Popup from '../Popup.svelte';
	import { afterUpdate, onMount } from 'svelte';

	export let tripID: string;
	export let iDcheckpoint: string;
	export let showCommentPopup: boolean;
	export let canSend: boolean;
	let inputMessage: string = '';
	let messages: comment[] = [];
	let messagesContainer: HTMLDivElement | null = null;
	let isLoading: boolean = true; // Track loading state

	async function fetchMessages(): Promise<comment[]> {
		const response = await fetch('/api/manageTripSetting/comment/read', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				tripID: tripID,
				iDcheckpoint: iDcheckpoint
			})
		});

		if (!response.ok) {
			console.log('checkpoint error at ', iDcheckpoint);
			throw new Error('Failed to fetch messages');
		}

		const data: comment[] = (await response.json()).comments;

		// Mock data for testing
		const mockData: comment[] = [
			{
				text: 'This is a mock message 1',
				name: 'Mock User 1',
				time: '',
				imgUrl: 'https://icons.veryicon.com/png/o/miscellaneous/administration/account-25.png',
				readed: 0,
				my: false
			},
			{
				text: 'This is a mock message 2',
				name: 'Mock User 2',
				time: '',
				imgUrl: 'https://icons.veryicon.com/png/o/miscellaneous/administration/account-25.png',
				readed: 0,
				my: false
			},
			{
				text: 'This is a mock message 3',
				name: 'Mock User 3',
				time: '',
				imgUrl: 'https://icons.veryicon.com/png/o/miscellaneous/administration/account-25.png',
				readed: 0,
				my: false
			},
			{
				text: 'This is a mock message 4',
				name: 'Mock User 4',
				time: '',
				imgUrl: 'https://icons.veryicon.com/png/o/miscellaneous/administration/account-25.png',
				readed: 0,
				my: false
			},
			{
				text: 'This is a mock message 5',
				name: 'Mock User 5',
				time: '',
				imgUrl: 'https://icons.veryicon.com/png/o/miscellaneous/administration/account-25.png',
				readed: 0,
				my: false
			},
			{
				text: 'This is a mock message 6',
				name: 'Mock User 6',
				time: '',
				imgUrl: 'https://icons.veryicon.com/png/o/miscellaneous/administration/account-25.png',
				readed: 0,
				my: false
			},
			{
				text: 'This is a mock message 7',
				name: 'Mock User 7',
				time: '',
				imgUrl: 'https://icons.veryicon.com/png/o/miscellaneous/administration/account-25.png',
				readed: 0,
				my: false
			},
			{
				text: 'This is a mock message 8',
				name: 'Mock User 8',
				time: '',
				imgUrl: 'https://icons.veryicon.com/png/o/miscellaneous/administration/account-25.png',
				readed: 0,
				my: false
			}
		];

		return [...data, ...mockData];
	}

	async function sendMessage() {
		if (inputMessage.trim() !== '') {
			console.log(iDcheckpoint);
			const response = await fetch('/api/manageTripSetting/comment/send', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					tripID: tripID,
					iDcheckpoint: iDcheckpoint,
					text: inputMessage
				})
			});

			const newComment = (await response.json()) as comment;
			messages = [...messages, newComment];
			console.log('Message sent:', newComment);
			inputMessage = ''; // Clear the input after sending the message
		}
	}

	// Scroll to the bottom of the messages container
	function scrollToBottom() {
		if (messagesContainer) {
			messagesContainer.scrollTop = messagesContainer.scrollHeight;
		}
	}

	// Reactively fetch messages when `showCommentPopup` becomes true
	$: if (showCommentPopup) {
		fetchMessages()
			.then((fetchedMessages) => {
				messages = fetchedMessages;
				isLoading = false;
				scrollToBottom();
			})
			.catch((error) => {
				isLoading = false;
				console.error('Error fetching messages:', error);
			});
	}

	afterUpdate(() => {
		scrollToBottom();
	});
</script>

<Popup bind:isOpen={showCommentPopup}>
	<div class="flex flex-col gap-4 h-full">
		<div
			class="flex-col overflow-y-auto p-4 max-h-80 gap-4"
			bind:this={messagesContainer}
			id="messagesContainer"
		>
			{#if isLoading}
				<p>Loading messages...</p>
			{:else if messages.length === 0}
				<p>No messages found.</p>
			{:else}
				{#each messages as message, index}
					<div class="flex flex-col gap-1 my-4 {message.my ? 'items-end' : 'items-start'}">
						<div class="flex gap-2 {message.my ? 'justify-end' : 'justify-start'}  items-center">
							<div class="w-4 h-4 rounded-full border-black border-2 shadow-sm">
								<img src={message.imgUrl} alt="User Avatar" class="rounded-full" />
							</div>
							<p class="font-bold text-gray-900">{message.name}</p>
						</div>
						<div
							class="bg-gray-100 rounded-lg p-2 max-w-lg {message.my
								? 'bg-blue-100'
								: 'bg-gray-100'}"
						>
							<p class="mt-1 text-gray-700">{message.text}</p>
						</div>
						<span>{formatDate(message.time)} {formatTime(message.time)}</span>
					</div>
				{/each}
			{/if}
		</div>
		{#if canSend}
			<div class="grow flex items-center mt-4">
				<input
					type="text"
					placeholder="พิมพ์ข้อความ"
					bind:value={inputMessage}
					class="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
				<button
					on:click={sendMessage}
					class="ml-2 bg-accent2 text-white px-4 py-2 rounded-md hover:bg-blue-600"
				>
					ส่ง
				</button>
			</div>
		{/if}
	</div>
</Popup>
