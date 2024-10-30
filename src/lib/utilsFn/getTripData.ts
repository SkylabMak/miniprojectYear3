export async function getTripData(tripID: string): Promise<tripPageData> {
	const resTripData = await fetch('/api/getTrip/getFullTrip', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			tripID: tripID
		})
	});
	if (!resTripData.ok) {
		throw '';
	}
	const data = (await resTripData.json()).Trip as tripPageData;
	return data;
}

export async function getTripDataWithFetch(
	tripID: string,
	fetch: typeof globalThis.fetch
): Promise<tripPageData> {
	const resTripData = await fetch('/api/getTrip/getFullTrip', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			tripID: tripID
		})
	});
	const data = (await resTripData.json()).Trip as tripPageData;
	return data;
}

export function sortCheckpointsByTime(checkpoints: checkpoint[]): checkpoint[] {
	return checkpoints.sort((a, b) => {
		const timeA = a.time ? new Date(a.time).getTime() : 0; // Fallback to 0 if time is null
		const timeB = b.time ? new Date(b.time).getTime() : 0; // Fallback to 0 if time is null
		return timeA - timeB; // Sort in ascending order by time
	});
}
