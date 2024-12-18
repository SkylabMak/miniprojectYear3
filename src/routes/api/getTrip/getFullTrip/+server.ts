import { prismaMySQL } from '$lib/utils/database/sqlDB';
import { decrypt } from '$lib/security/jwtUtils';
import type { RequestHandler } from '@sveltejs/kit';
import {
	checkErrorAndRes,
	checkMissingInput,
	CustomError,
	resCustomError
} from '$lib/myAPI/customError';
import { MISSING_INPUT } from '$lib/constants/errorCodes';
import { getLatestChat } from '$lib/myAPI/chatUtils';
import { getCheckpointDetail } from '$lib/myAPI/checkPointUtils';
import { partialJoin } from '$lib/myAPI/tripUtils';
import { resFalse } from '$lib/myAPI/resTrueFalse';

async function getOrgDetail(originIDTrip: string): Promise<{ name: string; org: boolean }> {
	const resData = await prismaMySQL.trip.findUnique({
		where: {
			IDTrip: originIDTrip
		},
		select: {
			account: {
				select: {
					name: true,
					Org: true
				}
			}
		}
	});
	return {
		name: resData?.account?.name ?? '',
		org: resData?.account?.Org ?? false
	};
}

export const POST: RequestHandler = async ({ request, cookies }) => {
	try {
		const { tripID } = await request.json();
		checkMissingInput(tripID);
		const token = cookies.get('token');
		let uuid = '';
		try {
			uuid = decrypt(token as string) ?? '';
		} catch (error) {
			uuid = '';
		}
		// console.log("uuid is " + uuid)
		// console.log("trip is "+tripID)

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
				imageURL: true,
				Preparation: true,
				Booking: true,
				createDate: true,
				lastEdit: true,
				private: true,
				maxJoiner: true,
				started: true,
				count: true,
				checkpoint: true,
				account: {
					select: {
						name: true,
						Org: true
					}
				}
			}
		});
		if (!tripDetail) {
			return resFalse();
		}
		let lastChat = null; // Including booking and yet
		if (uuid) {
			lastChat = await getLatestChat(
				tripDetail?.Booking === 'BE' ? tripDetail.IDOriginTrip : tripID,
				uuid as string
			);
			// console.log(lastChat)
		}
		const booking = tripDetail?.Booking;
		const cust =
			(booking === 'BE' && tripDetail?.IDAccount === uuid) ||
			(booking === 'BI' && tripDetail?.IDAccount !== uuid);
		// console.log("cust",cust)
		let unread = !(cust ? lastChat?.readed : lastChat?.orgReaded);
		// console.log("unread1",unread)
		unread = booking === 'BI' && tripDetail?.IDAccount === uuid ? false : unread; // if res will can't select cust
		// console.log("unread2",unread)
		unread = lastChat == null ? false : false;
		// console.log("unread3",unread)
		// console.log("cust is "+cust)
		const checkpointDetail = await getCheckpointDetail(tripID, uuid);

		let index = 0;

		const checkPointMix = tripDetail?.checkpoint.map((ck) => {
			const checkpointData = checkpointDetail.find((e) => e.id == ck.IDCheckpoint);
			// console.log(ck.IDTrip + " " + ck.IDCheckpoint + " " + (checkpointData?.commentCount || 0));

			return {
				IDCheckpoint: ck.IDCheckpoint,
				time: ck.time,
				locationName: ck.locationName,
				type: ck.type,
				commentCount: checkpointData?.commentCount ?? 0,
				unRead: checkpointData?.unRead ?? 0,
				orderC: ck.OrderC,
				progress: checkpointData?.progress ?? [],
				me: checkpointData?.me ?? false
			};
		});

		const checkPointMixSorted = checkPointMix?.sort((e1, e2) => {
			// Handle null time by using a default fallback date, such as the current time or a fixed point in the past
			const time1 = e1.time ? new Date(e1.time).getTime() : 0; // Fallback to a default timestamp
			const time2 = e2.time ? new Date(e2.time).getTime() : 0; // Fallback to a default timestamp

			return time1 - time2;
		});

		const startDate = checkPointMixSorted?.[0]?.time || null;
		// console.log("startDate",startDate)
		const orgTripDetaill =
			tripDetail?.Booking === 'BE' ? await getOrgDetail(tripDetail?.IDOriginTrip ?? '') : null;
		const partialJoin1 = await partialJoin(tripID, uuid);
		// console.log('partialJoin1 ', partialJoin1);
		const result = {
			Trip: {
				tripID: tripDetail?.IDTrip,
				tripIDOrigin: tripDetail?.IDOriginTrip,
				head:
					tripDetail?.Booking === 'BE' ? (orgTripDetaill?.name ?? '') : tripDetail?.account?.name,
				ownOrgTrip: orgTripDetaill != null,
				name: tripDetail?.TripName,
				detail: tripDetail?.Detail,
				startDate: startDate ?? '',
				preparation: tripDetail?.Preparation,
				booking: tripDetail?.Booking,
				lastEdit: tripDetail?.lastEdit,
				private: tripDetail?.private,
				imageURL: tripDetail?.imageURL,
				org: tripDetail?.account?.Org,
				maxJoiner: tripDetail?.maxJoiner,
				started: tripDetail?.started,
				me: tripDetail?.IDAccount === uuid,
				count: tripDetail?.count,
				hasToken: uuid ? true : false,
				join:
					tripDetail?.joiner.some((e) => {
						if (e.IDAccount === uuid) return e.IDAccount === uuid;
					}) || partialJoin1,
				unread: uuid === '' ? false : unread,
				checkpoint: checkPointMixSorted
			}
		};
		// console.log("result full trip ",result)
		return new Response(JSON.stringify(result), {
			status: 200,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	} catch (error) {
		return checkErrorAndRes(error);
	}
};
