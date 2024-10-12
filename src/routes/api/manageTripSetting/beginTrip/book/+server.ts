import { checkErrorAndRes, checkMissingInput } from '$lib/myAPI/customError';
import { prismaMySQL } from '$lib/utils/database/sqlDB';
import { decrypt } from '$lib/security/jwtUtils';
import type { RequestHandler } from '@sveltejs/kit';
import { resFalse, resTrue } from '$lib/myAPI/resTrueFalse';
import { copyTrip, deleateBETrip } from '$lib/myAPI/tripUtils';

export const POST: RequestHandler = async ({ request, cookies }) => {
	try {
		const { tripID, count, book } = await request.json();
		checkMissingInput(tripID, count, book);
		const token = cookies.get('token');
		const uuid = decrypt(token as string);
		console.log('uuid is ' + uuid);
		const trip = await prismaMySQL.trip.findFirst({
			where: {
				IDTrip: tripID
			},
			select: {
				joiner: {},
				IDTrip: true,
				TripName: true,
				Detail: true,
				Preparation: true,
				maxJoiner: true,
				IDAccount: true,
				Booking: true,
				count: true,
				imageURL:true
			}
		});
		if ((count + trip?.count > (trip?.maxJoiner ?? 10)) && book) {
			console.log('false max');
			return resFalse();
		} else if (trip?.joiner.find((e) => e.IDAccount == uuid) && book) {
			console.log('false joined');
			return resFalse();
		} else if (trip?.IDAccount == uuid) {
			console.log('false own');
			return resFalse();
		} else if (trip?.Booking != 'BI') {
			console.log('false trip');
			return resFalse();
		} else if (book === false) {
			const joinDetail = await prismaMySQL.joiner.findUnique({
				where: {
					IDTrip_IDAccount: {
						IDTrip: tripID as string,
						IDAccount: uuid as string
					}
				},
				select: {
					type: true,
					status: true
				}
			});
			if (joinDetail?.type === 'B' && joinDetail?.status === 'D') {
				return resFalse();
			}
			await prismaMySQL.trip.update({
				where: {
					IDTrip: tripID
				},
				data: {
					count: {
						decrement: count
					}
				}
			});
			// deleate trip
			console.log('try to deleate');
			await deleateBETrip(tripID, uuid as string);
		} else {
			await prismaMySQL.joiner.create({
				data: {
					IDTrip: tripID,
					IDAccount: uuid as string,
					type: 'B',
					status: 'B'
				}
			});
			await prismaMySQL.trip.update({
				where: {
					IDTrip: tripID
				},
				data: {
					count: {
						increment: count
					}
				}
			});
			//copy
			await copyTrip(trip, uuid as string, count, true);
		}

		return resTrue();
	} catch (error) {
		return checkErrorAndRes(error);
	}
};

// DELETE FROM checkpoint WHERE IDTrip = 'fbda33db-2c15-4cdb-86af-96a5b6f06cd6'; 10
// DELETE FROM joiner WHERE IDAccount = '0e51d7f7-6cd2-11ef-9f47-04421a0238fa' and IDTrip = '7c6ad9a0-6cd2-11ef-9f47-04421a0238fa'; 10
// DELETE FROM trip WHERE IDAccount = '0e51d7f7-6cd2-11ef-9f47-04421a0238fa' and IDTrip = 'fbda33db-2c15-4cdb-86af-96a5b6f06cd6'; my
