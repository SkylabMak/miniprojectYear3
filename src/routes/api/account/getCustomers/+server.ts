import { CustomError, resCustomError } from "$lib/myAPI/customError";
import { prismaMySQL } from "$lib/utils/database/sqlDB";
import { decrypt } from "$lib/security/jwtUtils";
import type { RequestHandler } from "@sveltejs/kit";
import { resFalse, resTrue } from "$lib/myAPI/resTrueFalse";
import { getCheckpointID, getTripID, isoDate } from "$lib/myAPI/tripUtils";
import { prismaMongo } from "$lib/utils/database/noSqlDB";
import { MISSING_INPUT } from "$lib/constants/errorCodes";

export const POST: RequestHandler = async ({ request, cookies }) => {
    try {
        const token = cookies.get('token');
        const uuid = decrypt(token as string)
        console.log("uuid is " + uuid)

        const allTrip = await prismaMySQL.trip.findMany({
            where: {
                IDAccount: uuid as string
            }, select: {
                IDTrip: true
            }
        })
        console.log(isoDate)
        let allCustTrip = [];
        allCustTrip = await Promise.all(
            allTrip.map(async (e) => {
                return prismaMySQL.trip.findMany({
                    where: {
                        IDOriginTrip: e.IDTrip
                    },
                    select: {
                        account: true,
                        IDAccount: true,
                        IDTrip: true,
                        IDOriginTrip: true,
                        checkpoint: {
                            orderBy: {
                                OrderC: 'asc'
                            },
                            take: 1,
                            select: {
                                time: true
                            }
                        },
                    }
                });
            })
        );

        const flattenedCustTrip = allCustTrip.flat();

        const updatedTrips = await Promise.all(
            flattenedCustTrip.map(async trip => {
                const chat = await prismaMongo.orgChat.findFirst({
                    where: {
                        IDTrip: trip.IDTrip,
                        IDAccount: trip.IDAccount as string
                    },
                    select: {
                        Chat: true
                    }
                });

                const bookStatus = await prismaMySQL.joiner.findUnique({
                    where: {
                        IDTrip_IDAccount: {
                            IDTrip: trip.IDOriginTrip as string,
                            IDAccount: trip.IDAccount as string,
                        },
                    }, select: {
                        status: true
                    }
                })
                console.log("bookStatus is " + bookStatus)
                const latestChat = chat?.Chat.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())[0];
                return {
                    IDTrip: trip.IDTrip,
                    IDAccount: trip.IDAccount,
                    Lastmessage: latestChat?.message ?? "",
                    readed: latestChat?.orgReaded ?? "",
                    custImgUrl: trip.account?.imgURL,
                    custName: trip.account?.name ?? "",
                    bookDone: bookStatus?.status,
                    startTime: trip.checkpoint?.[0]?.time ?? ""
                }
            })
        )


        return new Response(JSON.stringify(updatedTrips), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });


    } catch (error) {
        console.log(error)
        return resFalse()
    }



};


// DELETE FROM checkpoint WHERE IDTrip = 'fbda33db-2c15-4cdb-86af-96a5b6f06cd6'; 10
// DELETE FROM joiner WHERE IDAccount = '0e51d7f7-6cd2-11ef-9f47-04421a0238fa' and IDTrip = '7c6ad9a0-6cd2-11ef-9f47-04421a0238fa'; 10
// DELETE FROM trip WHERE IDAccount = '0e51d7f7-6cd2-11ef-9f47-04421a0238fa' and IDTrip = 'fbda33db-2c15-4cdb-86af-96a5b6f06cd6'; my