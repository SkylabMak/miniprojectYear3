import { prismaMySQL } from '$lib/utils/database/sqlDB';
import { decrypt } from '$lib/security/jwtUtils';
import type { RequestHandler } from '@sveltejs/kit';
import { resFalse } from '$lib/myAPI/resTrueFalse';

export const POST: RequestHandler = async ({ request, cookies }) => {
	try {
		const token = cookies.get('token');
		const uuid = decrypt(token as string);
		console.log('uuid is ' + uuid);

		const waitStatus = await prismaMySQL.orgwaitq.findUnique({
			where: {
				IDAccount: uuid as string
			}
		});
		const userInfo = await prismaMySQL.account.findUnique({
			where: {
				IDAccount: uuid as string
			},
			select: {
				name: true,
				imgURL: true,
				Org: true,
				Email: true
			}
		});
		return new Response(
			JSON.stringify({
				name: userInfo?.name,
				imgURL: userInfo?.imgURL,
				Org: waitStatus == null ? 'wait' : `${userInfo?.Org}`,
				Email: userInfo?.Email
			}),
			{
				status: 200,
				headers: {
					'Content-Type': 'application/json'
				}
			}
		);
	} catch (error) {
		console.log(error);
		return resFalse();
	}
};

// DELETE FROM checkpoint WHERE IDTrip = 'fbda33db-2c15-4cdb-86af-96a5b6f06cd6'; 10
// DELETE FROM joiner WHERE IDAccount = '0e51d7f7-6cd2-11ef-9f47-04421a0238fa' and IDTrip = '7c6ad9a0-6cd2-11ef-9f47-04421a0238fa'; 10
// DELETE FROM trip WHERE IDAccount = '0e51d7f7-6cd2-11ef-9f47-04421a0238fa' and IDTrip = 'fbda33db-2c15-4cdb-86af-96a5b6f06cd6'; my
