import { checkErrorAndRes, checkMissingInput } from "$lib/myAPI/customError";
import { prismaMySQL } from "$lib/utils/database/sqlDB";
import { decrypt } from "$lib/security/jwtUtils"
import type { RequestHandler } from "@sveltejs/kit";

async function getOrgDetail(originIDTrip: string): Promise<{ name: string; org: boolean; }> {
    const resData = await prismaMySQL.trip.findUnique({
        where: {
            IDTrip: originIDTrip
        },
        select: {
            account: {
                select: {
                    name: true,
                    Org: true
                }
            }
        }
    })
    return {
        name: resData?.account?.name ?? "",
        org: resData?.account?.Org ?? false
    }
}
export const POST: RequestHandler = async ({ request, cookies }) => {
    try {
        const { my } = await request.json();
        checkMissingInput(my)
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
                imageURL: true,
                Booking: true,
                IDOriginTrip: true,
                checkpoint: {
                    orderBy: {
                        OrderC: 'asc'
                    },
                    take: 1, // This ensures you get the checkpoint with the minimum OrderC
                    select: {
                        time: true
                    }
                },
                account: {
                    select: {
                        name: true,
                        Org: true
                    }
                },
                _count: {
                    select: {
                        checkpoint: {
                            where:{
                                type:"D"
                            }
                        }
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
                        imageURL: true,
                        Booking: true,
                        IDOriginTrip:true,
                        checkpoint: {
                            orderBy: {
                                OrderC: 'asc'
                            },
                            take: 1, // This ensures you get the checkpoint with the minimum OrderC
                            select: {
                                time: true
                            }
                        },
                        account: {
                            select: {
                                name: true,
                                Org: true
                            }
                        },
                        _count: {
                            select: {
                                checkpoint: true // Count of checkpoints
                            }
                        }
                    },

                }
            },
        });
        const joinTripsFilted = joinTrips.filter(e => (e.trip.Booking != "BI"))
        // console.log("join",joinTripsFilted)
        const formattedOwnTrips = await Promise.all(ownTrips.map(async trip => {
            let orgDetail;
            const book = (trip.Booking === "BE");
            if (book) {
                orgDetail = await getOrgDetail(trip.IDOriginTrip ?? "");
            }
            return {
                tripID: trip.IDTrip,
                name: trip.TripName,
                idOriginTrip:trip.IDOriginTrip,
                detail: trip.Detail,
                started: trip.started,
                imageURL: trip.imageURL,
                booking: trip.Booking,
                startDate: trip.checkpoint.length > 0 ? trip.checkpoint[0].time : null,
                by: (book) ? orgDetail?.name : trip.account?.name,
                org: (book) ? orgDetail?.org : trip.account?.Org,
                count: trip._count.checkpoint
            };
        }));
        const formattedJoinTrips = joinTripsFilted.map(trip => ({
            tripID: trip.IDTrip,
            idOriginTrip:trip.trip.IDOriginTrip,
            name: trip.trip.TripName,
            imageURL: trip.trip.imageURL,
            detail: trip.trip.Detail,
            started: trip.trip.started,
            booking: trip.trip.Booking,
            startDate: trip.trip.checkpoint.length > 0 ? trip.trip.checkpoint[0].time : null,
            by: trip.trip.account?.name,
            org: trip.trip.account?.Org,
            count: trip.trip._count.checkpoint
        }));
        // console.log(formattedJoinTrips)

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
        return checkErrorAndRes(error)
    }

};
