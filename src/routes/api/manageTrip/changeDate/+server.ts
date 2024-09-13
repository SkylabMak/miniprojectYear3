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
        const { tripID, date } = await request.json();
        const token = cookies.get('token');
        const uuid = decrypt(token as string)
        console.log("uuid is " + uuid)

        if ([tripID, date].some(val => val === null)) {
            return resCustomError(new CustomError(MISSING_INPUT))
        }
        const checkpointList = await prismaMySQL.trip.findUnique({
            where: {
                IDTrip: tripID,
            },
            select: {
                checkpoint: {
                    // where: {
                    //     time: {
                    //         not: null,
                    //     },
                    // },
                    // select: {
                    //     IDCheckpoint: true,
                    //     time: true,
                    //     locationName: true,
                    //     detail: true,
                    //     type: true,
                    // },
                },
                IDAccount: true,
                IDOriginTrip:true,
            },
        });

        const restOrg = await prismaMySQL.trip.findUnique({
            where: { 
                IDTrip: checkpointList?.IDOriginTrip ?? "" 
            }
        })

        console.log("data VVVVV")
        console.log(checkpointList)


        if (checkpointList?.IDAccount !== uuid && restOrg?.IDAccount !== uuid) {
            return resFalse();
        }
        try {
            const rangeDay = (new Date(date).getTime() - new Date(checkpointList?.checkpoint?.[0]?.time ?? "").getTime()) / (1000 * 60 * 60 * 24);
            console.log("rageDay is "+rangeDay)
            if (checkpointList) {
                for (const checkpoint of checkpointList?.checkpoint) {
                    if (checkpoint.time) {
                        const updatedTime = new Date(checkpoint.time);
                        updatedTime.setDate(updatedTime.getDate()+rangeDay);
                        const updatedTimeISO = updatedTime.toISOString();

                        // Update each checkpoint
                        await prismaMySQL.checkpoint.update({
                            where: {
                                IDCheckpoint: checkpoint.IDCheckpoint,
                            },
                            data: {
                                time: updatedTimeISO,
                            },
                        });

                        // console.log(`Updated checkpoint time for IDCheckpoint ${checkpoint.IDCheckpoint}`);
                    }
                }
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