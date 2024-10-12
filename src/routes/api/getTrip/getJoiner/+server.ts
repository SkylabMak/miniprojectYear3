import { prismaMySQL } from '$lib/utils/database/sqlDB';
import type { RequestHandler } from '@sveltejs/kit';
import { checkErrorAndRes, checkMissingInput } from '$lib/myAPI/customError';
import { getUUID } from '$lib/utils/uuidUtils';
import { decrypt } from '$lib/security/jwtUtils';
import { aw } from 'vitest/dist/chunks/reporters.C_zwCd4j.js';

export const POST: RequestHandler = async ({ request, cookies }) => {
	try {
		const { tripID } = await request.json();
		checkMissingInput(tripID);
		const token = cookies.get('token');
		const uuid = decrypt(token as string);
		const joiner = await prismaMySQL.joiner.findMany({
			where: {
				IDTrip: tripID
			},
			select: {
				account: true,
				trip: {
					select: {
						account: true,
						Booking: true
					}
				}
			}
		});
		const company = joiner[0].trip.Booking == 'BI' && joiner[0].trip.account?.IDAccount == uuid;
		const canSee =
			joiner[0].trip.Booking == 'NM' ||
			joiner[0].trip.account?.IDAccount == uuid ||
			joiner.find((e) => e.account.IDAccount == uuid || company);
		// let joinerCount
		// if(company){
		// 	joinerCount = await Promise.all( joiner.map(async e => {
		// 		const count = await prismaMySQL.trip.findFirst({
		// 			where:{
		// 				IDOriginTrip :tripID,

		// 			}
		// 		})
		// 		return {

		// 		}
		// 	}))
		// }
		console.log(canSee);
		let resFormat = joiner.map((e) => {
			return {
				name: e.account.name,
				imgURL: e.account.imgURL
			};
		});
		resFormat.unshift({
			name: joiner[0].trip.account?.name ?? '',
			imgURL: joiner[0].trip.account?.imgURL ?? ''
		});

		return new Response(
			JSON.stringify({
				joinerList: canSee ? resFormat : []
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
