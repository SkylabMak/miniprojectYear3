<script lang="ts">
	import { tripData } from '$lib/store/store';
	import { onDestroy } from 'svelte';
	import EditTripBtn from './EditTripBtn.svelte';
	import Icon from '@iconify/svelte';
	import { formatDate } from '$lib/utilsFn/Date';
	import ButtonMine from '../ButtonMine.svelte';
	import JoinBtn from './button/JoinBtn.svelte';
	import CopyBtn from './button/CopyBtn.svelte';
	import GoBtn from './button/GoBtn.svelte';
	import BookBtn from './button/BookBtn.svelte';
	import ChatBtn from './button/ChatBtn.svelte';
	import Popup from '../Popup.svelte';
	import { goto } from '$app/navigation';

	export let editMode: boolean;
	let settingTripPopup = false;
	let dataTrip: tripPageData;
	let originalName: string;
	let originalDetail: string;
	let originalPreparation: string;

	let editedName: string;
	let editedDetail: string;
	let editedPreparation: string;

	let publicChoice: boolean = false;
	let bookingChoice: boolean = false;
	let inviteFriend = '';
	let amount = 0;

	let publicOrigin: boolean = false;
	let bookingOrigin: boolean = false;
	let inviteFriendChanged: boolean = false;
	let amountChanged: number = 0;

	let removePopup: boolean = false;
	let isEdit = false;

	const unsubscribe = tripData.subscribe((value) => {
		dataTrip = value;
		if (value) {
			publicOrigin = !value.private;
			bookingOrigin = value.booking == 'BI';
			amount = value.maxJoiner;

			publicChoice = !value.private;
			bookingChoice = value.booking == 'BI';
			amountChanged = value.maxJoiner;

			inviteFriend = value.tripID;
		}

		console.log(dataTrip);
	});

	async function removeAction() {
		const response = await fetch('/api/manageTripSetting/manageTrip/saveTrip', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				tripID: dataTrip.tripID,
				imageURL: '',
				tripName: '',
				detail: '',
				booking: '',
				preparation: '',
				maxJoiner: 0,
				tripPrivate: false,
				remove: true
			})
		});
		if (!response.ok) {
			console.log('remove trip error ');
			console.log(await response.json());
			throw new Error('Failed to fetch messages');
		}

		goto('/');
	}

	// Function to handle save and reset original values
	async function saveChanges() {
		const response = await fetch('/api/manageTripSetting/manageTrip/saveTrip', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				tripID: dataTrip.tripID,
				tripName: dataTrip.name,
				imageURL: dataTrip.imageURL,
				detail: dataTrip.detail,
				booking: bookingChoice ? 'BI' : 'NM', //edit
				preparation: dataTrip.preparation,
				maxJoiner: amountChanged, //edit
				tripPrivate: !publicChoice, //edit
				remove: false
			})
		});
		if (!response.ok) {
			console.log('tripFooter ');
			throw new Error('Failed to fetch messages');
		}
		tripData.update((data) => {
			return {
				...data,
				booking: bookingChoice ? 'BI' : 'NM', // Set the modified checkpoints back
				maxJoiner: amountChanged,
				tripPrivate: !publicChoice
			};
		});

		removePopup = false;
		settingTripPopup = false;
	}
	function closePopup() {
		publicChoice = publicOrigin;
		bookingChoice = bookingOrigin;
		amountChanged = amount;
		settingTripPopup = false;
	}

	onDestroy(() => {
		// console.log('trip footer run');
		unsubscribe();
	});
	$: publicInputClass = publicChoice !== publicOrigin ? 'border-2 border-warning' : '';
	$: bookingInputClass = bookingChoice !== bookingOrigin ? 'border-2 border-warning' : '';
	$: amountInputClass =
		amount !== amountChanged ? 'border-2 border-warning' : 'border-2 border-black'; // Update border when select is changed
</script>

