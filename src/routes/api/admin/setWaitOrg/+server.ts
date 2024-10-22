import { checkErrorAndRes, checkMissingInput } from '$lib/myAPI/customError';
import { resFalse } from '$lib/myAPI/resTrueFalse';
import { decrypt } from '$lib/security/jwtUtils';
import { prismaMySQL } from '$lib/utils/database/sqlDB';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, cookies }) => {
	try {
		const { IDAccount, status } = await request.json();
		checkMissingInput(IDAccount, status);
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
		if (status == true) {
			await prismaMySQL.account.update({
				where: {
					IDAccount: IDAccount
				},
				data: {
					Org: true
				}
			});

			await prismaMySQL.orgwaitq.delete({
				where: {
					IDAccount: IDAccount
				}
			});
		} else {
			await prismaMySQL.orgwaitq.delete({
				where: {
					IDAccount: IDAccount
				}
			});
		}
		return new Response(JSON.stringify({ succeed: true }), {
			status: 200,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	} catch (error) {
		return checkErrorAndRes(error);
	}
};

// DELETE FROM checkpoint WHERE IDTrip = 'fbda33db-2c15-4cdb-86af-96a5b6f06cd6'; 10
// DELETE FROM joiner WHERE IDAccount = '0e51d7f7-6cd2-11ef-9f47-04421a0238fa' and IDTrip = '7c6ad9a0-6cd2-11ef-9f47-04421a0238fa'; 10
// DELETE FROM trip WHERE IDAccount = '0e51d7f7-6cd2-11ef-9f47-04421a0238fa' and IDTrip = 'fbda33db-2c15-4cdb-86af-96a5b6f06cd6'; my
