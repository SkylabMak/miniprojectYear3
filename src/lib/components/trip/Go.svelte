<script lang="ts">
	import Icon from '@iconify/svelte';
	import MapCicleIcon from '../MapCicleIcon.svelte';
	import {
		findFirstOrLastTypeD,
		findTypeDClosest,
		genGoogleMapsURL
	} from '$lib/utilsFn/assistance';
	import MapOption from './MapOption.svelte';

	// Define the structure of each option
	interface goOption {
		arrowSize: string;
		label: string;
		icon: string;
		showArrowBelow: boolean;
		showArrowAbove: boolean;
		hideIcon?: boolean; // Optional: whether to hide the icon
		iconRight?: boolean; // Optional: whether the icon is placed on the right of the arrow
		verticalLayout?: boolean; // Optional: if icon should be below the arrow in a vertical layout
	}

	// Define arrow sizes and common icon
	const bigArrow = 'text-7xl';
	const smallArrow = 'text-3xl';
	const mapIcon = 'logos:google-maps';
	// Define the options object with an index signature
	const options: { [key: string]: goOption } = {
		large: {
			// Large arrow with icon vertically below
			arrowSize: bigArrow,
			label: '',
			icon: mapIcon,
			showArrowBelow: false,
			showArrowAbove: true
		},
		mini: {
			// Small arrow with no icon
			arrowSize: smallArrow,
			label: '',
			icon: mapIcon,
			showArrowBelow: true,
			showArrowAbove: false,
			hideIcon: true // Hide the icon for mini type
		},
		start: {
			// Small arrow with label and icon below the label
			arrowSize: smallArrow,
			label: 'เริ่มเส้นทาง',
			icon: mapIcon,
			showArrowBelow: true,
			showArrowAbove: false
		},
		end: {
			// Small arrow with label and icon above the label
			arrowSize: smallArrow,
			label: 'กลับบ้าน',
			icon: mapIcon,
			showArrowBelow: false,
			showArrowAbove: true
		}
	};

	// Accept a 'type' prop from the parent component
	export let type: string;
	export let checkpointList: checkpoint[];
	let checkpointListSelected: (checkpoint | null)[];
	let checkpointOptionOpen: boolean = false;
	export let index: number;

	function getRoute() {
		console.log(index);
		console.log(genGoogleMapsURL(findTypeDClosest(checkpointList, index)));
		console.log(findTypeDClosest(checkpointList, index));
	}

	function getSingleRoute() {
		const locationList = findFirstOrLastTypeD(checkpointList, type == 'start');
		console.log(locationList);
	}

	function openMapOption(ckList: (checkpoint | null)[]) {
		// console.log("cklist is ",ckList)
		checkpointListSelected = ckList;
		checkpointOptionOpen = true;
	}
	function setOpenMapOption() {
		if (type == 'large') {
			const locationList: (checkpoint | null)[] = findTypeDClosest(checkpointList, index);
			openMapOption(locationList);
		} else {
			const location: checkpoint | null = findFirstOrLastTypeD(checkpointList, type == 'start');
			if (type == 'start') {
				const modifyListCK = [null, location];
				openMapOption(modifyListCK);
			} else {
				const modifyListCK = [location, null];
				openMapOption(modifyListCK);
			}
		}
	}

	// Determine the arrow icon based on the type
	const arrowIcon =
		type === 'large' ? 'lets-icons:arrow-down-long-light' : 'basil:arrow-down-solid';
</script>

<div class={`flex ${type === 'large' ? 'justify-center items-center' : 'flex-col items-center'}`}>
	{#if options[type]?.showArrowAbove || options[type]?.verticalLayout}
		<!-- Arrow Above -->
		<div class={`text-blue-500 ${options[type]?.arrowSize} flex items-center justify-center`}>
			<Icon icon={arrowIcon} />
		</div>
	{/if}

	{#if options[type]?.label}
		<!-- Label with background and icon (if label is defined) -->
		<button
			on:click={setOpenMapOption}
			class="flex items-center bg-accent2 text-white rounded-lg px-4 py-2 space-x-2"
		>
			<span>{options[type]?.label}</span>
			<!-- Show icon if hideIcon is not true -->
			{#if !options[type]?.hideIcon}
				<MapCicleIcon />
			{/if}
		</button>
	{:else if !options[type]?.hideIcon}
		<!-- Icon in vertical layout if no label -->
		<div
			class="rounded-full ml-[-20px] p-2 border-2 border-gray-300 w-12 h-12 flex justify-center items-center"
		>
			<button on:click={setOpenMapOption}>
				<Icon icon={options[type]?.icon} class="text-3xl" />
			</button>
		</div>
	{/if}

	{#if options[type]?.showArrowBelow && !options[type]?.verticalLayout}
		<!-- Arrow Below -->
		<div class={`text-blue-500 ${options[type]?.arrowSize} m-1 flex items-center`}>
			<Icon icon={arrowIcon} />
		</div>
	{/if}
</div>

<MapOption bind:checkPointList={checkpointListSelected} bind:mapOptionOpen={checkpointOptionOpen} />
