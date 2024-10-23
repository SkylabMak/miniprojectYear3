import {
	checkErrorAndRes,
	checkMissingInput,
	CustomError,
	resCustomError
} from '$lib/myAPI/customError';
import { prismaMySQL } from '$lib/utils/database/sqlDB';
import { decrypt } from '$lib/security/jwtUtils';
import type { RequestHandler } from '@sveltejs/kit';
import { resFalse, resTrue } from '$lib/myAPI/resTrueFalse';
import { getCurrentIsoDate, partialJoin } from '$lib/myAPI/tripUtils';
import { prismaMongo } from '$lib/utils/database/noSqlDB';
import { MISSING_INPUT } from '$lib/constants/errorCodes';

export const POST: RequestHandler = async ({ request, cookies }) => {
	try {
		const { tripID, iDcheckpoint, text } = await request.json();
		checkMissingInput(tripID, iDcheckpoint, text);
		const token = cookies.get('token');
		const uuid = decrypt(token as string);
		console.log('uuid is ' + uuid);

		const tripDetail = await prismaMySQL.trip.findUnique({
			where: {
				IDTrip: tripID
			},
			select: {
				IDAccount: true,
				IDOriginTrip: true,
				Booking: true,
				joiner: {
					select: {
						IDAccount: true
					}
				}
			}
		});

		console.log(tripDetail);

		if (tripDetail === null) {
			console.log('false trip');
			return resFalse();
		}
		if (
			tripDetail.IDAccount !== uuid &&
			!tripDetail.joiner.some((e) => e.IDAccount === uuid) &&
			!(await partialJoin(tripID, uuid))
		) {
			console.log('false user');
			return resFalse();
		}
		// if (tripDetail.checkpoint.length === 0) {
		// 	console.log('false checkpoint');
		// 	return resFalse();
		// }

		try {
			const newComment = {
				message: text as string,
				readed: [uuid as string],
				sender: uuid as string,
				time: getCurrentIsoDate()
			};
			//update NM trip
			await prismaMongo.checkpointNSQL.updateMany({
				where: {
					IDTrip: tripID,
					IDCheckpoint: iDcheckpoint
				},
				data: {
					Comments: {
						push: newComment
					}
				}
			});

			// //update BI from BE trip

			// if (tripDetail.Booking === 'BE') {
			// 	const checkpointIDInBI = (
			// 		await prismaMySQL.trip.findUnique({
			// 			where: {
			// 				IDTrip: tripDetail.IDOriginTrip as string
			// 			},
			// 			select: {
			// 				checkpoint: {
			// 					where: {
			// 						OrderC: tripDetail.checkpoint[0].OrderC,
			// 						time: tripDetail.checkpoint[0].time
			// 					},
			// 					select: {
			// 						IDCheckpoint: true
			// 					}
			// 				}
			// 			}
			// 		})
			// 	)?.checkpoint[0].IDCheckpoint;
			// 	await prismaMongo.checkpointNSQL.updateMany({
			// 		where: {
			// 			IDCheckpoint: checkpointIDInBI
			// 		},
			// 		data: {
			// 			Comments: {
			// 				push: newComment
			// 			}
			// 		}
			// 	});
			// }
			const userSender = await prismaMySQL.account.findUnique({
				where: {
					IDAccount: uuid as string
				}
			});
			return new Response(
				JSON.stringify({
					text: newComment.message,
					readed: newComment.readed,
					name: userSender?.name,
					imgUrl: userSender?.imgURL,
					time: newComment.time,
					my: true
				}),
				{
					status: 200,
					headers: {
						'Content-Type': 'application/json'
					}
				}
			);
		} catch (error) {
			console.log(error);
			return resFalse();
		}
	} catch (error) {
		return checkErrorAndRes(error);
	}
};

// DELETE FROM checkpoint WHERE IDTrip = 'fbda33db-2c15-4cdb-86af-96a5b6f06cd6'; 10
// DELETE FROM joiner WHERE IDAccount = '0e51d7f7-6cd2-11ef-9f47-04421a0238fa' and IDTrip = '7c6ad9a0-6cd2-11ef-9f47-04421a0238fa'; 10
// DELETE FROM trip WHERE IDAccount = '0e51d7f7-6cd2-11ef-9f47-04421a0238fa' and IDTrip = 'fbda33db-2c15-4cdb-86af-96a5b6f06cd6'; my
