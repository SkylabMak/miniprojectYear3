<script lang="ts">
	import { tripData } from '$lib/store/store';
	import { onDestroy, onMount } from 'svelte';
	import Icon from '@iconify/svelte';
	import { formatDate } from '$lib/utilsFn/Date';
	import ButtonMine from '../ButtonMine.svelte';
	import ImageInputFile from '../ImageInputFile.svelte';
	import JoinerList from './JoinerList.svelte';
	import DateChange from '../org/DateChange.svelte';
	import ErrorShow from '../ErrorShow.svelte';

	export let editMode: boolean;
	let inputIMGOpen = false;

	let dataTrip: tripPageData;
	let originalName: string;
	let originalDetail: string;
	let originalPreparation: string;
	let originalIMGURL: string;

	let editedName: string;
	let editedDetail: string;
	let editedPreparation: string;

	let isEdit = false;
	let canEdit = false;
	let isJoinerPopup = false;
	let datePopup = false;
	let statusBe = 'NM';

	let errorCode = '';
	let errorOpen = false;
	const unsubscribe = tripData.subscribe((value) => {
		dataTrip = value;
		if (value) {
			canEdit = value.me || value.ownOrgTrip;
			originalName = value.name;
			originalDetail = value.detail;
			originalPreparation = value.preparation;
			editedName = value.name;
			editedDetail = value.detail;
			editedPreparation = value.preparation;
			originalIMGURL = value.imageURL;
		}

		// console.log(dataTrip);
	});

	function isEdited(original: string, edited: string): boolean {
		if (!isEdit) {
			isEdit = original !== edited;
		}
		return original !== edited;
	}

	// Function to handle save and reset original values
	async function saveChanges() {
		console.log(isEdit);
		if (isEdit) {
			const response = await fetch('/api/manageTripSetting/manageTrip/saveTrip', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					tripID: dataTrip.tripID,
					tripName: editedName, //edit
					detail: editedDetail, //edit
					booking: dataTrip.booking,
					imageURL: dataTrip.imageURL, //edit
					preparation: editedPreparation, //edit
					maxJoiner: dataTrip.maxJoiner,
					tripPrivate: dataTrip.private,
					remove: false
				})
			});
			if (!response.ok) {
				console.log('tripHeader error at ');
				errorCode = (await response.json()).code;
				errorOpen = true;
				throw new Error('Failed to fetch messages');
			}
			// const newComment = (await response.json()) as chat;
			tripData.update((data) => {
				return {
					...data,
					name: editedName,
					detail: editedDetail,
					preparation: editedPreparation
				};
			});
		}
		editMode = false;
	}

	function cancelEdit() {
		editMode = false;
		editedName = originalName;
		editedDetail = originalDetail;
		editedPreparation = originalPreparation;
		// dataTrip.imageURL = originalIMGURL;
		console.log(dataTrip.imageURL);
	}

	function openJoiner() {
		// console.log(dataTrip.booking != "BI" || dataTrip.ownOrgTrip)
		if (dataTrip.booking != 'BI' || dataTrip.me || (dataTrip.join && dataTrip.booking != 'BI')) {
			isJoinerPopup = true;
		}
	}
	async function fetchStatus() {
		// console.log("tripID in book",tripID)
		const response = await fetch('/api/getTrip/getStatusTrip', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				tripID: dataTrip.tripIDOrigin
			})
		});

		if (!response.ok) {
			console.log(await response.json());
			throw new Error('Failed to fetch messages');
		}

		const dataRes = (await response.json()).status as {
			status: string;
			remaining: number;
		};
		console.log('status', dataRes);
		return dataRes;
	}
	onMount(async () => {
		if (dataTrip && dataTrip.booking == 'BE') {
			fetchStatus()
				.then((fetchedMessages) => {
					statusBe = fetchedMessages?.status ?? '';
				})
				.catch((error) => {
					console.error('Error fetching messages:', error);
				});
		}
	});
	onDestroy(() => {
		unsubscribe();
	});
	$: if (dataTrip) isEdited(originalIMGURL, dataTrip.imageURL);
</script>

