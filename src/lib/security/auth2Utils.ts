// import { AuthorizationCode } from 'simple-oauth2';
import { LoginTicket, OAuth2Client } from 'google-auth-library';

import 'dotenv/config';

export const oauth2Client = new OAuth2Client(
	process.env.GOOGLE_ID,
	process.env.CLIENT_SECRETE,
	process.env.GOOGLE_CALLBACK_URL
);

export const authorizationUri = oauth2Client.generateAuthUrl({
	access_type: 'offline',
	scope: ['openid', 'email', 'profile']
});

const verifyIdToken = async (token: Token): Promise<LoginTicket> => {
	return await oauth2Client.verifyIdToken({
		idToken: token.id_token as string,
		audience: process.env.GOOGLE_ID
	});
};
export const getInfo = async (token: Token): Promise<googleInfo> => {
	// console.log("token is "+token.id_token)
	try {
		const result = await verifyIdToken(token);
		// console.log(result.getPayload())
		const data = result.getPayload();
		const info: googleInfo = {
			Google_ID: data?.sub as string,
			Email: data?.email as string,
			name: data?.name as string,
			url: data?.picture as string
		};
		return info;
	} catch (error) {
		console.log('error in getInfo : ' + error);
		const info: googleInfo = {
			Google_ID: 'null',
			Email: 'null',
			name: 'null',
			url: 'null'
		};
		return info;
	}
};
