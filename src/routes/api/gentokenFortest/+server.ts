import { encrypt } from "$lib/security/jwtUtils"
import type { RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async () => {
    
    return new Response(JSON.stringify({ 
        "token":encrypt(
            "0e51da43-6cd2-11ef-9f47-04421a0238fa"//google_10
        ) }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    });
};