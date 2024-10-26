import { checkErrorAndRes, checkMissingInput } from '$lib/myAPI/customError';
import { prismaMySQL } from '$lib/utils/database/sqlDB';
import { decrypt } from '$lib/security/jwtUtils';
import type { RequestHandler } from '@sveltejs/kit';
import { resFalse, resTrue } from '$lib/myAPI/resTrueFalse';
import { getCurrentIsoDate, getTripID } from '$lib/myAPI/tripUtils';

export const POST: RequestHandler = async ({ request, cookies }) => {
	try {
		const { tripName, booking } = await request.json();
		checkMissingInput(tripName, booking);
		const token = cookies.get('token');
		const uuid = decrypt(token as string);
		const isoDate = getCurrentIsoDate();
		//console.log('uuid is ' + uuid);
		let newTripID = await getTripID();
		const tripDataBody = {
			IDTrip: newTripID as string,
			IDAccount: uuid as string,
			imageURL:
				'https://di-uploads-pod5.dealerinspire.com/millsmotorsbuickgmc/uploads/2016/08/road-trip-1500x750.jpg',
			TripName: tripName as string,
			Detail: '',
			Preparation: '',
			Booking: booking ? 'BI' : 'NM',
			createDate: isoDate as string,
			lastEdit: isoDate as string,
			private: true,
			maxJoiner: 10,
			started: false,
			count: 1
		};
		const userInfo = await prismaMySQL.account.findUnique({
			where: {
				IDAccount: uuid as string
			}
		});
		try {
			await prismaMySQL.trip.create({
				data: tripDataBody
			});

			return new Response(
				JSON.stringify({
					newTrip: {
						tripID: newTripID,
						tripIDOrigin: '',
						head: true,
						ownOrgTrip: userInfo?.Org,
						name: tripName,
						detail: '',
						startDate: '',
						preparation: '',
						booking: booking,
						org: userInfo?.Org,
						lastEdit: isoDate,
						private: true,
						maxJoiner: 10,
						started: false,
						me: true,
						unread: false,
						count: 1,
						join: true,
						imageURL:
							'https://di-uploads-pod5.dealerinspire.com/millsmotorsbuickgmc/uploads/2016/08/road-trip-1500x750.jpg',
						hasToken: true,
						checkpoint: []
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
			return resFalse();
		}
	} catch (error) {
		return checkErrorAndRes(error);
	}
};

// DELETE FROM checkpoint WHERE IDTrip = 'fbda33db-2c15-4cdb-86af-96a5b6f06cd6'; 10
// DELETE FROM joiner WHERE IDAccount = '0e51d7f7-6cd2-11ef-9f47-04421a0238fa' and IDTrip = '7c6ad9a0-6cd2-11ef-9f47-04421a0238fa'; 10
// DELETE FROM trip WHERE IDAccount = '0e51d7f7-6cd2-11ef-9f47-04421a0238fa' and IDTrip = 'fbda33db-2c15-4cdb-86af-96a5b6f06cd6'; my
