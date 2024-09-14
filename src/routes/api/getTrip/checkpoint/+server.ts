import { prismaMySQL } from "$lib/utils/database/sqlDB";
import type { RequestHandler } from "@sveltejs/kit";
import { checkErrorAndRes, checkMissingInput } from "$lib/myAPI/customError";

export const POST: RequestHandler = async ({ request, cookies }) => {
    try {
        const { checkpointID } = await request.json();
        checkMissingInput(checkpointID)
        const detailCK = await prismaMySQL.checkpoint.findFirst({
            where: {
                IDCheckpoint: checkpointID
            },
            select: {
                detail: true
            }
        });

        return new Response(JSON.stringify({ Trip: { detail: detailCK?.detail } }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        return checkErrorAndRes(error)
    }

};
