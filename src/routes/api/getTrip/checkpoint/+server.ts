import { prismaMySQL } from "$lib/utils/database/sqlDB";
import { decrypt } from "$lib/security/jwtUtils";
import type { RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ request, cookies }) => {
    const { checkpointID } = await request.json();
    const detailCK = await prismaMySQL.checkpoint.findFirst({
        where: {
            IDCheckpoint: checkpointID
        },
        select: {
            detail: true
        }
    });

    return new Response(JSON.stringify({Trip:{detail:detailCK?.detail}}), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    });
};
