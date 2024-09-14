import { CustomError, resCustomError } from "$lib/myAPI/customError";
import { prismaMySQL } from "$lib/utils/database/sqlDB";
import { decrypt } from "$lib/security/jwtUtils";
import type { RequestHandler } from "@sveltejs/kit";
import { resFalse} from "$lib/myAPI/resTrueFalse";
import { prismaMongo } from "$lib/utils/database/noSqlDB";
import { MISSING_INPUT } from "$lib/constants/errorCodes";

export const POST: RequestHandler = async ({ request, cookies }) => {
    try {
        const { tripID, custID } = await request.json();
        const token = cookies.get('token');
        const uuid = decrypt(token as string)
        console.log("uuid is " + uuid)

        const tripChat = await prismaMySQL.trip.findUnique({
            where: {
                IDTrip: tripID
            },
            select: {
                IDAccount: true,
                IDOriginTrip: true,
                Booking:true
            }
        })

        // if (custTrip?.Booking === 'BE') {
        //     const restTrip = await prismaMySQL.trip.findFirst({
        //         where: {
        //             IDTrip: custTrip?.IDOriginTrip as string
        //         },
        //         select: {
        //             IDAccount: true
        //         }
        //     })

        //     if (restTrip === null) {
        //         console.log("false trip")
        //         return resFalse();
        //     }
        //     console.log("IDAct rest is "+restTrip.IDAccount)
        //     if (restTrip.IDAccount !== uuid
        //         && custTrip?.IDAccount !== uuid) {
        //         console.log("flase user")
        //         return resFalse();
        //     }
        // }


        // const readerUserBooked: boolean = (custTrip?.Booking === 'BE' &&custTrip?.IDAccount === uuid)//cust
        // console.log("trip acccount id is "+custTrip?.IDAccount)
        // const readerUser = (custTrip?.Booking === 'BI' && custTrip?.IDAccount !== uuid)//newcust
        // console.log("readerUser is "+readerUser)
        try {
            // const resID = await prismaMySQL.trip.findUnique({
            //     where:{
            //         IDTrip:tripID
            //     }
            // })
            // const chatID : string = (readerUser)?uuid as string:custID
            const cust = !(uuid === tripChat?.IDAccount)
            console.log("cust is "+cust)
            const chatAccount = (cust)?uuid as string:custID
            console.log("chatAccount is"+chatAccount)
            const orgChat = await prismaMongo.orgChat.findFirst({
                where: {
                    IDTrip: tripID,
                    IDAccount:chatAccount??""
                }
            });
            // console.log(chatID)
            // console.log(orgChat)

            const updatedChat = orgChat?.Chat.map(chat => {
                if (cust) {
                    chat.readed = true;
                }
                else{
                    chat.orgReaded = true
                }
                return chat;
            });

            const result = updatedChat?.map(chat =>{
                return {
                    text:chat.message,
                    my:(chat.senderUser === cust) //XOR
                }
            })

                await prismaMongo.orgChat.updateMany({
                    where: {
                        IDTrip: tripID,
                        IDAccount:chatAccount
                    },
                    data: {
                        Chat: updatedChat,
                    }
                });
                return new Response(JSON.stringify(result), {
                    status: 200,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
            

        } catch (error) {
            console.log(error)
            return resFalse()
        }

    } catch (error) {
        if (error instanceof CustomError) {
            return resCustomError(error as CustomError)
        }
        else {
            throw error
        }
    }

};


// DELETE FROM checkpoint WHERE IDTrip = 'fbda33db-2c15-4cdb-86af-96a5b6f06cd6'; 10
// DELETE FROM joiner WHERE IDAccount = '0e51d7f7-6cd2-11ef-9f47-04421a0238fa' and IDTrip = '7c6ad9a0-6cd2-11ef-9f47-04421a0238fa'; 10
// DELETE FROM trip WHERE IDAccount = '0e51d7f7-6cd2-11ef-9f47-04421a0238fa' and IDTrip = 'fbda33db-2c15-4cdb-86af-96a5b6f06cd6'; my