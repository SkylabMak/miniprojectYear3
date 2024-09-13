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
        const { tripID, iDcheckpoint, text } = await request.json();
        const token = cookies.get('token');
        const uuid = decrypt(token as string)
        console.log("uuid is " + uuid)

        if ([tripID, iDcheckpoint, text].some(val => val === null)) {
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
                joiner:{
                    select:{
                        IDAccount:true
                    }
                },
                checkpoint:{
                    where:{
                        IDCheckpoint:iDcheckpoint
                    },
                    select:{
                        OrderC:true
                    }
                }
            }
        })
        console.log(tripDetail)


        if (tripDetail === null) {
            console.log("false trip")
            return resFalse();
        }
        if (tripDetail.IDAccount !== uuid
            && (!tripDetail.joiner.some(e => e.IDAccount === uuid))) {
            console.log("false user")
            return resFalse();
        }
        if(tripDetail.checkpoint.length === 0){
            console.log("false checkpoint")
            return resFalse();
        }

        try {
            const newComment = {
                message: text as string,
                readed: [uuid as string],
                sender: uuid as string,
                time: isoDate
            }
            //update NM trip
            await prismaMongo.checkpointNSQL.updateMany({
                where: {
                    IDTrip: tripID,
                    IDCheckpoint: iDcheckpoint
                },
                data: {
                    Comments: {
                        push: newComment
                    }
                }
            })

            //update BI from BE trip

            if (tripDetail.Booking === 'BE') {
                const checkpointIDInBI = (await prismaMySQL.trip.findUnique({
                    where: {
                        IDTrip: tripDetail.IDOriginTrip as string
                    },
                    select: {
                        checkpoint: {
                            where: {
                                OrderC: tripDetail.checkpoint[0].OrderC
                            },
                            select: {
                                IDCheckpoint: true
                            }
                        }
                    }
                }))?.checkpoint[0].IDCheckpoint
                await prismaMongo.checkpointNSQL.updateMany({
                    where: {
                        IDCheckpoint: checkpointIDInBI
                    }, data: {
                        Comments: {
                            push: newComment
                        }
                    }
                })
            }
            return resTrue()


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