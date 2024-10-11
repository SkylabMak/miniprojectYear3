<script lang="ts">
	import OrgChat from '$lib/components/org/Chat.svelte';
	import Popup from '$lib/components/Popup.svelte';
	import Icon from '@iconify/svelte';
	import NotYetLogin from '$lib/components/NotYetLogin.svelte';
	import CreateTripPopup from '$lib/components/trip/CreateTripPopup.svelte';
	import ImageInput from '$lib/components/ImageInput.svelte';
	import ButtonMine from '$lib/components/ButtonMine.svelte';
	import ImageInputFile from '$lib/components/ImageInputFile.svelte';
	import PrivateTrip from '$lib/components/trip/PrivateTrip.svelte';
	let privateTripOpen = false;
	let popupOrg = false;
	let change = false; // Ensure `change` is reactive and used properly.
	export let data: {
		userToken: string;
		data: profile;
		chatData: orgChat[];
	};

	// console.log('Data passed to the page:', data.userToken);
	let originalName = '';
	let originIMG = '';
	let isModified = false;
	if (data.userToken) {
		originalName = data.data.name;
		originIMG = data.data.imgURL;
		// console.log(data.data.imgURL);
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

	// $: console.log(isModified);

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
	async function sendOrgAction() {
		const response = await fetch('/api/account/edit', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				name: data.data.name,
				org: true,
				imgURL: data.data.imgURL,
				remove: false
			})
		});
		if (!response.ok) {
			const errorMessage = await response.text();
			alert(`Error: ${errorMessage}`);
		} else {
			data.data.Org = 'true';
		}
		popupOrg = false;
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

		{#if data.data.Org == 'true' && data.chatData}
			<div>
				<span>แชทลูกค้า : </span>
				<button class="bg-accent2 text-white px-4 py-2 rounded-lg" on:click={openPopup}>
					ยังไม่อ่าน {data.chatData.filter((chat) => chat.readed === false).length} จาก {data
						.chatData.length}
				</button>
			</div>
		{:else}
			<div>
				<span>แชทจากที่พัก : </span>
				<button class="bg-accent2 text-white px-4 py-2 rounded-lg" on:click={openPopup}>
					ยังไม่อ่าน {data.chatData.filter((chat) => chat.readed === false).length} จาก {data
						.chatData.length}
				</button>
			</div>
		{/if}
		<!-- Confirm Organization Button -->
		{#if data.data.Org == 'true'}
			<button disabled={true} class={`bg-grayfocus-500 text-white px-4 py-2 rounded-lg`}
				>ยืนยันเป็นองค์กรเป็นองค์กรแล้ว</button
			>
		{:else if data.data.Org == 'false'}
			<button
				on:click={() => {
					popupOrg = true;
				}}
				class={`bg-accent1 text-white px-4 py-2 rounded-lg`}>ยืนยันเป็นองค์กร</button
			>
		{:else}
			<button disabled={true} class={`bg-grayfocus-500 text-white px-4 py-2 rounded-lg`}
				>อยู่ระหว่างดำเนินการ</button
			>
		{/if}
		<button
			class="fixed bg-accent1 bottom-32 right-4 text-white px-4 py-2 rounded-lg"
			on:click={deleteCookieAndGoHome}>logout</button
		>
		<div class="flex gap-4">
			<CreateTripPopup orgUser={data.data.Org == 'true'} />
			<button
				on:click={() => {
					privateTripOpen = true;
				}}
			>
				<ButtonMine>เข้าร่วมทริป</ButtonMine>
			</button>
		</div>

		<ImageInputFile
			bind:inputIMGOpen
			bind:inputText={data.data.imgURL}
			originText={originIMG}
			id=""
			folder={'profile'}
		/>
		<Popup bind:isOpen={showPopup}>
			{#if data.chatData}
				{#each data.chatData as message}
					<!-- {console.log("date ",message.startTime)} -->
					<OrgChat {message} cust={data.data.Org == 'false'}></OrgChat>
				{/each}
			{/if}
		</Popup>
		<PrivateTrip bind:privateTripOpen />
		<Popup bind:isOpen={popupOrg} hideCloseBtn={true}>
			<span>คุณต้องการร้องขอเปลียนบัญชีเป็นองค์กรหรือไม่</span>
			<div class="flex items-center gap-4 justify-center mt-4">
				<button
					on:click={() => {
						popupOrg = false;
					}}
				>
					<ButtonMine>ปิด</ButtonMine>
				</button>
				<button on:click={sendOrgAction}>
					<ButtonMine>ใช่</ButtonMine>
				</button>
			</div>
		</Popup>
	</div>
{:else}
	<NotYetLogin />
{/if}
