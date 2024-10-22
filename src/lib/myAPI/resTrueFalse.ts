import { CONDTIONS_NOT_MATCH } from '$lib/constants/errorCodes';

export async function resFalse() {
	const error = CONDTIONS_NOT_MATCH;
	return new Response(JSON.stringify({ code: error.code, message: error.message }), {
		status: 400,
		headers: {
			'Content-Type': 'application/json'
		}
	});
}

export async function resTrue() {
	return new Response(JSON.stringify({ success: true }), {
		status: 200,
		headers: {
			'Content-Type': 'application/json'
		}
	});
}
