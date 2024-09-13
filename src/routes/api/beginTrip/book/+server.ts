import { CustomError, resCustomError } from "$lib/myAPI/customError";
import { prismaMongo } from "$lib/utils/database/noSqlDB";
import { prismaMySQL } from "$lib/utils/database/sqlDB";
import { decrypt } from "$lib/security/jwtUtils";
import { getUUID } from "$lib/utils/uuidUtils";
import type { RequestHandler } from "@sveltejs/kit";
import { resFalse, resTrue } from "$lib/myAPI/resTrueFalse";
import { copyTrip } from "$lib/myAPI/tripUtils";

export const POST: RequestHandler = async ({ request, cookies }) => {
    try {
        const { tripID, count } = await request.json();
        const token = cookies.get('token');
        const uuid = decrypt(token as string)
        console.log("uuid is " + uuid)
        const trip = await prismaMySQL.trip.findFirst({
            where: {
                IDTrip: tripID
            },
            select: {
                joiner: {

                },
                IDTrip:true,
                TripName: true,
                Detail: true,
                Preparation: true,
                maxJoiner: true,
                IDAccount: true,
                Booking: true

            }
        })
        if ((trip?.joiner.length ?? 0) >= (trip?.maxJoiner ?? 10)) {
            console.log("false max")
            return resFalse()
        }
        else if (trip?.joiner.find(e => e.IDAccount == uuid)) {
            console.log("false joined")
            return resFalse()
        }
        else if (trip?.IDAccount == uuid) {
            console.log("false own")
            return resFalse()
        }
        else if (trip?.Booking != 'BI') {
            console.log("false trip")
            return resFalse()
        }
        else {
            await prismaMySQL.joiner.create({
                data: {
                    IDTrip: tripID,
                    IDAccount: uuid as string,
                    type: 'B',
                    status: 'B',
                }
            })
        }

        //copy
        copyTrip(trip,uuid as string,count,true)


        return resTrue()
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