import type { RequestHandler } from '@sveltejs/kit';
import {
	uploadToProfileFolder,
	uploadToProfileFolderWithURL,
	uploadToTripFolder
} from '$lib/utils/cloudinary/cloudinaryConfig';
import { checkMissingInput, CustomError, resError } from '$lib/myAPI/customError';
import { decrypt } from '$lib/security/jwtUtils';
import { prismaMySQL } from '$lib/utils/database/sqlDB';
import { resFalse, resTrue } from '$lib/myAPI/resTrueFalse';

export const POST: RequestHandler = async ({ request, cookies }) => {
	try {
		const { imageURL, id } = await request.json();
		checkMissingInput(imageURL, id);
		const token = cookies.get('token');
		const uuid = decrypt(token as string);
		const customFileName: string = `${id == '' ? uuid : id}`;

		// Select the correct folder
		let uploadResult;

		uploadResult = await uploadToProfileFolderWithURL(imageURL, customFileName);
		await prismaMySQL.account.update({
			where: {
				IDAccount: uuid
			},
			data: {
				imgURL: uploadResult.url
			}
		});

		if (!uploadResult || !uploadResult.secure_url) {
			return resFalse();
		}

		// Respond with the uploaded image URL
		// console.log(uploadResult.url)
		return new Response(JSON.stringify({ url: uploadResult.url }), {
			status: 200,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	} catch (error) {
		console.error('error for upload img', error);
		return resError(error as Error);
	}
};
