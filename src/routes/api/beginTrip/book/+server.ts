import { CustomError, resCustomError } from "$lib/myAPI/customError";
import { prismaMongo } from "$lib/utils/database/noSqlDB";
import { prismaMySQL } from "$lib/utils/database/sqlDB";
import { decrypt } from "$lib/security/jwtUtils";
import { getUUID } from "$lib/utils/uuidUtils";
import type { RequestHandler } from "@sveltejs/kit";
import { resFalse, resTrue } from "$lib/myAPI/resTrueFalse";

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
        let newIDTrip = getUUID()
        while (await checkExistTrip(newIDTrip)) {
            newIDTrip = getUUID()
        }
        console.log("newIDTrip " + newIDTrip)
        const isoDate = new Date().toISOString();
        //copy trip
        await prismaMySQL.trip.create({
            data: {
                IDTrip: newIDTrip as string,
                IDOriginTrip: tripID as string,
                IDAccount: uuid as string,
                TripName: trip?.TripName as string,
                Detail: trip?.Detail,
                Preparation: trip?.Preparation as string,
                Booking: 'BE',
                createDate: isoDate as string,
                lastEdit: isoDate as string,
                private: true,
                maxJoiner: trip?.maxJoiner as number,
                started: false,
                count: count??1,
            }
        });
        //copy checkpoint
        // const isoDateCK = new Date().toISOString();
        let originCK = await prismaMySQL.checkpoint.findMany({
            where: {
                IDTrip: tripID
            }
        });
        let cpID: { IDTrip: string, IDCheckpoint: string }[] = []
        const newCheckpoints = await Promise.all(
            originCK.map(async (e) => {
                const IDCheckpointTMP = await getCheckpointID();
                cpID.push({ IDCheckpoint: IDCheckpointTMP, IDTrip: newIDTrip })
                return {
                    IDCheckpoint: IDCheckpointTMP,
                    IDTrip: newIDTrip,
                    OrderC: e.OrderC,
                    time: e.time,
                    locationName: e.locationName,
                    detail: e.detail,
                    type: e.type
                };
            })
        );

        await prismaMySQL.checkpoint.createMany({
            data: newCheckpoints
        });

        //nosql
        await prismaMongo.checkpointNSQL.createMany({
            data: cpID
        })

        await prismaMongo.orgChat.create({
            data: {
                IDTrip: tripID,
                IDAccount: uuid as string
            }
        })


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

async function checkExistTrip(uuid: string) {
    const recordExists = await prismaMySQL.trip.findFirst({
        where: {
            IDTrip: uuid
        }
    });
    return recordExists != null
}

async function checkExistCheckpoint(uuid: string) {
    const recordExists = await prismaMySQL.checkpoint.findFirst({
        where: {
            IDCheckpoint: uuid
        }
    });
    return recordExists != null
}

async function getCheckpointID(): Promise<string> {
    let newIDCheckpoint = getUUID()
    while (await checkExistCheckpoint(newIDCheckpoint)) {
        newIDCheckpoint = getUUID()
    }
    console.log("newIDCheckpoint " + newIDCheckpoint)
    return newIDCheckpoint as string
}
// DELETE FROM checkpoint WHERE IDTrip = 'fbda33db-2c15-4cdb-86af-96a5b6f06cd6'; 10
// DELETE FROM joiner WHERE IDAccount = '0e51d7f7-6cd2-11ef-9f47-04421a0238fa' and IDTrip = '7c6ad9a0-6cd2-11ef-9f47-04421a0238fa'; 10
// DELETE FROM trip WHERE IDAccount = '0e51d7f7-6cd2-11ef-9f47-04421a0238fa' and IDTrip = 'fbda33db-2c15-4cdb-86af-96a5b6f06cd6'; my