export function filterDest(checkpoints: checkpoint[]): checkpoint[] {
	return checkpoints.filter((e) => e.type == 'D');
}

export function getAllDest(checkpoints: checkpoint[]) {
	return checkpoints
		.filter((cp) => cp.type === 'D')
		.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
}

export function findTypeDClosest(checkpoints: checkpoint[], index: number): (checkpoint | null)[] {
	let result: (checkpoint | null)[] = [];
	let leftCheckpoint: checkpoint | null = null;
	let rightCheckpoint: checkpoint | null = null;

	// If the current index is type "D", add the current item and search only the left
	if (checkpoints[index].type === 'D') {
		result.push(checkpoints[index]);

		// Search left side for the next closest "D" type
		let leftIndex = index - 1;
		while (leftIndex >= 0) {
			if (checkpoints[leftIndex].type === 'D') {
				leftCheckpoint = checkpoints[leftIndex];
				break;
			}
			leftIndex--;
		}

		// Add left checkpoint or null
		result.unshift(leftCheckpoint); // Left side remains at the start of the list
	} else {
		// Search left and right sides if the current index is not "D"
		let leftIndex = index - 1;
		let rightIndex = index + 1;

		// Search left side
		while (leftIndex >= 0) {
			if (checkpoints[leftIndex].type === 'D') {
				leftCheckpoint = checkpoints[leftIndex];
				break;
			}
			leftIndex--;
		}

		// Search right side
		while (rightIndex < checkpoints.length) {
			if (checkpoints[rightIndex].type === 'D') {
				rightCheckpoint = checkpoints[rightIndex];
				break;
			}
			rightIndex++;
		}

		// Add left and right checkpoints (or null if not found)
		result.push(leftCheckpoint); // Left checkpoint or null
		result.push(rightCheckpoint); // Right checkpoint or null
	}

	return result;
}

export function findFirstOrLastTypeD(
	checkpoints: checkpoint[],
	findFirst: boolean
): checkpoint | null {
	if (findFirst) {
		// Find the first checkpoint with type === "D"
		for (let i = 0; i < checkpoints.length; i++) {
			if (checkpoints[i].type === 'D') {
				return checkpoints[i]; // Return the first "D" type checkpoint
			}
		}
	} else {
		// Find the last checkpoint with type === "D"
		for (let i = checkpoints.length - 1; i >= 0; i--) {
			if (checkpoints[i].type === 'D') {
				return checkpoints[i]; // Return the last "D" type checkpoint
			}
		}
	}

	// Return null if no checkpoint with type === "D" is found
	return null;
}

export function genGoogleMapsURL(checkpoints: (checkpoint | null)[]): string {
	if (checkpoints.length === 0) {
		throw new Error('Checkpoint list is empty.');
	}

	const baseUrl = 'https://www.google.com/maps/dir/';

	// Handle null checkpoints and null locationName by replacing with an empty string
	const formattedLocations = checkpoints.map((checkpoint) =>
		checkpoint && checkpoint.locationName ? encodeURIComponent(checkpoint.locationName.trim()) : ''
	);

	const fullUrl = `${baseUrl}${formattedLocations.join('/')}`;

	return fullUrl;
}

export function genGoogleMapsURL_WithText(checkpoints: (string | null)[]): string {
	if (checkpoints.length === 0) {
		throw new Error('Checkpoint list is empty.');
	}

	const baseUrl = 'https://www.google.com/maps/dir/';

	// Handle null checkpoints and null locationName by replacing with an empty string
	const formattedLocations = checkpoints.map((checkpoint) =>
		checkpoint && checkpoint ? encodeURIComponent(checkpoint.trim()) : ''
	);

	const fullUrl = `${baseUrl}${formattedLocations.join('/')}`;

	return fullUrl;
}
