<script lang="ts">
	import { formatDate, formatTime } from '$lib/utilsFn/Date';
	import NotYetLogin from '../NotYetLogin.svelte';
	import Popup from '../Popup.svelte';
	import { afterUpdate, onMount } from 'svelte';

	export let tripID: string;
	export let custID: string;
	export let showChatPopup: boolean;
	export let hasToken: boolean;

	let inputMessage: string = '';
	let messages: chat[] = [];
	let messagesContainer: HTMLDivElement | null = null;
	let SignedIn = false;
	let isLoading: boolean = true; // Track loading state

	async function fetchMessages(): Promise<chat[]> {
		if (hasToken) {
			console.log('cust ID', custID);
			console.log('trip ID', tripID);
			const response = await fetch('/api/chat/read', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					tripID: tripID,
					custID: custID
				})
			});

			if (!response.ok) {
				console.log(await response.json());
				throw new Error('Failed to fetch messages');
			}

			const dataRes = await response.json();
			const data: chat[] = dataRes.chats;
			console.log(dataRes);
			return data;
		} else {
			return [];
		}
	}

	async function sendMessage() {
		if (inputMessage.trim() !== '') {
			const response = await fetch('/api/chat/send', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					tripID: tripID,
					custID: custID.trim().length != 0 ? custID : null,
					text: inputMessage
				})
			});
			const newComment = (await response.json()) as chat;
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

	// Reactively fetch messages when showChatPopup becomes true
	$: if (showChatPopup) {
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

<Popup bind:isOpen={showChatPopup}>
	{#if hasToken}
		<div class="flex flex-col gap-4 h-full">
			<!-- Messages container with overflow-y-auto to scroll -->
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
						<div class="flex flex-col gap-1 my-2 {message.my ? 'items-end' : 'items-start'}">
							<div class="flex gap-2 {message.my ? 'justify-end' : 'justify-start'} items-center">
								<div class="w-4 h-4 rounded-full border-black border-2 shadow-sm">
									<img src={message.imgUrl} alt="User Avatar" class="rounded-full" />
								</div>
								<p class="font-bold text-gray-900">{message.name}</p>
							</div>
							<div class="rounded-lg p-2 max-w-lg {message.my ? 'bg-chat-my' : 'bg-chat-none'}">
								<p class="mt-1 text-gray-700">{message.text}</p>
							</div>
							<span>{formatDate(message.time)} {formatTime(message.time)}</span>
						</div>
					{/each}
				{/if}
			</div>

			<!-- Input and buttons -->
			<div class="grow flex items-center mt-4">
				<input
					type="text"
					placeholder="พิมพ์ข้อความ"
					bind:value={inputMessage}
					class="flex-1 p-2 border border-grayfocus rounded-md focus:outline-none focus:ring-2 focus:ring-ringblue"
				/>
				<button
					on:click={sendMessage}
					class="ml-2 bg-accent2 text-white px-4 py-2 rounded-md hover:bg-ringblue"
				>
					ส่ง
				</button>
			</div>
		</div>
	{:else}
		<NotYetLogin />
	{/if}
</Popup>
