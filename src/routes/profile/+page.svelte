<script lang="ts">
	import OrgChat from '$lib/components/org/OrgChat.svelte';
	import Popup from '$lib/components/Popup.svelte';
	import Icon from '@iconify/svelte';
	import NotYetLogin from '$lib/components/NotYetLogin.svelte';
	import CreateTripPopup from '$lib/components/trip/CreateTripPopup.svelte';
	import ImageInput from '$lib/components/ImageInput.svelte';
	import ButtonMine from '$lib/components/ButtonMine.svelte';
	import ImageInputFile from '$lib/components/ImageInputFile.svelte';
	let change = false; // Ensure `change` is reactive and used properly.
	export let data: {
		userToken: string;
		data: profile;
		orgChat: orgChat[];
	};

	// console.log('Data passed to the page:', data.userToken);
	let originalName = '';
	let originIMG = '';
	let isModified = false;
	if (data.userToken) {
		originalName = data.data.name;
		originIMG = data.data.imgURL;
		console.log(data.data.imgURL);
	}
	$: isModified = data.data && (data.data.name !== originalName || change);

	// $: console.log(isModified, data.data.name )
	async function changeName() {
		const response = await fetch('/api/account/edit', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				name: data.data.name,
				org: data.data.Org,
				imgURL: data.data.imgURL,
				remove: false
			})
		});
		if (!response.ok) {
			const errorMessage = await response.text();
			alert(`Error: ${errorMessage}`);
		} else {
			const result = await response.json(); // Assuming the API sends a JSON response
			console.log('Name changed successfully:', result);
		}
		change = false;
	}

	let showPopup = false;
	let inputIMGOpen = false;

	$: console.log(isModified);

	function openPopup() {
		showPopup = true;
	}

	function reset() {
		data.data.name = originalName;
		data.data.imgURL = originIMG;
		change = false;
	}

	async function deleteCookieAndGoHome() {
		const response = await fetch('/api/account/logout'); // Replace with the actual endpoint URL
		if (response.ok) {
			// Refresh the page if the request was successful
			window.location.reload();
		} else {
			// Handle the error if needed
			console.error('Logout failed:', response.statusText);
		}
	}
</script>

{#if data.userToken}
	<!-- Parent Container for Flex Column Layout -->
	<div class="max-h-screen flex flex-col items-center gap-8">
		<!-- Profile Icon or Image -->
		<div class="flex items-center">
			<div class="flex flex-col items-center">
				<button
					class="w-28 h-28 rounded-full flex items-center justify-center border-2 border-black mb-8"
					on:click={() => (inputIMGOpen = true)}
				>
					{#if data.data.imgURL && data.data.imgURL !== ''}
						<img
							src={data.data.imgURL}
							alt={data.data.name}
							class="w-full h-full rounded-full object-cover"
						/>
					{:else}
						<span>click me to add image</span>
					{/if}
				</button>

				<!-- User's Name Input -->
				<div class="flex items-center min-w-3/4">
					<span class="w-fit whitespace-nowrap">ชื่อ :</span>
					<input
						type="text"
						bind:value={data.data.name}
						class="border rounded px-4 py-1 text-black w-9/12 mx-4 grow-0"
					/>
				</div>
			</div>
			{#if isModified}
				<div class="flex flex-col gap-2 h-full whitespace-nowrap flex-none">
					<button on:click={reset}>
						<ButtonMine>
							<Icon icon="radix-icons:cross-2" />
						</ButtonMine>
					</button>
					<button on:click={changeName}>
						<ButtonMine>
							<Icon icon="ic:sharp-save-alt" />
						</ButtonMine>
					</button>
				</div>
			{/if}
		</div>

		{#if data.data.Org == 'true' && data.orgChat}
			<div>
				<span>แชทลูกค้า : </span>
				<button class="bg-accent2 text-white px-4 py-2 rounded-lg" on:click={openPopup}>
					ยังไม่อ่าน {data.orgChat.filter((chat) => chat.readed === false).length} จาก {data.orgChat
						.length}
				</button>
			</div>
		{/if}
		<!-- Confirm Organization Button -->
		{#if data.data.Org == 'true'}
			<button disabled={true} class={`bg-grayfocus-500 text-white px-4 py-2 rounded-lg`}
				>ยืนยันเป็นองค์กรเป็นองค์กรแล้ว</button
			>
		{:else if data.data.Org == 'false'}
			<button class={`bg-accent1 text-white px-4 py-2 rounded-lg`}>ยืนยันเป็นองค์กร"</button>
		{:else}
			<button disabled={true} class={`bg-grayfocus-500 text-white px-4 py-2 rounded-lg`}
				>อยู่ระหว่างดำเนินการ</button
			>
		{/if}
		<!-- Delete Account Button -->
		<button
			class="fixed bg-accent1 bottom-32 right-4 text-white px-4 py-2 rounded-lg"
			on:click={deleteCookieAndGoHome}>logout</button
		>

		<CreateTripPopup orgUser={data.data.Org == 'true'} />
		<ImageInputFile
			bind:inputIMGOpen
			bind:inputText={data.data.imgURL}
			originText={originIMG}
			id=""
			folder={'profile'}
		/>
		<Popup bind:isOpen={showPopup}>
			{#if data.orgChat}
				{#each data.orgChat as message}
					<!-- {console.log("date ",message.startTime)} -->
					<OrgChat {message}></OrgChat>
				{/each}
			{/if}
		</Popup>
	</div>
{:else}
	<NotYetLogin />
{/if}
