import { json, text } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { testConnectionsSQL } from '$lib/server/utils/database/sqlDB'; // Updated import
import { testConnectionsNoSQL } from '$lib/server/utils/database/noSqlDB'; // Updated import


export const GET: RequestHandler = async () => {
    // Make sure to await async functions
    const sqlResult = await testConnectionsSQL();
    const nosqlResult = await testConnectionsNoSQL();

    return new Response(JSON.stringify({ "sql": sqlResult, "nosql": nosqlResult }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    });
};