import { authorizationUri } from "$lib/utils/auth2Utils";
import type { RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async () => {
    return new Response(null, {
        status: 302,
        headers: {
            Location: `${authorizationUri}`
        }
    });
};