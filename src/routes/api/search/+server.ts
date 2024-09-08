import { prismaMySQL } from "$lib/utils/database/sqlDB";
import type { RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ request }) => {
    const { Text } = await request.json();

    const trips = await prismaMySQL.trip.findMany({
        where: {
            TripName: {
                contains: Text,
            },
            private:false
        },
        select: {
            IDTrip: true,
            TripName: true,
            Detail: true,
            checkpoint: {
                where: {
                    OrderC: 1   // Filter where OrderC is 1
                },
                select: {
                    time: true
                }
            }
        }
    });

    const formattedTrips = trips.map(trip => ({
        tripID: trip.IDTrip,
        name: trip.TripName,
        detail: trip.Detail,
        startDate: trip.checkpoint.length > 0 ? trip.checkpoint[0].time : null
    }));

    return new Response(JSON.stringify({Trip:formattedTrips}), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    });
};
