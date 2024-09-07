import { encrypt } from '$lib/utils/jwtUtils';
import { getUUID } from '$lib/utils/uuidUtils';
import { json, text, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
    return new Response(JSON.stringify({ "gettoken": encrypt(getUUID())}), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    });
};