import { prismaMongo } from '$lib/utils/database/noSqlDB';
import type { OrgChatChat } from '@prisma-app/clientMongo';

export async function getChat(tripID: string, accountID: string) {
	const chat = await prismaMongo.orgChat.findFirst({
		where: {
			IDTrip: tripID,
			IDAccount: accountID
		},
		select: {
			Chat: true
		}
	});
	return chat?.Chat || null;
}

export async function getLatestChatFromlist(allChat: OrgChatChat[] | null | undefined) {
	if (allChat == null || allChat == undefined) return null;
	return allChat?.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())[0];
}

export async function getLatestChat(tripID: string, accountID: string) {
	const chat = await getChat(tripID, accountID);
	return chat?.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())[0] || null;
}
