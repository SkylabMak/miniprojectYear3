import { prismaMySQL } from '$lib/utils/database/sqlDB';
import type { RequestHandler } from '@sveltejs/kit';
import { resFalse } from '$lib/myAPI/resTrueFalse';
import { checkErrorAndRes } from '$lib/myAPI/customError';
import { decrypt } from '$lib/security/jwtUtils';

export const GET: RequestHandler = async ({ cookies }) => {
	try {
		const token = cookies.get('token');
		const uuid = decrypt(token as string);
		const user = await prismaMySQL.account.findUnique({
			where: {
				IDAccount: uuid as string
			}
		});
		if (user?.admin != true) {
			return resFalse();
		}
		const data = await prismaMySQL.orgwaitq.findMany({
			select: {
				IDAccount: true,
				reqTime: true,
				account: true
			}
		});

		return new Response(JSON.stringify(data), {
			status: 200,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	} catch (error) {
		// console.log(error);
		return checkErrorAndRes(error);
	}
};
