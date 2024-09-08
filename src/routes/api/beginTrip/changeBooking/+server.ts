import { CustomError, resCustomError } from "$lib/utils/customError";
import { prismaMongo } from "$lib/utils/database/noSqlDB";
import { prismaMySQL } from "$lib/utils/database/sqlDB";
import { decrypt } from "$lib/utils/jwtUtils";
import type { RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ request, cookies }) => {
    try {
        const { tripID, book, IDAccount } = await request.json();
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
            // sql deleate 
            await prismaMySQL.joiner.delete({
                where: {
                    IDTrip_IDAccount: {
                        IDTrip: tripID as string,
                        IDAccount: IDAccount as string,
                    },
                },
            })
            const userIDTrip = await prismaMySQL.trip.findFirst({
                where: {
                    IDOriginTrip: tripID,
                    IDAccount: IDAccount,
                    Booking: 'BE'
                },
                select: {
                    IDTrip: true
                }
            })
            console.log("userIDTrip is "+userIDTrip?.IDTrip)
            await prismaMySQL.checkpoint.deleteMany({
                where: {
                    IDTrip: userIDTrip?.IDTrip
                }
            });
            await prismaMySQL.trip.delete({
                where: {
                    IDTrip: userIDTrip?.IDTrip
                }
            })
 
            //No sql deleate 
            await prismaMongo.orgChat.deleteMany({
                where:{
                    IDTrip:tripID,
                    IDAccount:IDAccount
                }
            })

            await prismaMongo.checkpointNSQL.deleteMany({
                where:{
                    IDTrip:userIDTrip?.IDTrip
                }
            })
        }
        else {
            return resFalse()
        }


        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        if (error instanceof CustomError) {
            return resCustomError(error as CustomError)
        }
        else {
            throw error
        }
    }

};

async function resFalse() {
    return new Response(JSON.stringify({ success: false }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}
// DELETE FROM joiner WHERE IDAccount = '0e51d7f7-6cd2-11ef-9f47-04421a0238fa' and IDTrip = '267d09a5-6cd2-11ef-9f47-04421a0238fa'; my
// UPDATE joiner  SET status = 'B' WHERE IDAccount = '0e51d9ad-6cd2-11ef-9f47-04421a0238fa' and IDTrip = '7c6ad9a0-6cd2-11ef-9f47-04421a0238fa'; 