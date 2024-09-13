import { CustomError, resCustomError } from "$lib/myAPI/customError";
import { prismaMySQL } from "$lib/utils/database/sqlDB";
import { decrypt } from "$lib/security/jwtUtils";
import type { RequestHandler } from "@sveltejs/kit";
import { resFalse, resTrue } from "$lib/myAPI/resTrueFalse";
import { getTripID } from "$lib/myAPI/tripUtils";
import { prismaMongo } from "$lib/utils/database/noSqlDB";

export const POST: RequestHandler = async ({ request, cookies }) => {
    try {
        const { tripID, tripName, detail, booking, preparation, maxJoiner, tripPrivate } = await request.json();
        const token = cookies.get('token');
        const uuid = decrypt(token as string)
        const isoDate = new Date().toISOString();
        console.log("uuid is " + uuid)
        try {
            const oldTrip = await prismaMySQL.trip.findUnique({
                where: {
                    IDTrip: tripID
                },
                select: {
                    Booking: true,
                    IDAccount:true
                }
            })
            if(oldTrip?.IDAccount !== uuid){
                return resFalse()
            }
            await prismaMySQL.trip.update({
                where: {
                    IDTrip: tripID as string
                }, data: {
                    TripName: tripName,
                    Detail: detail,
                    Booking: booking,
                    Preparation: preparation,
                    maxJoiner: maxJoiner,
                    private: tripPrivate,
                    lastEdit: isoDate
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