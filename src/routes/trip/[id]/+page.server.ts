import { tripData } from '$lib/store/store';
import { getTripData, getTripDataWithFetch } from '$lib/utilsFn/getTripData';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, fetch }) => {
	const id = params.id; // this will get the "15657415641" from the URL
	// console.log('id ', id);
	const tripDataFromCard: tripPageData = await getTripDataWithFetch(id, fetch);
	tripData.set(tripDataFromCard);
	return { id };
};
