// import { PrismaClient as MongoClient } from '@prismaMongo';
import { PrismaClient as MongoClient} from '@prisma-app/clientMongo';

const prismaMongo = new MongoClient();  // MySQL Client initialization

export const testConnectionsNoSQL = async () => {
    try {
        const result = await prismaMongo.checkpointNSQL.findMany()
        console.log(result)
        return result
    } catch (error) {
        return null
    }
}