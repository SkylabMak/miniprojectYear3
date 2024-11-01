// src/routes/+page.server.ts
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	// Fetching data from an API or a local source
	// console.log('profile run');
	const response = await fetch('/api/account/getInfo', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		}
		// body: JSON.stringify(requestBody), // Convert the body to JSON
	});
	if (!response.ok) {
		// console.log("response.ok return none profile")
		const data = (await response.json()) as resCustomError;
		// console.log(data)
		if (data.code == '501' || data.code == '402') {
			// console.log("return none profile")
			return {};
		}
	}
	const data = await response.json();
	//data.userToken || data.data
	// export let data: {
	// 	userToken: string;
	// 	data: profile;
	// 	chatData: orgChat[];
	// };
	// console.log('profile data : ', data);
	let chatData: orgChat[] = [];
	if (!response.ok) {
		return null;
	}
	// console.log('data.Org', data.Org);
	if (data.Org == 'true') {
		// console.log('fetch get cust');
		const orgResponse = await fetch('/api/chat/getCustomers ', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			}
		});
		const chat = await orgResponse.json();
		chatData = chat as orgChat[];
		// console.log('chatData', chat);
	} else {
		// console.log('fetch get rest');
		const orgResponse = await fetch('/api/chat/getRest ', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			}
		});
		const chat = await orgResponse.json();
		chatData = chat as orgChat[];
		// console.log('restData', chat);
	}
	//   console.log('Fetched Data:', data);

	// Returning the data to the page component
	return {
		data,
		chatData
	};
};
