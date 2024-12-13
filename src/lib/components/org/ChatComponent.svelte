<script lang="ts">
	import { closeChatEvent, readChat } from '$lib/store/store';
	interface chatData {
		chatList: chat[];
		socketID: string;
	}
	import { formatDate, formatTime } from '$lib/utilsFn/Date';
	import NotYetLogin from '../NotYetLogin.svelte';
	import Popup from '../Popup.svelte';
	import { afterUpdate, onMount } from 'svelte';

	export let tripID: string;
	export let custID: string;
	export let tripName: string;
	export let showChatPopup: boolean;
	export let hasToken: boolean;
	export let cust: boolean;

	let inputMessage: string = '';
	let messages: chat[] = [];
	let socketID = '';
	let messagesContainer: HTMLDivElement | null = null;
	let SignedIn = false;
	let isLoading: boolean = true;

	let eventSource: EventSource | null = null;

	async function fetchMessages(): Promise<chatData> {
		if (hasToken) {
			// console.log('cust ID', custID);
			// console.log('trip ID', tripID);
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
			const data: chatData = {
				chatList: dataRes.chats,
				socketID: dataRes.SocketID
			};

			// console.log(dataRes);
			return data;
		} else {
			return {
				chatList: [],
				socketID: ''
			};
		}
	}

	async function sendMessage() {
		if (inputMessage.trim() !== '') {
			// console.log('send : ', inputMessage);
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
			// messages = [...messages, newComment];
			// console.log('Message sent:', newComment);
			inputMessage = '';
		}
	}

	// Scroll to the bottom of the messages container
	function scrollToBottom() {
		if (messagesContainer) {
			messagesContainer.scrollTop = messagesContainer.scrollHeight;
		}
	}

	function connectSEE(id: string) {
		// console.log('try to connect');
		eventSource = new EventSource(`/api/chat/Focus?userId=${id}`);
		eventSource.onmessage = (event) => {
			const data = JSON.parse(event.data) as chatSEE;
			// console.log('New message:', data);
			const dataChat: chat = {
				text: data.text,
				name: data.name,
				imgUrl: data.imgUrl,
				time: data.time,
				my: data.rest != cust
			};
			messages = [...messages, dataChat];
		};
	}

	// Reactively fetch messages when showChatPopup becomes true
	$: if (showChatPopup) {
		// console.log('open run');
		if (!eventSource) {
			// Only connect if not already connected
			// console.log('first run');
			fetchMessages()
				.then((fetchedMessages) => {
					messages = fetchedMessages.chatList;
					socketID = fetchedMessages.socketID;
					isLoading = false;
					scrollToBottom();
					connectSEE(socketID); // Connect EventSource
					readChat.set(fetchedMessages.socketID);
				})
				.catch((error) => {
					isLoading = false;
					console.error('Error fetching messages:', error);
				});
		}
	} else {
		// console.log('close chat popup');
		if (eventSource) {
			// console.log('Closing EventSource');
			eventSource.close();
			eventSource = null;
		}
		readChat.set('');
		closeChatEvent.update((e) => {
			// console.log('close popup', e);
			return !e;
		});
	}

	afterUpdate(() => {
		scrollToBottom();
	});
</script>

<Popup bind:isOpen={showChatPopup} cusWeight={'w-[100%]'} cusHeight={'h-[90%]'} custPadding={'p-2'}>
	{#if hasToken}
		<div class="flex flex-col gap-4 h-full">
			<div class=" text-lg font-bold ml-2 mt-2">
				{tripName}

				<div class="my-4 border-t border-gray-300"></div>
			</div>
			<!-- Messages container with overflow-y-auto to scroll -->
			<div
				class="flex-col overflow-y-auto p-4 gap-4"
				bind:this={messagesContainer}
				id="messagesContainer"
			>
				{#if isLoading}
					<p>Loading messages...</p>
				{:else if messages.length === 0}
					<p>No messages found.</p>
				{:else}
					<div>
						{#each messages as message, index}
							<div class="flex flex-col gap-1 my-2 {message.my ? 'items-end' : 'items-start'}">
								<div class="flex gap-2 {message.my ? 'justify-end' : 'justify-start'} items-center">
									<div
										class="w-6 h-6 rounded-full border-black border-2 shadow-sm overflow-hidden flex justify-center items-center"
									>
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
					</div>
				{/if}
			</div>
			<!-- Input and buttons -->
			<div>
				<div class="my-4 border-t border-gray-300"></div>
				<div class="flex items-center mt-4 p-1">
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
		</div>
	{:else}
		<NotYetLogin />
	{/if}
</Popup>
