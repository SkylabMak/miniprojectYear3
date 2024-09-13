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
        const { tripID, locationName, time, detail, type,checkpointID, remove } = await request.json();
        const token = cookies.get('token');
        const uuid = decrypt(token as string)
        console.log("uuid is " + uuid)

        if ([tripID, locationName, time, detail, type,checkpointID, remove].some(val => val === null)) {
            return resCustomError(new CustomError(MISSING_INPUT))
        }
        const checkpointList = await prismaMySQL.trip.findUnique({
            where:{
                IDTrip:tripID
            },
            select:{
                checkpoint:true,
                IDAccount:true
            }
        })
        console.log("data VVVVV")
        console.log(checkpointList)
        if(checkpointList?.IDAccount !== uuid){
            return resFalse();
        }
        try {
            if (remove === true){
                await prismaMySQL.checkpoint.delete({
                    where:{
                        IDCheckpoint:checkpointID
                    }
                })

                await prismaMongo.checkpointNSQL.deleteMany({
                    where:{
                        IDCheckpoint:checkpointID,
                        IDTrip:tripID
                    }
                })
            }
            else{
                await prismaMySQL.checkpoint.update({
                    where:{
                        IDCheckpoint:checkpointID,
                        IDTrip:tripID
                    },
                    data:{
                        time:time,
                        locationName:locationName,
                        detail:detail,
                        type:type,
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