<div class="w-full flex justify-end"></div>
<!-- Image Section -->
<div class="image-placeholder bg-gray-300 w-full max-h-32 rounded-lg mb-4 overflow-hidden">
	{#if dataTrip}
		{#if dataTrip.imageURL}
			<button
				disabled={!editMode}
				on:click={() => {
					inputIMGOpen = true;
				}}
			>
				<img
					src={dataTrip.imageURL}
					alt={dataTrip.tripID}
					class="w-full h-full rounded-lg object-cover"
				/>
			</button>
		{:else}
			<button
				class="w-full h-full"
				disabled={!editMode}
				on:click={() => {
					inputIMGOpen = true;
				}}
			>
				<div class="text-center">No image</div>
			</button>
		{/if}
	{/if}
</div>
{#if dataTrip}
	<ImageInputFile
		bind:inputIMGOpen
		bind:inputText={dataTrip.imageURL}
		originText={originalIMGURL}
		id={dataTrip.tripID}
		folder={'trip'}
		bind:editMode
	/>

	<JoinerList tripID={dataTrip.tripID} bind:showJoinerPopup={isJoinerPopup} />
{/if}
<div class="mb-4">
	{#if editMode}
		<span class="text-lg"> ชื่อทริป </span>
		<input
			type="text"
			bind:value={editedName}
			class="border rounded w-full px-2 py-1 mb-2 text-xl font-bold focus:outline-none"
			class:border-warning-500={isEdited(originalName, editedName)}
		/>
	{:else if dataTrip}
		<h2 class="font-bold text-xl mb-1">{dataTrip.name}</h2>
	{/if}
</div>

<!-- Detail Section -->
<div class="mb-4">
	{#if editMode}
		<span class="text-lg"> คำอธิบาย </span>
		<textarea
			bind:value={editedDetail}
			class="border rounded w-full px-2 py-1 text-black focus:outline-none"
			class:border-warning-500={isEdited(originalDetail, editedDetail)}
		></textarea>
	{:else if dataTrip}
		<p class="text-black mb-4 pl-2">{dataTrip.detail}</p>
	{/if}
</div>

<!-- Preparation Section -->
<div class="mb-4">
	{#if editMode}
		<span class="text-lg"> สิ่งที่ต้องเตียมตัว </span>
		<textarea
			bind:value={editedPreparation}
			class="border rounded w-full px-2 py-1 text-sm focus:outline-none"
			class:border-warning-500={isEdited(originalPreparation, editedPreparation)}
		></textarea>
		{#if dataTrip && dataTrip.booking != 'BE'}
			<div class="w-full flex justify-center my-4">
				<button
					on:click={() => {
						datePopup = true;
					}}
				>
					<ButtonMine>เลื่อนวัน</ButtonMine>
				</button>
			</div>
		{/if}
	{:else}
		<h3 class="font-bold text-sm mb-2">สิ่งที่ต้องเตรียม</h3>
		{#if dataTrip}
			<p class="text-sm text-black mb-4">{dataTrip.preparation}</p>
		{/if}
	{/if}
</div>
{#if dataTrip}
	<DateChange
		tripID={dataTrip.tripID}
		bind:stringISOString={dataTrip.startDate}
		bind:isDatePopup={datePopup}
	/>
{/if}

<!-- Save and Cancel Buttons -->
<div class="my-4 flex gap-4 justify-center">
	{#if editMode}
		<button on:click={cancelEdit}>
			<ButtonMine background={'bg-warning'}>ยกเลิก</ButtonMine>
		</button>
		<button on:click={saveChanges}>
			<ButtonMine>บันทึก</ButtonMine>
		</button>
	{/if}
</div>

<div class={`flex justify-center ${dataTrip && dataTrip.booking == 'BE' ? 'gap-6' : 'gap-16'}`}>
	{#if dataTrip && dataTrip.booking == 'BE'}
		<div class="flex items-center">
			<Icon icon="fluent:status-24-regular" class="text-2xl text-black mr-2" />
			{#if statusBe == 'BI'}
				<span class="text-warning whitespace-nowrap">กำลังจอง</span>
			{:else}
				<span class="text-success whitespace-nowrap">จองเสร็จแล้ว</span>
			{/if}
		</div>
	{/if}
	<!-- Count -->
	{#if dataTrip}
		<button class="flex justify-center text-sm text-black" on:click={openJoiner}>
			<div class="flex items-center">
				<Icon icon="clarity:group-solid" class="text-2xl text-black mr-2" />
				<span>{dataTrip.count}/{dataTrip.maxJoiner}</span>
			</div>
		</button>
	{/if}

	<!-- Date -->
	<div class="flex justify-center text-sm text-black">
		<div class="flex items-center">
			<Icon icon="mingcute:time-line" class="text-2xl text-black mr-2" />
			<span>{formatDate(dataTrip?.startDate)}</span>
		</div>
	</div>
</div>
<ErrorShow bind:open={errorOpen} code={errorCode} />
