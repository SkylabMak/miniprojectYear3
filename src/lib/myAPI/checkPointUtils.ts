import { prismaMongo } from "$lib/utils/database/noSqlDB";
import { prismaMySQL } from "$lib/utils/database/sqlDB";

export async function getCheckpointDetail(tripID: string,uuid: string|null) {
    const allCheckpoint = await prismaMongo.checkpointNSQL.findMany({
        where: {
            IDTrip: tripID
        },
    })

    const updatedCheckPoint = await Promise.all(
        allCheckpoint.map(async checkpoint => {
            const progressInfo = getProgressInfo(checkpoint.progress)

            let unReadCount = 0;
            if(uuid){
                for (const element of checkpoint.Comments) {
                    if (!(element.readed.includes(uuid))) {
                        unReadCount++;
                    }
                }
            }
            return {
                commentCount: checkpoint.Comments.length,
                unRead: unReadCount,
                progress: progressInfo,
                me: (uuid)? checkpoint.progress.includes(uuid):false,
            }
        })
    )
    return updatedCheckPoint
}

async function getProgressInfo(progress: string[]) {
    return progress.map(
        async user => {
            return await prismaMySQL.account.findUnique({
                where: {
                    IDAccount: user
                },
                select: {
                    IDAccount: true,
                    imgURL: true,
                    name: true
                }
            })
        }
    )
}