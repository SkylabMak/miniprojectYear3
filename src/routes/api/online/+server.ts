// src/routes/api/chat/+server.ts
// import { addClientChatMessage, removeClient } from '$lib/chatUtils';?
import { checkMissingInput } from '$lib/myAPI/customError';
import { decrypt } from '$lib/security/jwtUtils';
import { addOnlineClientChatMessage, removeOnlineClient } from '$lib/utils/chat/notificationUtils';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = ({ request, url, cookies }) => {
	const token = cookies.get('token');
	const uuid = decrypt(token as string);
	// const connectionID = url.searchParams.get('userId');
	// console.log("userID = ",connectionID)
	// checkMissingInput(connectionID )

	const stream = new ReadableStream({
		start(controller) {
			addOnlineClientChatMessage(controller, uuid);
			request.signal.addEventListener('abort', () => {
				removeOnlineClient(uuid);
				controller.close();
			});
		}
	});

	return new Response(stream, {
		headers: {
			'Content-Type': 'text/event-stream',
			'Cache-Control': 'no-cache',
			Connection: 'keep-alive'
		}
	});
};
