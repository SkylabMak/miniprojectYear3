<script lang="ts">
	export let background = 'bg-accent2';
</script>

<div class={`${background} w-fit text-white px-4 py-2 rounded-lg `}>
	<slot>Button</slot>
	<!-- Default content if slot is not provided -->
</div>
