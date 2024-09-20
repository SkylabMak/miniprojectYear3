import { checkErrorAndRes } from "$lib/myAPI/customError";
import { prismaMySQL } from "$lib/utils/database/sqlDB";
import type { RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ request }) => {
    try {
        const { Text } = await request.json();

    const trips = await prismaMySQL.trip.findMany({
        where: {
            private: false,
            ...(Text ? { // If Text is not empty, apply the TripName condition
                TripName: {
                    contains: Text,
                }
            } : {}) // If Text is empty, do not include the TripName condition
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
    // console.log("search => "+formattedTrips)
    return new Response(JSON.stringify({Trip:formattedTrips}), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    });
    } catch (error) {
        return checkErrorAndRes(error)
    }
    
};
