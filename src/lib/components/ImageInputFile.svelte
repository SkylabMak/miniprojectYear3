<script lang="ts">
	import ButtonMine from './ButtonMine.svelte';
	import Popup from './Popup.svelte';
	import Loading from './Loading.svelte';
	import { resizeImageTo64 } from '$lib/utilsFn/resizeImage';

	export let inputText: string = '';
	export let inputIMGOpen: boolean = false;
	export let originText = '';
	export let id: string;
	export let folder: string;
	export let editMode = true;
	let change: boolean = false;
	let fileinput: HTMLInputElement | null = null;
	let previewIMGUrl: string; // Default preview image
	let filebase64: string = '';
	let extension: string = '';
	let isLoading = false;

	$: previewIMGUrl = inputText;

	function openDialog() {
		if (fileinput) {
			fileinput.click();
		}
	}

	function closeReset() {
		inputText = originText;
		inputIMGOpen = false;
		previewIMGUrl = originText; // Reset preview image
	}

	async function upload() {
		isLoading = true;
		const response = await fetch('/api/utils/imageUpload', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				base64Image: filebase64,
				extension: extension,
				id: id,
				folder: folder
			})
		});

		if (!response.ok) {
			console.log('Upload error');
			// throw new Error('Failed to upload image');
			const errorMessage = await response.text();
			alert(`Error: ไม่สามารถดำเนินการได้`);
			isLoading = false;
			closeReset();
		}
		const newImageUrl = (await response.json()).url;
		console.log('upload done');
		isLoading = false;
		inputText = newImageUrl;
		originText = newImageUrl;
		change = false;
		editMode = false;
		inputIMGOpen = false;
		console.log('all set ');
	}

	// function checkImageURL(url: string) {
	// 	if (browser) { // Ensure this code only runs in the browser
	// 		const img = new Image();
	// 		img.onload = () => {
	// 			isImageError = false;
	// 		};
	// 		img.onerror = () => {
	// 			isImageError = true;
	// 		};
	// 		img.src = url;
	// 	}
	// }

	// Handle file selection and update preview image
	async function onFileSelected(event: Event) {
		isLoading = true;
		const target = event.target as HTMLInputElement;
		if (target.files && target.files.length > 0) {
			const file = target.files[0];
			extension = file.name.split('.').pop() || ''; // Get file extension
			filebase64 = await resizeImageTo64(file);
			// filebase64 = await convertToBase64(file); // Convert the file to base64
			// console.log("file64",filebase64.toString());
			// console.log("extension",extension);
			const reader = new FileReader();
			reader.onload = (e: ProgressEvent<FileReader>) => {
				const result = e.target?.result;
				if (typeof result === 'string') {
					previewIMGUrl = result; // Update the preview image with the selected file
					inputText = result; // Optional: update inputText if needed
				}
			};
			reader.readAsDataURL(file); // Read the file as a data URL
		}
		isLoading = false;
		change = true;
	}
</script>

<Popup
	bind:isOpen={inputIMGOpen}
	hideCloseBtn={true}
	background={'bg-secondary4'}
	cusWeight={'w-[90%]'}
>
	<div class="w-[100%] flex flex-col justify-center items-center gap-8">
		{#if folder == 'trip'}
			<button
				class="relative w-[100%] h-32 rounded-xl flex items-center justify-center border-2 border-black overflow-hidden"
				on:click={openDialog}
			>
				<img id="previewIMG" class="w-full h-full object-cover" src={previewIMGUrl} alt="Preview" />
				<div
					class="absolute inset-0 flex items-center justify-center text-white text-sm font-medium"
				>
					<span
						class="w-fit h-fit bg-black bg-opacity-50 text-white rounded-full px-4 py-2 shadow-lg"
					>
						Choose Image
					</span>
				</div>
				<input
					class="hidden"
					type="file"
					accept=".jpg, .jpeg, .png"
					on:change={onFileSelected}
					bind:this={fileinput}
				/>
			</button>
		{:else}
			<button
				class="relative w-32 h-32 rounded-full flex items-center justify-center border-2 border-black"
				on:click={openDialog}
			>
				<img
					id="previewIMG"
					class="w-full h-full rounded-full object-cover"
					src={previewIMGUrl}
					alt="Preview"
				/>
				<div
					class="absolute inset-0 flex items-center justify-center text-white text-sm font-medium"
				>
					<span
						class="w-fit h-fit bg-black bg-opacity-50 text-white rounded-full px-4 py-2 shadow-lg"
					>
						Choose Image
					</span>
				</div>
				<input
					class="hidden"
					type="file"
					accept=".jpg, .jpeg, .png"
					on:change={onFileSelected}
					bind:this={fileinput}
				/>
			</button>
		{/if}

		<div class="flex items-center gap-4 justify-center mt-4">
			<button on:click={closeReset}>
				<ButtonMine background="bg-warning">ยกเลิก</ButtonMine>
			</button>
			<button on:click={upload} class={`${change ? '' : 'hidden'}`}>
				<ButtonMine>บันทึก</ButtonMine>
			</button>
		</div>
	</div>
</Popup>

<Loading {isLoading} />
