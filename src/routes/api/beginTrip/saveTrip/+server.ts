import { CustomError, resCustomError } from "$lib/myAPI/customError";
import { prismaMongo } from "$lib/utils/database/noSqlDB";
import { prismaMySQL } from "$lib/utils/database/sqlDB";
import { decrypt } from "$lib/security/jwtUtils"
import type { RequestHandler } from "@sveltejs/kit";
import { resFalse, resTrue } from "$lib/myAPI/resTrueFalse";
import { copyTrip } from "$lib/myAPI/tripUtils";

export const POST: RequestHandler = async ({ request, cookies }) => {
    try {
        const { tripID} = await request.json();
        const token = cookies.get('token');
        const uuid = decrypt(token as string)
        console.log("uuid is changeBooking " + uuid)
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

        if (trip?.IDAccount == uuid) {
            console.log("false own")
            return resFalse()
        } 
        await copyTrip(trip, uuid as string, 1, false);
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


// DELETE FROM joiner WHERE IDAccount = '0e51d7f7-6cd2-11ef-9f47-04421a0238fa' and IDTrip = '267d09a5-6cd2-11ef-9f47-04421a0238fa'; my
// UPDATE joiner  SET status = 'B' WHERE IDAccount = '0e51d9ad-6cd2-11ef-9f47-04421a0238fa' and IDTrip = '7c6ad9a0-6cd2-11ef-9f47-04421a0238fa'; 