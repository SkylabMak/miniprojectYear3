import { checkErrorAndRes, checkMissingInput } from '$lib/myAPI/customError';
import { prismaMySQL } from '$lib/utils/database/sqlDB';
import { decrypt } from '$lib/security/jwtUtils';
import type { RequestHandler } from '@sveltejs/kit';
import { resFalse, resTrue } from '$lib/myAPI/resTrueFalse';
import { copyTrip } from '$lib/myAPI/tripUtils';

export const POST: RequestHandler = async ({ request, cookies }) => {
	try {
		const { tripID } = await request.json();
		checkMissingInput(tripID);
		const token = cookies.get('token');
		const uuid = decrypt(token as string);
		console.log('uuid is changeBooking ' + uuid);
		let trip = await prismaMySQL.trip.findUnique({
			where: {
				IDTrip: tripID
			},
			select: {
				joiner: {},
				IDTrip: true,
				imageURL: true,
				TripName: true,
				Detail: true,
				Preparation: true,
				maxJoiner: true,
				IDAccount: true,
				Booking: true
			}
		});

		if (trip?.IDAccount == uuid) {
			console.log('false own');
			return resFalse();
		}
		if (trip && trip.TripName) {
			trip.TripName = trip.TripName + '(copy)';
		}
		await copyTrip(trip, uuid as string, 1, false);
		return resTrue();
	} catch (error) {
		return checkErrorAndRes(error);
	}
};

// DELETE FROM joiner WHERE IDAccount = '0e51d7f7-6cd2-11ef-9f47-04421a0238fa' and IDTrip = '267d09a5-6cd2-11ef-9f47-04421a0238fa'; my
// UPDATE joiner  SET status = 'B' WHERE IDAccount = '0e51d9ad-6cd2-11ef-9f47-04421a0238fa' and IDTrip = '7c6ad9a0-6cd2-11ef-9f47-04421a0238fa';
