// src/routes/+page.server.ts
import { goto } from '$app/navigation';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	// Fetching data from an API or a local source
	// console.log('run');
	const response = await fetch('/api/admin/getWaitOrg', {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	});
	const data = await response.json();
	if (!response.ok) {
		return null;
	}
	console.log(data);
	return {
		data
	};
};
