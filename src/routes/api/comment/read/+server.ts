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
        const { tripID, iDcheckpoint } = await request.json();
        const token = cookies.get('token');
        const uuid = decrypt(token as string)
        console.log("uuid is " + uuid)

        if ([tripID, iDcheckpoint].some(val => val === null)) {
            return resCustomError(new CustomError(MISSING_INPUT))
        }

        const tripDetail = await prismaMySQL.trip.findUnique({
            where: {
                IDTrip: tripID
            },
            select: {
                IDAccount: true,
                IDOriginTrip: true,
                Booking: true,
                joiner: {
                    select: {
                        IDAccount: true
                    }
                }
            }
        })
        const checkpointDetail = await prismaMongo.checkpointNSQL.findFirst({
            where: {
                IDCheckpoint: iDcheckpoint
            },
        })
        // console.log(tripDetail)
        const joiner: boolean = !((tripDetail?.IDAccount !== uuid
            && (!tripDetail?.joiner.some(e => e.IDAccount === uuid))))


        if (tripDetail === null) {
            console.log("false trip")
            return resFalse();
        }
        if (checkpointDetail === null) {
            console.log("false checkpoint")
            return resFalse();
        }

        try {
            //update reader
            console.log("joiner " + joiner)
            if (joiner) {

                const updatedComments = checkpointDetail?.Comments.map(user => {
                    if (!(user.readed.includes(uuid as string))) {
                        user.readed.push(uuid as string)
                    }
                    return user;
                });
                await prismaMongo.checkpointNSQL.updateMany({
                    where: {
                        IDTrip: tripID,
                        IDCheckpoint: iDcheckpoint
                    },
                    data: {
                        Comments: updatedComments
                    }
                })
            }
            const result = await Promise.all(checkpointDetail.Comments.map(async e => {
                const userInfo = await prismaMySQL.account.findUnique({
                    where: {
                        IDAccount: e.sender
                    },
                });
                return {
                    text: e.message,
                    name: userInfo?.name,
                    imgUrl: userInfo?.imgURL,
                    readed: e.readed.length
                };
            }));

            console.log(result);
            return new Response(JSON.stringify({
                comments: result

            }), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
            });




        } catch (error) {
            console.log(error)
            return resFalse()
        }

    } catch (error) {
        if (error instanceof CustomError) {
            return resCustomError(error as CustomError)
        }
        else {
            throw error
        }
    }

};


// DELETE FROM checkpoint WHERE IDTrip = 'fbda33db-2c15-4cdb-86af-96a5b6f06cd6'; 10
// DELETE FROM joiner WHERE IDAccount = '0e51d7f7-6cd2-11ef-9f47-04421a0238fa' and IDTrip = '7c6ad9a0-6cd2-11ef-9f47-04421a0238fa'; 10
// DELETE FROM trip WHERE IDAccount = '0e51d7f7-6cd2-11ef-9f47-04421a0238fa' and IDTrip = 'fbda33db-2c15-4cdb-86af-96a5b6f06cd6'; my