import { checkErrorAndRes, checkMissingInput } from '$lib/myAPI/customError';
import { prismaMongo } from '$lib/utils/database/noSqlDB';
import { prismaMySQL } from '$lib/utils/database/sqlDB';
import { decrypt } from '$lib/security/jwtUtils';
import type { RequestHandler } from '@sveltejs/kit';
import { resFalse, resTrue } from '$lib/myAPI/resTrueFalse';
import { deleateBETrip } from '$lib/myAPI/tripUtils';

export const POST: RequestHandler = async ({ request, cookies }) => {
	try {
		console.log('change booking is run ');
		const { tripID, book, IDAccount } = await request.json();
		//tripID is rest trip
		checkMissingInput(tripID, book, IDAccount);
		const token = cookies.get('token');
		console.log('token is ', token);
		const uuid = decrypt(token as string);
		let countToRemove = 0;
		// console.log('uuid is changeBooking ' + uuid);
		// console.log("IDAccount : ",IDAccount)
		// console.log("tripID",tripID)
		if (IDAccount != '') {
			const trip = await prismaMySQL.trip.findUnique({
				where: {
					IDTrip: tripID
				},
				select: {
					TripName: true,
					maxJoiner: true,
					IDAccount: true
				}
			});
			if (trip?.IDAccount != uuid) {
				console.log('false not own');
				return resFalse();
			}
			countToRemove =
				(
					await prismaMySQL.trip.findFirst({
						where: {
							IDOriginTrip: tripID,
							IDAccount: IDAccount as string,
							Booking: 'BE'
						}
					})
				)?.maxJoiner ?? 0;
		} else {
			const joinDetail = await prismaMySQL.joiner.findUnique({
				where: {
					IDTrip_IDAccount: {
						IDAccount: uuid as string,
						IDTrip: tripID
					}
				}
			});
			if (joinDetail == null) {
				console.log('false not join');
				return resFalse();
			}
			countToRemove =
				(
					await prismaMySQL.trip.findFirst({
						where: {
							IDOriginTrip: tripID,
							IDAccount: uuid as string,
							Booking: 'BE'
						}
					})
				)?.maxJoiner ?? 0;
		}

		// console.log(countToRemove);
		// console.log("")
		if (book === true) {
			// console.log('bookDone Trip');
			await prismaMySQL.joiner.update({
				where: {
					IDTrip_IDAccount: {
						//compound unique key
						IDTrip: tripID as string,
						IDAccount: IDAccount != '' ? IDAccount : (uuid as string)
					}
				},
				data: {
					status: 'D'
				}
			});
		} else if (book === false) {
			// deleate trip
			// console.log('deleate Trip');
			await deleateBETrip(tripID, IDAccount != '' ? IDAccount : (uuid as string));

			await prismaMySQL.trip.update({
				where: {
					IDTrip: tripID
				},
				data: {
					count: {
						decrement: countToRemove
					}
				}
			});
		} else {
			return resFalse();
		}

		return resTrue();
	} catch (error) {
		return checkErrorAndRes(error);
	}
};

// DELETE FROM joiner WHERE IDAccount = '0e51d7f7-6cd2-11ef-9f47-04421a0238fa' and IDTrip = '267d09a5-6cd2-11ef-9f47-04421a0238fa'; my
// UPDATE joiner  SET status = 'B' WHERE IDAccount = '0e51d9ad-6cd2-11ef-9f47-04421a0238fa' and IDTrip = '7c6ad9a0-6cd2-11ef-9f47-04421a0238fa';
