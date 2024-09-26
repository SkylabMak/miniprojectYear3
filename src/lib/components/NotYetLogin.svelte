<script>

	import { goto } from "$app/navigation";
	import Icon from "@iconify/svelte";

</script>
<div class="flex flex-col w-full justify-center items-center h-96">
    <p class="text-lg mb-8">Who are you? Try signing in.</p>
    <button
    class="w-fit flex items-center p-4 text-lg bg-accent2 text-white rounded-lg px-5 py-2 shadow hover:bg-blue-800 transition duration-200"
    on:click={() => goto('/api/login')}
    >
    <span>Sign in with google</span>
    <div class="google-icon bg-white rounded-full p-1 ml-2">
        <Icon icon="logos:google-icon" />
    </div>
</button>
</div>