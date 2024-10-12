<script lang="ts">
	import Popup from '../Popup.svelte';

	export let tripID: string;
	export let showJoinerPopup: boolean;
	let isLoading: boolean = true;
	let joinerList: joinerList[];

	async function fetchJoiner(): Promise<joinerList[]> {
		console.log(tripID);
		const response = await fetch('/api/getTrip/getJoiner', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				tripID: tripID
			})
		});

		if (!response.ok) {
			console.log('fetchJoiner error at ');
			throw new Error('Failed to fetch messages');
		}

		const data: joinerList[] = (await response.json()).joinerList;
		return data;
	}

	$: if (showJoinerPopup) {
		fetchJoiner()
			.then((fetchedMessages) => {
				joinerList = fetchedMessages;
				isLoading = false;
			})
			.catch((error) => {
				isLoading = false;
				console.error('Error fetching messages:', error);
			});
	}
</script>

<Popup bind:isOpen={showJoinerPopup}>
	<div class=" p-1 rounded-lg w-fit shadow-md">
		{#if isLoading}
			<p>Loading data...</p>
		{:else if joinerList.length === 0}
			<p>No one</p>
		{:else}
			<div class="flex flex-col gap-2">
				{#each joinerList as user, index}
					<div class="flex gap-2 items-center">
						<div
							class="w-5 h-5 rounded-full border-black border-2 shadow-sm overflow-hidden flex justify-center items-center"
						>
							<img src={user.imgURL} alt="User Avatar" class="rounded-full" />
						</div>
						<span>{user.name}</span>
					</div>
					{#if index != joinerList.length - 1}
						<div class={`border-t w-full mx-1 border-black `}></div>
					{/if}
				{/each}
			</div>
		{/if}
	</div>
</Popup>
