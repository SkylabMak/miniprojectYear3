// src/routes/+page.server.ts
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	const requestBody = {
		my: true
	};
	const response = await fetch('/api/search/get', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(requestBody)
	});
	const data = (await response.json()).Trip;
	// console.log('Fetched Data:', data);

	// Returning the data to the page component
	return {
		data
	};
};
