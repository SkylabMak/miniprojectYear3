import { checkErrorAndRes, checkMissingInput } from '$lib/myAPI/customError';
import { prismaMySQL } from '$lib/utils/database/sqlDB';
import { decrypt } from '$lib/security/jwtUtils';
import type { RequestHandler } from '@sveltejs/kit';
import { resFalse, resTrue } from '$lib/myAPI/resTrueFalse';
import { getCurrentIsoDate } from '$lib/myAPI/tripUtils';
import { prismaMongo } from '$lib/utils/database/noSqlDB';
// import {  getChatID } from '$lib/utils/webSocket/websocket';
import { broadcastChatMessage, isClientExists } from '$lib/utils/chat/chatUtils';
import { getChatID } from '$lib/utils/chat/ChatID';
import { getchatNotiFormat } from '$lib/utils/notificationFormat/chatNoti';
import { sendNotificationsOnline } from '$lib/utils/chat/notificationUtils';
// import { getOnlineUserSocket } from '../../../../hooks.server';

export const POST: RequestHandler = async ({ request, cookies }) => {
	try {
		const { tripID, text, custID } = await request.json();
		checkMissingInput(tripID, text);
		const token = cookies.get('token');
		const uuid = decrypt(token as string);
		// //console.log('uuid is ' + uuid);

		const tripChat = await prismaMySQL.trip.findUnique({
			where: {
				IDTrip: tripID
			},
			select: {
				TripName: true,
				IDAccount: true,
				IDOriginTrip: true,
				Booking: true
			}
		});
		const tripCustChat = await prismaMySQL.trip.findFirst({
			where: {
				IDOriginTrip: tripID,
				Booking: 'BE',
				IDAccount: custID
			},
			select: {
				TripName: true,
				IDAccount: true
			}
		});

		// if (custTrip?.Booking === 'BE') {
		//     const restTrip = await prismaMySQL.trip.findFirst({
		//         where: {
		//             IDTrip: custTrip?.IDOriginTrip as string
		//         },
		//         select: {
		//             IDAccount: true
		//         }
		//     })

		//     if (restTrip === null) {
		//         console.log("false trip")
		//         return resFalse();
		//     }
		//     if (restTrip.IDAccount !== uuid
		//         && custTrip?.IDAccount !== uuid) {
		//         console.log("flase user")
		//         return resFalse();
		//     }
		// }

		// const senderUserBooked: boolean = (custTrip?.Booking === 'BE' &&custTrip?.IDAccount === uuid)//cust
		// const senderUser = (custTrip?.Booking === 'BI' && custTrip?.IDAccount !== uuid)//newcust
		const cust = !(uuid === tripChat?.IDAccount);
		// console.log('cust is ' + cust);
		const chatAccount = cust ? (uuid as string) : custID;
		// console.log('chatAccount +', chatAccount);
		// console.log(chatAccount);
		if (chatAccount) {
			try {
				const chatID = getChatID(chatAccount, tripID);
				const isOppositeFocus = isClientExists(
					chatID,
					cust ? (tripChat?.IDAccount ?? '') : chatAccount
				);
				const newChat = {
					message: text as string,
					orgReaded: !cust || isOppositeFocus,
					readed: cust || isOppositeFocus,
					senderUser: cust,
					time: getCurrentIsoDate()
				};
				// console.log('isOppositeFocus ', isOppositeFocus);
				// console.log('new chat ', newChat);
				const orgChat = await prismaMongo.orgChat.findFirst({
					where: {
						IDTrip: tripID,
						IDAccount: chatAccount
					}
				});

				// const chatID : string = (senderUser)?uuid as string:custID
				// console.log("chatID is "+chatID)
				// -------save to DB-------
				if (orgChat === null || orgChat === undefined) {
					// console.log('new');
					await prismaMongo.orgChat.create({
						data: {
							IDTrip: tripID,
							IDAccount: uuid as string, // ที่พักจะไม่ส่งก่อน เว้นแต่ลูกค้าจอง ถึงจะสร้างไว้
							Chat: [newChat]
						}
					});
				} else {
					// console.log('update');
					await prismaMongo.orgChat.updateMany({
						where: {
							IDTrip: tripID,
							IDAccount: chatAccount
						},
						data: {
							Chat: {
								push: newChat
							}
						}
					});
				}
				// -------End save to DB-------
				const userInfo = await prismaMySQL.account.findUnique({
					where: {
						IDAccount: uuid as string
					}
				});

				const newRes = {
					text: newChat.message,
					name: userInfo?.name,
					imgUrl: userInfo?.imgURL,
					time: newChat.time,
					my: true
				};
				const newResSEE = {
					text: newChat.message,
					name: userInfo?.name,
					imgUrl: userInfo?.imgURL,
					time: newChat.time,
					rest: !cust
				};

				// console.log('getSocketID(chatAccount,tripID) = ', chatID);
				broadcastChatMessage(JSON.stringify(newResSEE), chatID);
				if (cust) {
					const notiFormat = getchatNotiFormat(
						chatID,
						tripChat?.TripName ?? '',
						newChat.message,
						userInfo?.name ?? '',
						userInfo?.imgURL ?? '',
						newChat.time
					);
					sendNotificationsOnline(JSON.stringify(notiFormat), tripChat?.IDAccount ?? '');
				} else {
					const notiFormat = getchatNotiFormat(
						chatID,
						tripCustChat?.TripName ?? '',
						newChat.message,
						userInfo?.name ?? '',
						userInfo?.imgURL ?? '',
						newChat.time
					);
					sendNotificationsOnline(JSON.stringify(notiFormat), chatAccount);
				}
				return new Response(JSON.stringify(newRes), {
					status: 200,
					headers: {
						'Content-Type': 'application/json'
					}
				});
			} catch (error) {
				console.log(error);
				throw error;
			}
		} else {
			return resFalse();
		}
	} catch (error) {
		return checkErrorAndRes(error);
	}
};

// DELETE FROM checkpoint WHERE IDTrip = 'fbda33db-2c15-4cdb-86af-96a5b6f06cd6'; 10
// DELETE FROM joiner WHERE IDAccount = '0e51d7f7-6cd2-11ef-9f47-04421a0238fa' and IDTrip = '7c6ad9a0-6cd2-11ef-9f47-04421a0238fa'; 10
// DELETE FROM trip WHERE IDAccount = '0e51d7f7-6cd2-11ef-9f47-04421a0238fa' and IDTrip = 'fbda33db-2c15-4cdb-86af-96a5b6f06cd6'; my
