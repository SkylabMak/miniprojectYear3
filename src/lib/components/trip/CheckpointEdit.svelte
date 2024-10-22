<script lang="ts">
	import { checkpointTypeIcon, checkpointTypeText } from '$lib/res/word';
	import Icon from '@iconify/svelte';
	import Popup from '../Popup.svelte';
	import { tripData } from '$lib/store/store';
	import ButtonMine from '../ButtonMine.svelte';
	import { sortCheckpointsByTime } from '$lib/utilsFn/getTripData';

	export let tripID: string;
	export let checkPointID: string;
	export let locationName: string;
	export let showEditPopup: boolean;
	export let typeCK: string;
	export let timeISOString: string;
	export let newCK: boolean = false;

	let isLoading: boolean = true;
	let checkpointDetail = '';
	let isDateEdited = false;
	let isTimeEdited = false;
	let removePopup = false;

	let originalDetail: string;
	let originalName: string;
	let originalTypeCK: string;

	let selectedDate: string = '';
	let selectedTime: string = '';
	let editedDetail: string = '';
	let editedName: string = '';
	let typeCKEdit = '';
	let resultISOString = '';

	// Border color state variables
	let nameInputClass = 'border';
	let detailInputClass = 'border';
	let selectInputClass = 'border';

	async function fetchMessages(): Promise<string> {
		const response = await fetch('/api/getTrip/checkpoint', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				checkpointID: checkPointID
			})
		});

		if (!response.ok) {
			console.log('checkpoint error at ', checkPointID);
			throw new Error('Failed to fetch messages');
		}

		const data: string = (await response.json()).detail;
		return data;
	}

	$: if (showEditPopup) {
		if (!newCK) {
			fetchMessages()
				.then((fetchedMessages) => {
					checkpointDetail = fetchedMessages;
					editedDetail = fetchedMessages;
					editedName = locationName;
					originalDetail = fetchedMessages;
					originalName = locationName;
					originalTypeCK = typeCK;
					typeCKEdit = typeCK;
					isLoading = false;
				})
				.catch((error) => {
					isLoading = false;
					console.error('Error fetching messages:', error);
				});
		} else {
			originalDetail = '';
			originalName = '';
			originalTypeCK = typeCK;
			typeCKEdit = typeCK;
		}

		const parsedDate = new Date(timeISOString);
		selectedDate = parsedDate.toISOString().split('T')[0];
		selectedTime = parsedDate.toTimeString().slice(0, 5);
		resultISOString = timeISOString;
	}

	async function removeAction() {
		const response = await fetch('/api/manageTripSetting/manageCheckpoint/saveCheckpoint', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				tripID: tripID,
				locationName: editedName,
				time: resultISOString,
				detail: editedDetail,
				type: typeCK,
				checkpointID: checkPointID,
				remove: true
			})
		});
		if (!response.ok) {
			console.log('checkpoint error at ', checkPointID);
			throw new Error('Failed to fetch messages');
		}

		tripData.update((data) => {
			const updatedCheckpoints = data.checkpoint.filter((e) => e.IDCheckpoint != checkPointID);
			return {
				...data,
				checkpoint: updatedCheckpoints // Set the modified checkpoints back
			};
		});

		removePopup = false;
		showEditPopup = false;
	}
	async function savecheckpoint() {
		// console.log(originalTypeCK)
		console.log(typeCKEdit)
		console.log(typeCK)
		// console.log(editedName)
		// console.log(editedDetail)

		// console.log(timeISOString)
		// console.log(resultISOString)
		if (
			originalName !== editedName ||
			originalDetail !== editedDetail ||
			originalTypeCK !== typeCKEdit ||
			timeISOString !== resultISOString
		) {
			if (newCK) {
				const response = await fetch('/api/manageTripSetting/manageCheckpoint/createCheckpoint', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						tripID: tripID,
						locationName: editedName,
						detail: editedDetail,
						time: resultISOString,
						type: typeCKEdit
					})
				});
				if (!response.ok) {
					console.log('checkpoint error at ', checkPointID);
					throw new Error('Failed to fetch messages');
				}
				const newCheckpointRes: checkpoint = (await response.json()).checkpoint as checkpoint;
				console.log(newCheckpointRes);
				tripData.update((data) => {
					const updatedCheckpoints = [...data.checkpoint, newCheckpointRes]; // Add the new checkpoint
					const updatedCheckpointsSorted = sortCheckpointsByTime(updatedCheckpoints); // Sort the checkpoints
					return {
						...data,
						checkpoint: updatedCheckpointsSorted // Set the modified checkpoints back
					};
				});
				showEditPopup = false;
			} else {
				const response = await fetch('/api/manageTripSetting/manageCheckpoint/saveCheckpoint', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						tripID: tripID,
						locationName: editedName,
						time: resultISOString,
						detail: editedDetail,
						type: typeCKEdit,
						checkpointID: checkPointID,
						remove: false
					})
				});

				if (!response.ok) {
					console.log('checkpoint error at ', checkPointID);
					throw new Error('Failed to fetch messages');
				}

				tripData.update((data) => {
					const updatedCheckpoints = data.checkpoint.map((cp) => {
						if (cp.IDCheckpoint == checkPointID) {
							return {
								IDCheckpoint: cp.IDCheckpoint,
								time: resultISOString,
								locationName: editedName,
								type: typeCKEdit,
								commentCount: cp.commentCount,
								unRead: cp.unRead,
								orderC: cp.orderC,
								progress: cp.progress,
								me: cp.me
							};
						}
						return cp;
					});
					const updatedCheckpointsSorted = sortCheckpointsByTime(updatedCheckpoints);
					return {
						...data,
						checkpoint: updatedCheckpointsSorted // Set the modified checkpoints back
					};
				});
			}
			showEditPopup = false;
		}
	}

	function updateISOString() {
		if (selectedDate && selectedTime) {
			const newDate = new Date(`${selectedDate}T${selectedTime}`);
			resultISOString = newDate.toISOString();
		}
	}

	function handleDateEdit() {
		isDateEdited = true;
		updateISOString();
	}

	function handleTimeEdit() {
		isTimeEdited = true;
		updateISOString();
	}

	// Reactive blocks to detect changes and update class for border
	$: nameInputClass = originalName !== editedName ? 'border-2 border-warning' : 'border';
	$: detailInputClass = originalDetail !== editedDetail ? 'border-2 border-warning' : 'border';
	$: selectInputClass = originalTypeCK !== typeCKEdit ? 'border-2 border-warning' : 'border'; // Update border when select is changed
	// $: console.log(selectInputClass)
