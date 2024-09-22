import { checkErrorAndRes, checkMissingInput } from "$lib/myAPI/customError";
import { prismaMongo } from "$lib/utils/database/noSqlDB";
import { prismaMySQL } from "$lib/utils/database/sqlDB";
import { decrypt } from "$lib/security/jwtUtils"
import type { RequestHandler } from "@sveltejs/kit";
import { resFalse, resTrue } from "$lib/myAPI/resTrueFalse";
import { deleateBETrip } from "$lib/myAPI/tripUtils";

export const POST: RequestHandler = async ({ request, cookies }) => {
    try {
        const { tripID, book, IDAccount } = await request.json();
        checkMissingInput(tripID, book, IDAccount )
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
                TripName: true,
                maxJoiner: true,
                IDAccount: true

            }
        })
        if (trip?.IDAccount != uuid) {
            console.log("false not own")
            return resFalse()
        }
        // console.log("")
        if (book === true) {
            await prismaMySQL.joiner.update({
                where: {
                    IDTrip_IDAccount: { //compound unique key
                        IDTrip: tripID as string,
                        IDAccount: IDAccount as string,
                    },
                },
                data: {
                    status: 'D'
                }
            })
        }
        else if (book === false) {
            // deleate trip
            await deleateBETrip(tripID,IDAccount)
        }
        else {
            return resFalse()
        }


        return resTrue()
    } catch (error) {
        return checkErrorAndRes(error)
    }

};


// DELETE FROM joiner WHERE IDAccount = '0e51d7f7-6cd2-11ef-9f47-04421a0238fa' and IDTrip = '267d09a5-6cd2-11ef-9f47-04421a0238fa'; my
// UPDATE joiner  SET status = 'B' WHERE IDAccount = '0e51d9ad-6cd2-11ef-9f47-04421a0238fa' and IDTrip = '7c6ad9a0-6cd2-11ef-9f47-04421a0238fa'; 