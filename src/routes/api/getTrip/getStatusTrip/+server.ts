import { prismaMySQL } from '$lib/utils/database/sqlDB';
import type { RequestHandler } from '@sveltejs/kit';
import { checkErrorAndRes, checkMissingInput } from '$lib/myAPI/customError';
import { getUUID } from '$lib/utils/uuidUtils';
import { decrypt } from '$lib/security/jwtUtils';

export const POST: RequestHandler = async ({ request, cookies }) => {
	try {
		const { tripID } = await request.json();
		const token = cookies.get('token');
		const uuid = decrypt(token as string);
		checkMissingInput(tripID);
		console.log('tripID in api', tripID);
		const joinDetail = await prismaMySQL.joiner.findUnique({
			where: {
				IDTrip_IDAccount: {
					IDAccount: uuid as string,
					IDTrip: tripID
				}
			}
		});

		const tripDetail = await prismaMySQL.trip.findUnique({
			where: {
				IDTrip: tripID
			}
		});

		let status = 'NM';
		if (joinDetail != null && joinDetail.type == 'B') {
			status = joinDetail.status == 'B' ? 'BI' : 'BE';
		}
		console.log(tripDetail?.maxJoiner);
		return new Response(
			JSON.stringify({
				status: {
					status: status, //NM,BI,BE
					remaining: (tripDetail?.maxJoiner ?? 0) - (tripDetail?.count ?? 0)
				}
			}),
			{
				status: 200,
				headers: {
					'Content-Type': 'application/json'
				}
			}
		);
	} catch (error) {
		return checkErrorAndRes(error);
	}
};
