import { checkErrorAndRes, checkMissingInput } from '$lib/myAPI/customError';
import { prismaMySQL } from '$lib/utils/database/sqlDB';
import { decrypt } from '$lib/security/jwtUtils';
import type { RequestHandler } from '@sveltejs/kit';
import { resTrue } from '$lib/myAPI/resTrueFalse';
import { getCurrentIsoDate } from '$lib/myAPI/tripUtils';

export const POST: RequestHandler = async ({ request, cookies }) => {
	try {
		const { name, org, imgURL, remove } = await request.json();
		checkMissingInput(name, org, imgURL, remove);
		const token = cookies.get('token');
		const uuid = decrypt(token as string);
		// //console.log('uuid is ' + uuid);

		if (remove === true) {
			await prismaMySQL.account.delete({
				where: {
					IDAccount: uuid as string
				}
			});

			return resTrue();
		}

		const userInfo = await prismaMySQL.account.findUnique({
			where: {
				IDAccount: uuid as string
			}
		});

		await prismaMySQL.account.update({
			where: {
				IDAccount: uuid as string
			},
			data: {
				name: name ?? userInfo?.name,
				imgURL: imgURL ?? userInfo?.imgURL
			}
		});

		if (org !== '' && org === true) {
			// console.log('wait org');
			await prismaMySQL.orgwaitq.create({
				data: {
					IDAccount: uuid as string,
					reqTime: getCurrentIsoDate()
				}
			});
		}

		return resTrue();
	} catch (error) {
		// console.log(error);
		return checkErrorAndRes(error);
	}
};

// DELETE FROM checkpoint WHERE IDTrip = 'fbda33db-2c15-4cdb-86af-96a5b6f06cd6'; 10
// DELETE FROM joiner WHERE IDAccount = '0e51d7f7-6cd2-11ef-9f47-04421a0238fa' and IDTrip = '7c6ad9a0-6cd2-11ef-9f47-04421a0238fa'; 10
// DELETE FROM trip WHERE IDAccount = '0e51d7f7-6cd2-11ef-9f47-04421a0238fa' and IDTrip = 'fbda33db-2c15-4cdb-86af-96a5b6f06cd6'; my
