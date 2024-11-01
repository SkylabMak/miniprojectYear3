<script>
	// Optional props for customization
	export let color = 'gray-300';
	export let thickness = 1;
	export let margin = 'my-4';
</script>

<div class={`w-full h-[${thickness}px] border-${color} ${margin} border-t bg-${color}`}></div>
