<script lang="ts">
	import { Circle2 as CircleLoader } from 'svelte-loading-spinners';
	import Popup from './Popup.svelte';
	import Icon from '@iconify/svelte';
	export let code: string;
	export let open: boolean;
</script>

<Popup isOpen={open}>
	<div class="flex flex-col items-center p-1 m-1 gap-4">
		<div class="text-[50px] text-error-500">
			<Icon icon="icon-park-solid:error" />
		</div>
		<h1>Error</h1>
		{#if code == '402'}
			<h2>เงื่อนไขไม่ตรง</h2>
		{:else}
			<h2>เกิดข้อผิดพลาดบางอย่าง</h2>
		{/if}
		<h2>กรุณาลองอีกครั้งในภายหลัง หรือ รีเฟรช หน้าเว็บ</h2>
	</div>
</Popup>
