import { checkErrorAndRes, checkMissingInput } from "$lib/myAPI/customError";
import { resFalse, resTrue } from "$lib/myAPI/resTrueFalse";
import { decrypt } from "$lib/security/jwtUtils";
import { prismaMySQL } from "$lib/utils/database/sqlDB";
import type { RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ request, cookies }) => {
    try {
        const { tripID, date } = await request.json();
        checkMissingInput(tripID, date);

        const token = cookies.get('token');
        const uuid = decrypt(token as string);
        console.log("uuid is in date " + uuid);
        console.log("tripID is in date " + tripID);

        const checkpointList = await prismaMySQL.trip.findUnique({
            where: {
                IDTrip: tripID,
            },
            select: {
                checkpoint: true,
                IDAccount: true,
                IDOriginTrip: true,
            },
        });

        const restOrg = await prismaMySQL.trip.findUnique({
            where: { 
                IDTrip: checkpointList?.IDOriginTrip ?? ""
            }
        });

        if (checkpointList?.IDAccount !== uuid && restOrg?.IDAccount !== uuid) {
            return resFalse();
        }

        try {
            // Get the target date as a Date object
            const newDate = new Date(date);

            // Get the time difference in milliseconds
            const oldTime = new Date(checkpointList?.checkpoint?.[0]?.time ?? "");
            const timeDifferenceMs = newDate.getTime() - oldTime.getTime();

            console.log("Old time:", oldTime.toISOString());
            console.log("New date:", newDate.toISOString());
            console.log("Time difference in ms:", timeDifferenceMs);

            if (checkpointList) {
                for (const checkpoint of checkpointList?.checkpoint ?? []) {
                    if (checkpoint.time) {
                        // Add the time difference to the existing time
                        const updatedTime = new Date(new Date(checkpoint.time).getTime() + timeDifferenceMs);
                        const updatedTimeISO = updatedTime.toISOString();

                        // Update each checkpoint
                        await prismaMySQL.checkpoint.update({
                            where: {
                                IDCheckpoint: checkpoint.IDCheckpoint,
                            },
                            data: {
                                time: updatedTimeISO,
                            },
                        });

                        console.log(`Updated checkpoint ID ${checkpoint.IDCheckpoint} with new time ${updatedTimeISO}`);
                    }
                }
            }
            return resTrue();
        } catch (error) {
            console.log("Error during checkpoint updates:", error);
            return resFalse();
        }
    } catch (error) {
        return checkErrorAndRes(error);
    }
};
