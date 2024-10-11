import { checkErrorAndRes } from '$lib/myAPI/customError';
import { prismaMySQL } from '$lib/utils/database/sqlDB';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { Text } = await request.json();

		const trips = await prismaMySQL.trip.findMany({
			where: {
				private: false,
				...(Text
					? {
							// If Text is not empty, apply the TripName condition
							TripName: {
								contains: Text
							}
						}
					: {}) // If Text is empty, do not include the TripName condition
			},
			select: {
				IDTrip: true,
				TripName: true,
				Detail: true,
				imageURL: true,
				count: true,
				maxJoiner: true,
				account: {
					select: {
						name: true,
						Org: true
					}
				},
				checkpoint: {
					orderBy: {
						time: 'asc' // Sorting by 'time' in ascending order
					},
					take: 1, // This ensures you get the checkpoint with the minimum time
					select: {
						time: true
					}
				},
				_count: {
					select: {
						checkpoint: {
							where: {
								type: 'D'
							}
						}
					}
				}
			}
		});

		const formattedTrips = trips.map((trip) => ({
			tripID: trip.IDTrip,
			name: trip.TripName,
			detail: trip.Detail,
			imageURL: trip.imageURL,
			org: trip.account?.Org,
			by: trip.account?.name,
			startDate: trip.checkpoint.length > 0 ? trip.checkpoint[0].time : '',
			count: trip._count.checkpoint,
			people: trip.count,
			peopleMax: trip.maxJoiner
		}));
		// console.log("search => "+formattedTrips)
		return new Response(JSON.stringify({ Trip: formattedTrips }), {
			status: 200,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	} catch (error) {
		return checkErrorAndRes(error);
	}
};
