import { resFalse, resTrue } from "$lib/myAPI/resTrueFalse";
import { CustomError, resCustomError } from "$lib/myAPI/customError";
import { prismaMySQL } from "$lib/utils/database/sqlDB";
import { decrypt } from "$lib/security/jwtUtils"
import type { RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ request, cookies }) => {
    try {
        const { tripID,start } = await request.json();
        const token = cookies.get('token');
        const uuid = decrypt(token as string)
        console.log("uuid is start "+uuid)
        const trip = await prismaMySQL.trip.findFirst({
            where:{
                IDTrip : tripID
            },
            select:{
                joiner:{

                },
                TripName:true,
                maxJoiner:true,
                IDAccount:true

            }
        })
        if (trip?.IDAccount != uuid){
            return resFalse()
        }
        // console.log("")
        else{
            await prismaMySQL.trip.update({
                where:{
                    IDTrip : tripID
                },
                data:{
                    started : start
                }
            })
        }
        

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
// DELETE FROM joiner WHERE IDAccount = '0e51da43-6cd2-11ef-9f47-04421a0238fa' and IDTrip = '267d09a5-6cd2-11ef-9f47-04421a0238fa'; 10
