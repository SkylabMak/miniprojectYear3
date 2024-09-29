import { prismaMySQL } from "$lib/utils/database/sqlDB";
import { decrypt } from "$lib/security/jwtUtils";
import type { RequestHandler } from "@sveltejs/kit";
import { resFalse} from "$lib/myAPI/resTrueFalse";
import { prismaMongo } from "$lib/utils/database/noSqlDB";
import { getLatestChatFromlist } from "$lib/myAPI/chatUtils";

export const POST: RequestHandler = async ({ request, cookies }) => {
    try {
        const token = cookies.get('token');
        const uuid = decrypt(token as string)
        console.log("uuid is " + uuid)

        const allTrip = await prismaMySQL.trip.findMany({
            where: {
                IDAccount: uuid as string
            }, select: {
                IDTrip: true,
                TripName:true
            }
        })

        const allMessage = await Promise.all(
            allTrip.map(async (e) => {
                const orgChats = await prismaMongo.orgChat.findMany({
                    where: {
                        IDTrip: e.IDTrip
                    }
                });
        
                return orgChats.map(orgChat => ({
                    ...orgChat, // Spread the orgChat properties
                    tripName: e.TripName 
                }));
            })
        );

        const flattenedAllMessage = allMessage.flat();

        const messageWithTrip = await Promise.all(
            flattenedAllMessage.map(async m => {
                const tripDetail = await prismaMySQL.trip.findFirst({
                        where: {
                            IDOriginTrip: m.IDTrip,
                            IDAccount:m.IDAccount
                        },
                        select: {
                            IDAccount: true,
                            IDTrip: true,
                            IDOriginTrip: true,
                            TripName:true,
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

                const acccount = await prismaMySQL.account.findUnique({
                    where:{
                        IDAccount:m.IDAccount
                    }
                })
                const bookStatus = await prismaMySQL.joiner.findUnique({
                    where: {
                        IDTrip_IDAccount: {
                            IDTrip: m.IDTrip as string,
                            IDAccount: m.IDAccount as string,
                        },
                    }, select: {
                        status: true
                    }
                })
                // console.log(tripDetail?.IDTrip+" date is " + tripDetail?.checkpoint?.[0]?.time ?? "")
                const latestChat = await getLatestChatFromlist(m.Chat??null)
                return {
                    IDTrip: m.IDTrip,
                    IDTripCust:tripDetail?.IDTrip,
                    IDAccount: m.IDAccount,
                    tripname:m.tripName,
                    IDOriginTrip:m.IDTrip,
                    Lastmessage: latestChat?.message ?? "",
                    readed: latestChat?.orgReaded ?? "",
                    custImgUrl: acccount?.imgURL,
                    custName: acccount?.name ?? "",
                    bookDone: bookStatus?.status??"",
                    startTime: tripDetail?.checkpoint?.[0]?.time ?? ""
                }
            })
        )


        return new Response(JSON.stringify(messageWithTrip), {
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