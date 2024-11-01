<script lang="ts">
	import {
		notifications,
		removeNotification,
		type NotificationType
	} from '$lib/store/notificationStore';
	import Icon from '@iconify/svelte';
	import { fly, fade } from 'svelte/transition';
	function getBackgroundColor(type: NotificationType): string {
		switch (type) {
			case 'success':
				return 'bg-success';
			case 'error':
				return 'bg-error';
			case 'chat':
				return 'bg-secondary3';
			default:
				return 'bg-accent';
		}
	}
</script>

<div class="fixed top-4 right-4 space-y-2 flex flex-col items-end z-[1000]">
	{#each $notifications as { id, message, type, by }}
		<div
			in:fade
			out:fly
			class={`p-2 rounded shadow ${getBackgroundColor(type)} text-white flex items-center w-fit`}
		>
			<div class="flex gap-1 text-lg">
				<span class=" text-wrap">
					{message} <span class="underline">{by}</span>
				</span>
			</div>
			<button on:click={() => removeNotification(id)} class="ml-2 text-4xl">
				<Icon icon="mingcute:close-fill" />
			</button>
		</div>
	{/each}
</div>
