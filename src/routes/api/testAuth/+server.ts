// // src/routes/api/auth/google/callback/+server.ts
// import { OAuth2Client } from 'google-auth-library';
// import { redirect } from '@sveltejs/kit';
// import { encryptGoogleID } from '$lib/utils/jwtUtils';
// import { COOKIE_OPTIONS } from '$lib/utils/cookieUtils';

// const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.GOOGLE_REDIRECT_URI);

// export const GET = async ({ url, cookies }) => {
//     const code = url.searchParams.get('code');

//     // Exchange authorization code for tokens
//     const { tokens } = await client.getToken(code);
//     client.setCredentials(tokens);

//     // Retrieve user info
//     const userInfo = await client.request({ url: 'https://www.googleapis.com/oauth2/v3/userinfo' });
//     const googleId = userInfo.data.sub;

//     // Encrypt the Google ID and set cookie
//     const encryptedGoogleId = encryptGoogleID(googleId);
//     cookies.set('google_id', encryptedGoogleId, COOKIE_OPTIONS);

//     // Instead of throwing redirect, return a response with Set-Cookie and redirect
//     return new Response(null, {
//         status: 302,
//         headers: {
//             'Set-Cookie': `google_id=${encryptedGoogleId}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60};`,
//             Location: '/'
//         }
//     });
// };
