import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { CustomError } from '$lib/myAPI/customError';
import { TOKEN_FAILED } from '$lib/constants/errorCodes';

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY as string;

export function encrypt(account_id: string): string {
	const token = jwt.sign({ account_id }, SECRET_KEY, {
		expiresIn: '60d'
	});
	return token;
}

// Function to decrypt the token and return the account_id
export function decrypt(token: string): string {
	try {
		const decoded = jwt.verify(token, SECRET_KEY) as { account_id: string };
		return decoded.account_id;
	} catch (error) {
		// console.error('Token is invalid or expired', error);
		throw new CustomError(TOKEN_FAILED);
	}
}

export function decryptWithNull(token: string): string | null {
	try {
		const decoded = jwt.verify(token, SECRET_KEY) as { account_id: string };
		return decoded.account_id;
	} catch (error) {
		// console.error('Token is invalid or expired', error);
		//    throw new CustomError(TOKEN_FAILED)
		return null;
	}
}
