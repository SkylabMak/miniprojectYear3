import { CustomError, resCustomError } from "$lib/myAPI/customError";
import { prismaMySQL } from "$lib/utils/database/sqlDB";
import { decrypt } from "$lib/security/jwtUtils"
import type { RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ request, cookies }) => {
    try {
        const { my } = await request.json();
        const token = cookies.get('token');
        const uuid = decrypt(token as string)
        const ownTrips = await prismaMySQL.trip.findMany({
            where: {
                IDAccount: uuid
            },
            select: {
                IDTrip: true,
                TripName: true,
                Detail: true,
                started: true,
                checkpoint: {
                    where: {
                        OrderC: 1
                    },
                    select: {
                        time: true
                    }
                }
            }
        });

        const joinTrips = await prismaMySQL.joiner.findMany({
            where: {
                IDAccount: uuid as string
            },
            select: {
                IDTrip: true,
                trip: {
                    select: {
                        IDTrip: true,
                        TripName: true,
                        Detail: true,
                        started: true,
                        checkpoint: {
                            where: {
                                OrderC: 1   // Filter where OrderC is 1
                            },
                            select: {
                                time: true
                            }
                        }
                    }
                }
            },
        });

        const formattedOwnTrips = ownTrips.map(trip => ({
            tripID: trip.IDTrip,
            name: trip.TripName,
            detail: trip.Detail,
            started: trip.started,
            startDate: trip.checkpoint.length > 0 ? trip.checkpoint[0].time : null
        }));
        const formattedJoinTrips = joinTrips.map(trip => ({
            tripID: trip.IDTrip,
            name: trip.trip.TripName,
            detail: trip.trip.Detail,
            started: trip.trip.started,
            startDate: trip.trip.checkpoint.length > 0 ? trip.trip.checkpoint[0].time : null
        }));

        const combinedTrips = [...formattedOwnTrips, ...formattedJoinTrips];
        let uniqueTrips = Array.from(
            new Map(combinedTrips.map(trip => [trip.tripID, trip])).values()
        );

        if ((my as boolean) == false) {
            uniqueTrips = uniqueTrips.filter(e => e.started == true)
        }
        return new Response(JSON.stringify({ Trip: uniqueTrips }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        if (error instanceof CustomError) {
            return resCustomError(error as CustomError)
        }
        else {
            throw error
        }
    }

};
