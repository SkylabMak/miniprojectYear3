import { encrypt } from "$lib/security/jwtUtils"
import type { RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async () => {
    
    return new Response(JSON.stringify({ 
        "token":encrypt(
            // "0e51da43-6cd2-11ef-9f47-04421a0238fa"//google_10
            // "0e51d7f7-6cd2-11ef-9f47-04421a0238fa"//public googel
            "0e51d9fe-6cd2-11ef-9f47-04421a0238fa"//google_9
        ) }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    });
};