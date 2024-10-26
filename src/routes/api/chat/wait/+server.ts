// src/routes/api/chat/+server.ts
// import { addClientChatMessage, removeClient } from '$lib/chatUtils';?
import { decrypt } from '$lib/security/jwtUtils';
import { addClientChatMessage, removeClient } from '$lib/utils/chat/chatUtils';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = ({ request, url,cookies }) => {
    const token = cookies.get('token');
	const uuid = decrypt(token as string);
    const connectionID = url.searchParams.get('userId');
    console.log("userID = ",connectionID)
    if (!connectionID) return new Response('Missing userId', { status: 400 });

    const stream = new ReadableStream({
        start(controller) {
            addClientChatMessage(connectionID, controller,uuid);
            request.signal.addEventListener('abort', () => {
                removeClient(connectionID, uuid);
                controller.close();
            });
        }
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
        }
    });
};
