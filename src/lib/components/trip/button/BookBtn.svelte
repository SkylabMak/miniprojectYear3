<script lang="ts">
	import IconContainer from "$lib/components/IconContainer.svelte";
    // export let visbleBtn: boolean = true;
    export let can : boolean;

</script>
<button class="m-1 focus:outline-none" disabled={can}>
    <IconContainer iconName="medical-icon:i-registration" yes={can} />
</button>