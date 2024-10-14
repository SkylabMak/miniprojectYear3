<script lang="ts">
	import { formatDate, formatTime } from '$lib/utilsFn/Date';
	import { mockData } from '$lib/utilsFn/testData/mockupData';
	import Popup from '../Popup.svelte';
	import { afterUpdate, onMount } from 'svelte';

	export let tripID: string;
	export let iDcheckpoint: string;
	export let showCommentPopup: boolean;
	export let canSend: boolean;
	export let unRead : number
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
				unRead = 0
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

<Popup bind:isOpen={showCommentPopup} cusWeight="w-[90%]" cusHeight="h-[90%]">
	<div class="flex flex-col gap-2 h-full w-full">
		<div
			class="flex-col overflow-y-auto max-h-[100%] gap-4 w-full"
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
							<div
								class="w-4 h-4 rounded-full border-black border-2 shadow-sm overflow-hidden flex justify-center items-center"
							>
								<img src={message.imgUrl} alt="User Avatar" class="rounded-full" />
							</div>
							<p class="font-bold text-gray-900">{message.name}</p>
						</div>
						<div class=" rounded-lg p-2 max-w-lg {message.my ? 'bg-chat-my' : 'bg-chat-none'}">
							<p class="mt-1 text-black">{message.text}</p>
						</div>
						<span>{formatDate(message.time)} {formatTime(message.time)}</span>
					</div>
				{/each}
			{/if}
		</div>
		<div class="border border-grayfocus rounded-lg"></div>
		{#if canSend}
			<div class="grow flex items-center">
				<input
					type="text"
					placeholder="พิมพ์ข้อความ"
					bind:value={inputMessage}
					class="m-1 flex-1 p-2 border border-grayfocus rounded-md focus:outline-none focus:ring-2 focus:ring-accent2-500"
				/>
				<button
					on:click={sendMessage}
					class="ml-2 bg-accent2 text-white px-4 py-2 rounded-md hover:bg-accent2-500"
				>
					ส่ง
				</button>
			</div>
		{/if}
	</div>
</Popup>
