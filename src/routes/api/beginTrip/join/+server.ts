import { checkErrorAndRes, checkMissingInput} from "$lib/myAPI/customError";
import { prismaMySQL } from "$lib/utils/database/sqlDB";
import { decrypt } from "$lib/security/jwtUtils"
import type { RequestHandler } from "@sveltejs/kit";
import { resFalse, resTrue } from "$lib/myAPI/resTrueFalse";

export const POST: RequestHandler = async ({ request, cookies }) => {
    try {
        const { tripID } = await request.json();
        checkMissingInput(tripID)
        const token = cookies.get('token');
        const uuid = decrypt(token as string)
        console.log("uuid is join "+uuid)
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
        if((trip?.joiner.length??0)+1 >= (trip?.maxJoiner??10)){
            return resFalse()
        }
        else if(trip?.joiner.find(e => e.IDAccount == uuid)){
            return resFalse()
        }
        else if (trip?.IDAccount == uuid){
            return resFalse()
        }
        // console.log("")
        else{
            await prismaMySQL.joiner.create({
                data:{
                    IDTrip:tripID,
                    IDAccount:uuid as string,
                    type:'J',
                    status:'D',
                }
            })

            await prismaMySQL.trip.update({
                where:{
                    IDTrip:tripID
                },
                data:{
                    count: {
                        increment:1
                    }
                }
            })
        }
        

        return resTrue()
    } catch (error) {
       return checkErrorAndRes(error)
    }

};


// DELETE FROM joiner WHERE IDAccount = '0e51d7f7-6cd2-11ef-9f47-04421a0238fa' and IDTrip = '267d09a5-6cd2-11ef-9f47-04421a0238fa'; my
// DELETE FROM joiner WHERE IDAccount = '0e51da43-6cd2-11ef-9f47-04421a0238fa' and IDTrip = '267d09a5-6cd2-11ef-9f47-04421a0238fa'; 10
