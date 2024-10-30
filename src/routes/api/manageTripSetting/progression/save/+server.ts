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
import { prismaMongo } from '$lib/utils/database/noSqlDB';

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50X2lkIjoiMGU1MWQ3ZjctNmNkMi0xMWVmLTlmNDctMDQ0MjFhMDIzOGZhIiwiaWF0IjoxNzI2MDQ5MDMzLCJleHAiOjE3MjYxMzU0MzN9.2UtFzzdjXG63KIXj8s24zb6S-q8reQOCpM4gnJWhTlg
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50X2lkIjoiMGU1MWRhNDMtNmNkMi0xMWVmLTlmNDctMDQ0MjFhMDIzOGZhIiwiaWF0IjoxNzI2MDUwOTQ4LCJleHAiOjE3MjYxMzczNDh9.-bE9XJ0fYI6Eh10SZ0MB7SeUYmQVLQwQiVMumylRQoo
export const POST: RequestHandler = async ({ request, cookies }) => {
	try {
		const { tripID, checkpointID } = await request.json();
		checkMissingInput(tripID, checkpointID);
		const token = cookies.get('token');
		const uuid = decrypt(token as string);
		// console.log('uuid is save progression ' + uuid);
		// const checkpointDetail = await prismaMongo.checkpointNSQL.findFirst({
		//     where:{
		//         IDCheckpoint:checkpointID
		//     },select:{
		//         IDTrip : true,
		//     }
		// })
		//
		const tripDetail = await prismaMySQL.trip.findUnique({
			where: {
				IDTrip: tripID
			},
			select: {
				Booking: true,
				started: true,
				IDAccount: true,
				joiner: {
					select: {
						IDAccount: true
					}
				}
			}
		});

		if (
			tripDetail?.Booking === 'BI' || //can not set progress
			tripDetail?.started !== true || // not start ted
			(!tripDetail.joiner.some((e) => e.IDAccount === uuid) && // not join
				tripDetail?.IDAccount !== uuid) //not head
		) {
			return resFalse();
		}

		// return new Response(JSON.stringify(tripDetail), {
		//     status: 200,
		//     headers: {
		//         'Content-Type': 'application/json'
		//     }
		// });

		//source checkpoint
		const srcCheckpoint = await prismaMongo.checkpointNSQL.findFirst({
			where: {
				IDTrip: tripID,
				progress: {
					has: uuid
				}
			}
		});
		//deleate user in source checkpoint
		if (srcCheckpoint) {
			const updatedProgress = srcCheckpoint.progress.filter((id: string) => id !== uuid);

			await prismaMongo.checkpointNSQL.update({
				where: {
					id: srcCheckpoint.id
				},
				data: {
					progress: updatedProgress
				}
			});
		}

		await prismaMongo.checkpointNSQL.updateMany({
			where: {
				IDCheckpoint: checkpointID,
				IDTrip: tripID
			},
			data: {
				progress: {
					push: uuid as string
				}
			}
		});

		return resTrue();
	} catch (error) {
		return checkErrorAndRes(error);
	}
};

// DELETE FROM joiner WHERE IDAccount = '0e51d7f7-6cd2-11ef-9f47-04421a0238fa' and IDTrip = '267d09a5-6cd2-11ef-9f47-04421a0238fa'; my
// DELETE FROM joiner WHERE IDAccount = '0e51da43-6cd2-11ef-9f47-04421a0238fa' and IDTrip = '267d09a5-6cd2-11ef-9f47-04421a0238fa'; 10
