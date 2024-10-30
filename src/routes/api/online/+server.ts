// src/routes/api/chat/+server.ts
// import { addClientChatMessage, removeClient } from '$lib/chatUtils';?
import { checkErrorAndRes, checkMissingInput } from '$lib/myAPI/customError';
import { decrypt } from '$lib/security/jwtUtils';
import { addOnlineClientChatMessage, removeOnlineClient } from '$lib/utils/chat/notificationUtils';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = ({ request, url, cookies }) => {
	try {
		const token = cookies.get('token');
		const uuid = decrypt(token as string);

		const stream = new ReadableStream({
			start(controller) {
				addOnlineClientChatMessage(controller, uuid);
			},
			cancel() {
				try {
					removeOnlineClient(uuid);
				} catch (e) {
					console.error('Controller already closed:', uuid);
				}
			}
		});

		return new Response(stream, {
			headers: {
				'Content-Type': 'text/event-stream',
				'Cache-Control': 'no-cache',
				Connection: 'keep-alive'
			}
		});
	} catch (error) {
		return checkErrorAndRes(error);
	}
};
