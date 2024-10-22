<script lang="ts">
	import { formatDate, formatTime } from '$lib/utilsFn/Date';
	import Icon from '@iconify/svelte';
	import ButtonMine from './ButtonMine.svelte';

	export let idAccout: string;
	export let imageURL: string;
	export let email: string;
	export let name: string;
	export let time: string;
	let shardowAndBg = 'shadow-md bg-white';

	async function changeSatatus(status: boolean) {
		const response = await fetch('/api/admin/setWaitOrg', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				IDAccount: idAccout,
				status: status
			})
		});
		if (!response.ok) {
			const errorMessage = await response.text();
			alert(`Error: ${errorMessage}`);
		} else {
			const result = await response.json(); // Assuming the API sends a JSON response
			console.log('changed status successfully:', result);
			shardowAndBg = '';
			alert('done');
		}
	}
</script>

<div class={`flex w-full px-4 py-2 ${shardowAndBg} rounded-lg flex-col my-4 items-start gap-4`}>
	<div class="flex items-center justify-end mt-2 text-sm text-gray-700">
		<div class="flex items-center mr-2">
			<Icon icon="mingcute:time-line" class="text-xl text-black mr-1" />
			<span>{formatTime(time)}</span>
		</div>

		<div class="flex items-center">
			<Icon icon="ic:baseline-calendar-today" class="text-xl text-black mr-1" />
			<span>{formatDate(time)}</span>
		</div>
	</div>
	<div class="flex justify-between w-full items-center">
		<div class="flex items-center">
			<img src={imageURL} alt="User profile" class="w-10 h-10 rounded-full mr-4" />
			<div class="flex flex-col">
				<span>{name}</span>
				<span>{email}</span>
			</div>
		</div>
		<div class="flex gap-4">
			<button
				on:click={() => {
					changeSatatus(false);
				}}
			>
				<ButtonMine background={'bg-error'}>ไม่ผ่าน</ButtonMine>
			</button>
			<button
				on:click={() => {
					changeSatatus(true);
				}}
			>
				<ButtonMine background={'bg-success'}>ผ่าน</ButtonMine>
			</button>
		</div>
	</div>
</div>
