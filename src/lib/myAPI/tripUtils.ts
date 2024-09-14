import { prismaMongo } from "$lib/utils/database/noSqlDB";
import { prismaMySQL } from "$lib/utils/database/sqlDB";
import { getUUID } from "$lib/utils/uuidUtils";
import { error } from "@sveltejs/kit";
import { CustomError, resCustomError } from "./customError";

export async function copyTrip(
    trip: {
        IDAccount: string | null;
        IDTrip: string;
        TripName: string;
        Detail: string | null;
        Preparation: string | null;
        Booking: string | null;
        maxJoiner: number | null;
        joiner: {
            IDTrip: string;
            IDAccount: string;
            type: string | null;
            status: string | null;
        }[];
    } | null, // Allow null here
    uuid: string,
    count: number,
    booking: boolean
) {

    try {

        if (!trip) {
            throw error
        }
        let newIDTrip = await getTripID()
        console.log("newIDTrip " + newIDTrip)
        const isoDate = new Date().toISOString();
        //copy trip
        await prismaMySQL.trip.create({
            data: {
                IDTrip: newIDTrip as string,
                IDOriginTrip: trip.IDTrip as string,
                IDAccount: uuid as string,
                TripName: trip?.TripName as string,
                Detail: trip?.Detail,
                Preparation: trip?.Preparation as string,
                Booking: (booking)?'BE':'NM',
                createDate: isoDate as string,
                lastEdit: isoDate as string,
                private: true,
                maxJoiner: trip?.maxJoiner as number,
                started: false,
                count: count ?? 1,
            }
        });
        //copy checkpoint
        // const isoDateCK = new Date().toISOString();
        let originCK = await prismaMySQL.checkpoint.findMany({
            where: {
                IDTrip: trip.IDTrip
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
        if (cpID.length > 0) {
            await prismaMongo.checkpointNSQL.createMany({
                data: cpID
            });
        } else {
            console.log('No checkpoint data to insert into MongoDB.');
        }
        if (booking) {
            const oldChat = (await prismaMongo.orgChat.findFirst({
                where:{
                    IDTrip: trip.IDTrip,
                    IDAccount: uuid as string
                },
                select:{
                    Chat:true
                }
            }))?.Chat
            // if(oldChat){
            //     await prismaMongo.orgChat.deleteMany({
            //         where:{
            //             IDTrip: trip.IDTrip,
            //             IDAccount: uuid as string
            //         }
            //     })
            // }
            await prismaMongo.orgChat.create({
                data: {
                    IDTrip: trip.IDTrip,
                    IDAccount: uuid as string,
                    Chat: oldChat??[]
                }
            })
  
        }

    } catch (error) {
        throw error
    }

}


export async function checkExistTrip(uuid: string) {
    const recordExists = await prismaMySQL.trip.findFirst({
        where: {
            IDTrip: uuid
        }
    });
    return recordExists != null
}

export async function checkExistCheckpoint(uuid: string) {
    const recordExists = await prismaMySQL.checkpoint.findFirst({
        where: {
            IDCheckpoint: uuid
        }
    });
    return recordExists != null
}

export async function getCheckpointID(): Promise<string> {
    let newIDCheckpoint = getUUID()
    while (await checkExistCheckpoint(newIDCheckpoint)) {
        newIDCheckpoint = getUUID()
    }
    console.log("newIDCheckpoint " + newIDCheckpoint)
    return newIDCheckpoint as string
}

export async function getTripID(): Promise<string> {
        //copy
        let newIDTrip = getUUID()
        while (await checkExistTrip(newIDTrip)) {
            newIDTrip = getUUID()
        }
    return newIDTrip as string
}

export const isoDate = new Date().toISOString();