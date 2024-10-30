// src/routes/api/chat/+server.ts
// import { addClientChatMessage, removeClient } from '$lib/chatUtils';?
import { MISSING_INPUT } from '$lib/constants/errorCodes';
import { checkMissingInput, CustomError } from '$lib/myAPI/customError';
import { decrypt } from '$lib/security/jwtUtils';
import { addClientChatMessage, removeClient } from '$lib/utils/chat/chatUtils';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = ({ request, url, cookies }) => {
	const token = cookies.get('token');
	const uuid = decrypt(token as string);
	const connectionID = url.searchParams.get('userId');
	// console.log("userID = ",connectionID)
	// checkMissingInput(connectionID )
	if (!connectionID) {
		throw new CustomError(MISSING_INPUT);
	}

	const stream = new ReadableStream({
		start(controller) {
			console.log(uuid, 'call Focus ');
			addClientChatMessage(connectionID, controller, uuid);
		},
		cancel() {
			try {
				removeClient(connectionID, uuid); // Clean up on cancel
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
};
