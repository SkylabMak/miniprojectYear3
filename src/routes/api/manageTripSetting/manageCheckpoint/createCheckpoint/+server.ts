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
import { getCheckpointID, getCurrentIsoDate } from '$lib/myAPI/tripUtils';
import { prismaMongo } from '$lib/utils/database/noSqlDB';
import { MISSING_INPUT } from '$lib/constants/errorCodes';

export const POST: RequestHandler = async ({ request, cookies }) => {
	try {
		const { tripID, locationName, time, detail, type } = await request.json();
		console.log('tripID', tripID);
		checkMissingInput(tripID, locationName, time, detail, type);
		const token = cookies.get('token');
		const uuid = decrypt(token as string);
		console.log('uuid is ' + uuid);
		const checkpointList = await prismaMySQL.trip.findUnique({
			where: {
				IDTrip: tripID
			},
			select: {
				IDAccount: true,
				checkpoint: {
					orderBy: {
						time: 'asc' // Sort by 'time' in ascending order
					},
					select: {
						IDCheckpoint: true,
						time: true,
						OrderC: true,
						locationName: true,
						type: true
					}
				}
			}
		});

		console.log('data VVVVV');
		console.log(checkpointList);
		if (checkpointList?.IDAccount !== uuid) {
			return resFalse();
		}
		try {
			const newCKID = await getCheckpointID();
			let last = checkpointList.checkpoint.length;
			const lastOrderC = (checkpointList.checkpoint[last - 1]?.OrderC ?? last) + 1;
			await prismaMySQL.checkpoint.create({
				data: {
					IDCheckpoint: newCKID,
					IDTrip: tripID,
					OrderC: lastOrderC ?? 0,
					createTime: getCurrentIsoDate(),
					time: time,
					locationName: locationName,
					detail: detail,
					type: type
				}
			});
			await prismaMongo.checkpointNSQL.create({
				data: {
					IDCheckpoint: newCKID,
					IDTrip: tripID,
					Comments: [],
					progress: []
				}
			});

			return new Response(
				JSON.stringify({
					checkpoint: {
						IDCheckpoint: newCKID,
						time: time,
						locationName: locationName,
						type: type,
						commentCount: 0,
						unRead: 0,
						orderC: lastOrderC,
						progress: [],
						me: false
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
