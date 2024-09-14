import { prismaMySQL } from "$lib/utils/database/sqlDB";
import { decrypt } from "$lib/security/jwtUtils";
import type { RequestHandler } from "@sveltejs/kit";
import { checkErrorAndRes, CustomError, resCustomError } from "$lib/myAPI/customError";
import { MISSING_INPUT } from "$lib/constants/errorCodes";
import { getLatestChat } from "$lib/myAPI/chatUtils";
import { getCheckpointDetail } from "$lib/myAPI/checkPointUtils";

export const POST: RequestHandler = async ({ request, cookies }) => {
    try {
    const { tripID } = await request.json();
    const token = cookies.get('token');
    const uuid = decrypt(token as string)
    console.log("uuid is " + uuid)
    console.log("trip is "+tripID)
    if ([tripID].some(val => val === null || val === undefined)) {
        return resCustomError(new CustomError(MISSING_INPUT))
    }
    const tripDetail = await prismaMySQL.trip.findUnique({
        where: {
            IDTrip: tripID
        },
        select: {
            joiner: true,
            IDTrip: true,
            IDOriginTrip: true,
            IDAccount: true,
            TripName: true,
            Detail: true,
            Preparation: true,
            Booking: true,
            createDate: true,
            lastEdit: true,
            private: true,
            maxJoiner: true,
            started: true,
            count:true,
            checkpoint: true,
        }
    })
    let lastChat = null // Including booking and yet
    if(uuid){
        lastChat = await getLatestChat((tripDetail?.Booking === 'BE')?tripDetail.IDOriginTrip:tripID, uuid as string)
        console.log(lastChat)
    }
    const booking = tripDetail?.Booking
    const cust = ((booking === 'BE'&&tripDetail?.IDAccount === uuid) || (booking === 'BI' && tripDetail?.IDAccount !== uuid))
    let unread = !(cust === lastChat?.readed);
    unread = (booking === 'BI' && tripDetail?.IDAccount === uuid)?false:unread // if res will can't select cust
    console.log("cust is "+cust)
    const checkpointDetail = await getCheckpointDetail(tripID, uuid)
    
    let index = 0;


    const checkPointMix = tripDetail?.checkpoint.map(ck => {
        return {
            IDCheckpoint: ck.IDCheckpoint,
            time: ck.time,
            locationName: ck.locationName,
            type: ck.type,
            commentCount: checkpointDetail[index]?.commentCount??0,
            unRead: checkpointDetail[index]?.unRead??0,
            orderC:ck.OrderC,
            progress: checkpointDetail[index]?.progress??[],
            me: checkpointDetail[index++]?.me??false
        }
    })

    // const checkPointMixSorted = checkPointMix?.sort((e1, e2) => (e1.orderC ?? 0) - (e2.orderC ?? 0))
    const startDate = checkPointMix?.[0]?.time || null;
    const result = {
        Trip: {
            tripID: tripDetail?.IDTrip,
            head:tripDetail?.IDAccount,
            name: tripDetail?.TripName,
            detail: tripDetail?.Detail,
            startDate: startDate,
	        preparation: tripDetail?.Preparation,
            booking: tripDetail?.Booking,
            lastEdit: tripDetail?.lastEdit,
            private: tripDetail?.private,
            maxJoiner: tripDetail?.maxJoiner,
            started: tripDetail?.started,
            me:tripDetail?.IDAccount === uuid,
            count:tripDetail?.count,
            join:tripDetail?.joiner.some(e=>{ if(e.IDAccount === uuid )console.log("found at "+e.IDAccount); return e.IDAccount === uuid }),
            unread:unread,
            checkpoint:checkPointMix,
        }
    }
    return new Response(JSON.stringify(result), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}   catch (error) {
    return checkErrorAndRes(error)
}
};
