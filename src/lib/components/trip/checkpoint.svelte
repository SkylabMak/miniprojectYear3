<script lang="ts">
	import { formatDate, formatTime } from '$lib/utilsFn/Date';
	import Icon from '@iconify/svelte';
	import Popup from '../Popup.svelte';
	import CheckpointDetail from './CheckpointDetail.svelte';
	import CommentsComponent from './CommentsComponent.svelte';
	import CheckpointEdit from './CheckpointEdit.svelte';

	export let tripID: string;
	export let IDCheckpoint: string;
	export let locationName: string;
	export let commentCount: number;
	export let timeISO: string;
	export let progress: progress[];
	export let type: string;
	export let unRead: number;
	export let pass: boolean;
	export let started: boolean;
	export let join: boolean;
	export let canSend: boolean;
	export let canCheckpoint: boolean;
	export let me: boolean;
	export let editMode: boolean;
	export let tripType: string;

	let showCommentPopup = false;
	let showDetailPopup = false;
	let showEditPopup = false;

	const iconType = new Map<string, string>([
		['D', 'solar:point-on-map-linear'],
		['G', 'clarity:group-solid'],
		['A', 'mingcute:target-line']
	]);
</script>

<div class={`flex w-full px-4 py-2 ${pass || editMode ? 'bg-white shadow-md' : ''} rounded-lg `}>
	<div class={`flex flex-col items-center justify-between grow`}>
		<!-- Location Icon -->
		<div class="w-full flex items-center justify-between space-x-2">
			<button
				class="w-full flex items-center justify-between space-x-2"
				on:click={() => {
					showDetailPopup = true;
				}}
			>
				<div class="flex items-center">
					<Icon icon={iconType.get(type) ?? ''} class="text-2xl text-black mr-2" />
				</div>

				<!-- Location Name with Background -->
				<div class="flex-1 bg-secondary4 p-2 rounded-lg flex justify-between items-center">
					<span>{locationName}</span>
					{#if started && canCheckpoint}
						<Icon
							icon="icon-park-outline:check-one"
							class={`text-2xl ${pass ? 'text-black' : 'text-green'}`}
						/>
					{/if}
				</div>
			</button>

			<!-- Comment -->
			{#if !editMode}
				<div class="relative flex items-center space-x-1">
					<button
						on:click={() => {
							showCommentPopup = true;
						}}
					>
						<Icon icon="ant-design:comment-outlined" class="text-2xl text-black" />
					</button>
					<span>{commentCount}</span>

					<CommentsComponent
						{tripID}
						iDcheckpoint={IDCheckpoint}
						bind:showCommentPopup
						{canSend}
						bind:unRead
					/>

					<!-- Unread Badge -->
					{#if unRead > 0 && (join || me)}
						<span
							class="absolute top-[-8px] right-[5px] bg-error text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
						>
							{unRead}
						</span>
					{/if}
					<!-- {me} -->
				</div>
			{/if}
		</div>

		<button
			class="w-full flex items-center justify-between space-x-1 mt-2"
			on:click={() => {
				showDetailPopup = true;
			}}
		>
			<!-- Progress and Time -->
			<div class="flex items-start">
				{#if progress.length > 0}
					{#each progress as img}
						<div class="w-5 h-5 rounded-full bg-white border-black border-2 shadow-sm mr-[-8px]">
							<img
								src={img.imgURL}
								alt={IDCheckpoint}
								class="w-full h-full rounded-lg object-cover"
							/>
						</div>
					{/each}
				{/if}
				<!-- {#if me}
					<div class="bg-emerald-500 border-black border-2 rounded-full w-4 h-4"></div>
				{/if} -->
			</div>

			<!-- Time and Date -->
			<div class="flex items-center justify-end mt-2 text-sm text-gray-700">
				<div class="flex items-center mr-2">
					<Icon icon="mingcute:time-line" class="text-xl text-black mr-1" />
					<span>{formatTime(timeISO)}</span>
				</div>

				<div class="flex items-center">
					<Icon icon="ic:baseline-calendar-today" class="text-xl text-black mr-1" />
					<span>{formatDate(timeISO)}</span>
				</div>
			</div>
		</button>
	</div>
	{#if editMode && tripType != 'BE'}
		<div class="flex items-center text-xl">
			<button
				on:click={() => {
					showEditPopup = true;
				}}
				class="border rounded-full shadow-lg p-2 bg-white ml-2 mr-[-4px]"
			>
				<Icon icon="material-symbols-light:draw-outline" class="text-2xl text-black" />
			</button>
		</div>
	{/if}
</div>

{#if !showCommentPopup && showDetailPopup}
	<CheckpointDetail
		bind:showDetailPopup
		checkPointID={IDCheckpoint}
		typeCK={type}
		{canCheckpoint}
		{tripID}
	/>
{/if}

<CheckpointEdit
	bind:showEditPopup
	checkPointID={IDCheckpoint}
	typeCK={type}
	{locationName}
	{tripID}
	timeISOString={timeISO}
/>
