import { encrypt } from '$lib/security/jwtUtils';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
	return new Response(
		JSON.stringify({
			token: encrypt(
				'0e51d94e-6cd2-11ef-9f47-04421a0238fa' //google_7
				// "0e51cc96-6cd2-11ef-9f47-04421a0238fa"//google_1
				// "0e51da43-6cd2-11ef-9f47-04421a0238fa"//google_10
				// "0e51d7f7-6cd2-11ef-9f47-04421a0238fa"//public googel
				// "0e51d9fe-6cd2-11ef-9f47-04421a0238fa"//google_9
				// "0e51d8aa-6cd2-11ef-9f47-04421a0238fa"//google_5
				// "0e51d900-6cd2-11ef-9f47-04421a0238fa"//google_6 rest
				// "0e51d673-6cd2-11ef-9f47-04421a0238fa"//google_2
			)
		}),
		{
			status: 200,
			headers: {
				'Content-Type': 'application/json'
			}
		}
	);
};
