<script lang="ts">
	import UserCard from '$lib/components/UserCard.svelte';
	import { onMount } from 'svelte';

	export let data: {
		data: any;
	};
	onMount(() => {
		// console.log("data ==> ",data)
		if (!data.data) {
			window.history.back();
		}
	});
</script>

<div class="max-h-screen flex flex-col items-center gap-8">
	<h1>user List</h1>
	<div class="p-2 w-full">
		{#if data.data}
			{#each data.data as user}
				<UserCard
					imageURL={user.account.imgURL}
					idAccout={user.IDAccount}
					name={user.account.name}
					email={user.account.Email}
					time={user.reqTime}
				/>
			{/each}
		{:else}
			<span> no data </span>
		{/if}
	</div>
</div>
