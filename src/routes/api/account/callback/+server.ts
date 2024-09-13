// src/routes/api/auth/google/callback/+server.ts
import { OAuth2Client } from 'google-auth-library';
import { getInfo, oauth2Client } from '$lib/security/auth2Utils';
import { prismaMySQL } from '$lib/utils/database/sqlDB.js';
import { encrypt } from "$lib/security/jwtUtils";
import { getUUID } from '$lib/utils/uuidUtils.js';
import { CAN_NOT_INSERT_ACCOUNT } from '$lib/constants/errorCodes';
import { resError } from '$lib/myAPI/customError';
import type { RequestHandler } from '@sveltejs/kit';

const client = oauth2Client

export const GET : RequestHandler = async ({ url, cookies }) => {
    const code = url.searchParams.get('code') as string;
    console.log("code is "+code)
    const { tokens } = await client.getToken(code);
    console.log("tokens is  "+tokens)
    // client.setCredentials(tokens);
    const info = await getInfo(tokens as Token)

    const uuidUser = await prismaMySQL.account.findFirst({
        where: {
            IDGoogle: info.Google_ID
        },
        select: {
            IDAccount: true
        }
    })

    if (uuidUser) {//exists account
        const userToken = encrypt(uuidUser.IDAccount);  
        return senResponse(userToken, 302)
    }
    else {//newaccount
        let IDAccount = getUUID()
        while (await checkExistAccount(IDAccount)) {
            IDAccount = getUUID()
        }
        addNewUsre(info, IDAccount)
        const userToken = encrypt(IDAccount);
        return senResponse(userToken, 302)
    }
};

async function senResponse(token: string, code: number): Promise<Response> {
    return new Response(null, {
        status: code,
        headers: {
            'Set-Cookie': `token=${token}; HttpOnly; Path=/; Max-Age=${1 * 60 * 60};`,
            Location: '/'
        }
    });
}

async function addNewUsre(info: googleInfo, IDAccount: string) {
    try {
        prismaMySQL.account.create({
            data: {
                IDAccount: IDAccount,
                IDGoogle: info.Google_ID,
                Email: info.Email,
                Org: false,
                imgURL: "https://icons.veryicon.com/png/o/miscellaneous/administration/account-25.png",
                name: info.name,
            }
        })
        return senResponse(IDAccount, 302)
    }
    catch (error) {
        return resError(CAN_NOT_INSERT_ACCOUNT)
    }
}

async function checkExistAccount(uuid: string) {
    const recordExists = await prismaMySQL.account.findFirst({
        where: {
            IDAccount: uuid
        }
    });
    return recordExists != null
}