export async function resFalse() {
	return new Response(JSON.stringify({ success: false }), {
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
