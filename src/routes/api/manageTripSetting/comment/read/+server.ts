import {
	checkErrorAndRes,
	checkMissingInput,
	CustomError,
	resCustomError
} from '$lib/myAPI/customError';
import { prismaMySQL } from '$lib/utils/database/sqlDB';
import { decrypt } from '$lib/security/jwtUtils';
import type { RequestHandler } from '@sveltejs/kit';
import { resFalse } from '$lib/myAPI/resTrueFalse';
import { prismaMongo } from '$lib/utils/database/noSqlDB';
import { MISSING_INPUT } from '$lib/constants/errorCodes';
import { partialJoin } from '$lib/myAPI/tripUtils';

export const POST: RequestHandler = async ({ request, cookies }) => {
	try {
		const { tripID, iDcheckpoint } = await request.json();
		checkMissingInput(tripID, iDcheckpoint);
		const token = cookies.get('token');
		let uuid;
		try {
			uuid = decrypt(token as string);
		} catch (error) {
			uuid = ' ';
		}
		// console.log("uuid is " + uuid)

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

		// const partialJoin = partialJoin(tripID,uuid)
		const checkpointDetail = await prismaMongo.checkpointNSQL.findFirst({
			where: {
				IDCheckpoint: iDcheckpoint
			}
		});
		// console.log(iDcheckpoint);
		const joiner: boolean = !(
			tripDetail?.IDAccount !== uuid &&
			!tripDetail?.joiner.some((e) => e.IDAccount === uuid) &&
			!(await partialJoin(tripID, uuid))
		);

		if (tripDetail === null) {
			console.log('false trip');
			return resFalse();
		}
		if (checkpointDetail === null) {
			console.log('false checkpoint');
			return resFalse();
		}

		try {
			if (token) {
				//update reader
				// console.log("joiner " + joiner)
				if (joiner) {
					const updatedComments = checkpointDetail?.Comments.map((user) => {
						if (!user.readed.includes(uuid as string)) {
							user.readed.push(uuid as string);
						}
						return user;
					});
					await prismaMongo.checkpointNSQL.updateMany({
						where: {
							IDTrip: tripID,
							IDCheckpoint: iDcheckpoint
						},
						data: {
							Comments: updatedComments
						}
					});
				}
			}
			const result = await Promise.all(
				checkpointDetail.Comments.map(async (e) => {
					const userInfo = await prismaMySQL.account.findUnique({
						where: {
							IDAccount: e.sender
						}
					});
					return {
						text: e.message,
						name: userInfo?.name,
						imgUrl: userInfo?.imgURL,
						time: e.time,
						readed: e.readed.length,
						my: uuid ? e.sender === uuid : false
					};
				})
			);
			return new Response(
				JSON.stringify({
					comments: result
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