{#if dataTrip}
	{#if !editMode}
		<div class="flex items-center justify-center flex-wrap">
			<!-- friend section-->
			<div>
				<!-- Icon Buttons -->
				<JoinBtn
					hasToken={dataTrip.hasToken}
					joined={dataTrip.join}
					visbleBtn={dataTrip.booking !== 'NM' || dataTrip.me}
					can={dataTrip.me}
					tripID={dataTrip.tripID}
				/>
				<CopyBtn hasToken={dataTrip.hasToken} can={true} tripID={dataTrip.tripID} />
				<GoBtn
					tripID={dataTrip.tripID}
					status={dataTrip.started}
					can={dataTrip.me}
					tripOriginID={dataTrip.tripIDOrigin}
					tripTypeBook={dataTrip.booking == "BI"}
				/>
			</div>
			<!-- {#if ((dataTrip.org || (dataTrip.booking === "BE" && dataTrip.me)))} -->
			<!-- business section-->
			{#if dataTrip.booking !== 'NM'}
				<div class={`border-l h-12 mx-4 border-black `}></div>
				<BookBtn
					tripOriginID={dataTrip.tripIDOrigin}
					tripID={dataTrip.tripID}
					hasToken={dataTrip.hasToken}
					can={!((dataTrip.ownOrgTrip || dataTrip.me) && dataTrip.booking == 'BI')}
					aleardy={dataTrip.booking == 'BE' || dataTrip.join}
				/>
				<ChatBtn
					can={!((dataTrip.ownOrgTrip || dataTrip.me) && dataTrip.booking == 'BI')}
					tripID={dataTrip.tripIDOrigin == null ? dataTrip.tripID : dataTrip.tripIDOrigin}
					hasToken={dataTrip.hasToken}
					unRead={dataTrip.unread}
				/>
			{/if}
		</div>
	{:else}
		<div class="flex flex-col items-center justify-center gap-4">
			<button
				on:click={() => {
					settingTripPopup = true;
				}}
			>
				<ButtonMine>ตั้งค่าทิป</ButtonMine>
			</button>
			<button
				on:click={() => {
					editMode = false;
				}}
				class="bg-accent2 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2"
			>
				<span class={'text-lg '}>เสร็จสิ้น</span>
				<div class="border-2 rounded-full shadow-lg">
					<Icon icon={'material-symbols-light:draw-outline'} class={'text-2xl'} />
				</div>
			</button>
		</div>
	{/if}
{/if}

<Popup isOpen={settingTripPopup} hideCloseBtn={true} background={'bg-secondary4'}>
	<div class="bg-secondary4 w-fit rounded-xl">
		<h3 class="mb-3 text-start font-bold">เที่ยวรอบเขื่อนขุดถ่าน</h3>
		<hr class="border-gray-400 mb-4" />

		{#if dataTrip.booking != 'BE'}
			<!-- เปิดเผย section with boolean value -->
			<div class="flex justify-between items-center mb-3">
				<span class="before:content-['•'] before:mr-2">เปิดเผย</span>
				<div class={`flex gap-2 ${publicInputClass} rounded-full`}>
					<label class="flex items-center">
						<input
							type="radio"
							name="public"
							value={true}
							bind:group={publicChoice}
							class="hidden"
						/>
						<span
							class={`px-2 py-1 text-center w-12 rounded-full cursor-pointer ${publicChoice === true ? 'bg-success border-2 border-green-700' : 'bg-gray-300'}`}
							>ใช่</span
						>
					</label>
					<label class="flex items-center">
						<input
							type="radio"
							name="public"
							value={false}
							bind:group={publicChoice}
							class="hidden"
						/>
						<span
							class={`px-2 py-1 text-center w-12 rounded-full cursor-pointer ${publicChoice === false ? 'bg-error border-2 border-red-800' : 'bg-gray-300'}`}
							>ไม่</span
						>
					</label>
				</div>
			</div>
		{/if}

		<!-- รับจองห้อง section with boolean value -->
		{#if dataTrip.org && dataTrip.booking != 'BE'}
			<div class="flex justify-between items-center mb-3">
				<span class="before:content-['•'] before:mr-2">รับจองห้อง</span>
				<div class={`flex gap-2 ${bookingInputClass} rounded-full`}>
					<label class="flex items-center">
						<input
							type="radio"
							name="booking"
							value={true}
							bind:group={bookingChoice}
							class="hidden"
						/>
						<span
							class={`px-2 py-1 text-center w-12 rounded-full cursor-pointer ${bookingChoice == true ? 'bg-success border-2 border-green-700' : 'bg-gray-300'}`}
							>ใช่</span
						>
					</label>
					<label class="flex items-center">
						<input
							type="radio"
							name="booking"
							value={false}
							bind:group={bookingChoice}
							class="hidden"
						/>
						<span
							class={`px-2 py-1 text-center w-12 rounded-full cursor-pointer ${bookingChoice == false ? 'bg-error border-2 border-red-800' : 'bg-gray-300'}`}
							>ไม่</span
						>
					</label>
				</div>
			</div>
		{/if}

		<!-- เชิญเพื่อน section -->
		<div class="flex justify-between items-center gap-2 mb-3 w-full">
			<span class="before:content-['•'] before:mr-2">เชิญเพื่อน</span>
			<div class="flex-1 bg-secondary4 border-2 border-black rounded-md p-2">
				{inviteFriend}
			</div>
		</div>

		<!-- จำนวน section -->
		<div class="flex justify-between items-center mb-3">
			{#if dataTrip.booking != 'BE'}
				<span class="before:content-['•'] before:mr-2">จำนวน</span>
				<input
					type="number"
					bind:value={amountChanged}
					class={` ${amountInputClass} rounded-md p-2 text-center w-16 focus:border-4 focus:outline-none`}
				/>
			{/if}
		</div>

		<!-- Debug Output -->
		<div class="mt-4">
			<p>Public Choice: {publicOrigin} {publicChoice}</p>
			<p>Booking Choice: {bookingOrigin} {bookingChoice}</p>
		</div>

		<!-- Buttons -->
		<div class="flex justify-center mt-5 gap-4">
			<button
				on:click={() => {
					removePopup = true;
				}}
				class="bg-error text-white px-4 py-2 rounded-md hover:bg-gray-900 transition-all">ลบ</button
			>
			<button
				on:click={closePopup}
				class="bg-accent2 text-white px-4 py-2 rounded-md hover:bg-gray-900 transition-all"
				>ปิด</button
			>
			<button
				on:click={saveChanges}
				class="bg-accent2 text-white px-4 py-2 rounded-md hover:bg-gray-900 transition-all"
				>บันทึก</button
			>
		</div>
	</div>
</Popup>
<Popup bind:isOpen={removePopup} hideCloseBtn={true}>
	<h2>คุณต้องการ</h2>
	<h2 class="font-bold italic">ลบ</h2>
	<h2>หรือไม่</h2>
	<div class="flex items-center gap-4 justify-center mt-4">
		<button
			on:click={() => {
				removePopup = false;
			}}
		>
			<ButtonMine>ปิด</ButtonMine>
		</button>
		<button on:click={removeAction}>
			<ButtonMine>ใช่</ButtonMine>
		</button>
	</div>
</Popup>