</script>

<Popup bind:isOpen={showEditPopup} hideCloseBtn={true} background={'bg-secondary4'}>
	<div class="bg-secondary4 rounded-xl w-full flex flex-col items-center gap-4">
		<div
			class={`flex items-center bg-secondary3 text-gray-800 font-bold py-2 px-4 rounded-lg ${selectInputClass}`}
		>
			<Icon
				icon={checkpointTypeIcon.get(typeCKEdit) ?? 'carbon:location-current'}
				class="text-xl"
			/>
			<!-- Wrap the select in a div for custom styling -->
			<div class={`w-full ml-2 rounded-md `}>
				<select
					class="w-full bg-transparent text-gray-800 focus:outline-none text-base"
					bind:value={typeCKEdit}
				>
					{#each checkpointTypeText as ckt}
						<option value={ckt[0]}>
							{ckt[1]}
						</option>
					{/each}
				</select>
			</div>
		</div>

		<hr class="border-grayfocus w-full" />

		<div class="flex flex-col w-full">
			<div class="flex items-center mb-2">
				<span class="font-bold mr-2">สถานที่ : </span>
				<input
					type="text"
					bind:value={editedName}
					class={`${nameInputClass} rounded-md px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-accent2-500`}
				/>
			</div>
			<span class="text-xs text-gray-500"
				>หมายเหตุ : สถานที่นี้จะนำเข้าไปค้นหาใน google map และแสดงให้เห็นอันดับแรก</span
			>
		</div>

		<div class="flex flex-col w-full items-center font-bold">
			<span class="mb-2">รายละเอียดสถานที่</span>
			<textarea
				bind:value={editedDetail}
				class={`${detailInputClass} font-normal rounded-md w-full px-2 py-1 focus:outline-none focus:ring-2 focus:ring-accent2-500`}
			/>
		</div>

		<div class="flex gap-4 w-full flex-wrap justify-center items-center">
			<div class="flex flex-col items-center w-1/2">
				<label for="date" class="mb-1">Select Date</label>
				<input
					id="date"
					type="date"
					bind:value={selectedDate}
					on:input={handleDateEdit}
					class="border rounded-md px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-accent2-500"
				/>
			</div>

			<div class="flex flex-col items-center w-1/2">
				<label for="time" class="mb-1">Select Time</label>
				<input
					id="time"
					type="time"
					bind:value={selectedTime}
					on:input={handleTimeEdit}
					class="border rounded-md px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-accent2-500"
				/>
			</div>
		</div>

		<div class="flex justify-center gap-4 w-full mt-4">
			{#if !newCK}
				<button
					class="bg-error text-white px-4 py-2 rounded-md transition-all"
					on:click={() => {
						removePopup = true;
					}}
				>
					ลบ
				</button>
			{/if}
			<button
				class="bg-accent2 text-white px-4 py-2 rounded-md hover:bg-accent2-500 transition-all"
				on:click={() => {
					showEditPopup = false;
				}}
			>
				ปิด
			</button>

			<button
				class="bg-accent2 text-white px-4 py-2 rounded-md hover:bg-accent2-500 transition-all"
				on:click={savecheckpoint}
			>
				บันทึก
			</button>
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
