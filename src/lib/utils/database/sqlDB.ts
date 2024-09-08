import { PrismaClient as MySQLClient } from '@prisma-app/clientMysql';


export const prismaMySQL = new MySQLClient();  // MySQL Client initialization

export const testConnectionsSQL = async () => {
    try {
        const result = await prismaMySQL.checkpoint.findMany()
        console.log(result)
        return result
    } catch (error) {
        return null
    }
}