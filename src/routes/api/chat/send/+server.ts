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
        const { tripID, text } = await request.json();
        const token = cookies.get('token');
        const uuid = decrypt(token as string)
        console.log("uuid is " + uuid)

        if ([tripID, text].some(val => val === null)) {
            return resCustomError(new CustomError(MISSING_INPUT))
        }

        const custTrip = await prismaMySQL.trip.findUnique({
            where: {
                IDTrip: tripID
            },
            select: {
                IDAccount: true,
                IDOriginTrip:true
            }
        })

        const restTrip = await prismaMySQL.trip.findFirst({
            where: {
                IDTrip: custTrip?.IDOriginTrip as string
            },
            select: {
                IDAccount: true
            }
        })



        if (restTrip === null) {
            console.log("false trip")
            return resFalse();
        }
        if (restTrip.IDAccount !== uuid
            && custTrip?.IDAccount !== uuid) {
                console.log("flase user")
            return resFalse();
        }

        const senderUser :boolean = (custTrip?.IDAccount === uuid)

        try {
            const newChat = {
                message: text as string,
                orgReaded: !senderUser,
                readed: senderUser,
                senderUser: senderUser,
                time : isoDate
            }
            await prismaMongo.orgChat.updateMany({
                where: {
                    IDAccount: custTrip?.IDAccount as string,
                    IDTrip: tripID
                },
                data: {
                    Chat: {
                        push: newChat
                    }
                }
            })
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