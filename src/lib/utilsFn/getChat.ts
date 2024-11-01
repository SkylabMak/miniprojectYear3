export async function getChatOrg(org: string): Promise<orgChat[]> {
	if (org == 'true') {
		// console.log('fetch get cust');
		const orgResponse = await fetch('/api/chat/getCustomers ', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			}
		});
		const chat = await orgResponse.json();
		return chat as orgChat[];
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
		return chat as orgChat[];
		// console.log('restData', chat);
	}
}
