import { prismaMongo } from '$lib/utils/database/noSqlDB';
import { prismaMySQL } from '$lib/utils/database/sqlDB';
import { getUUID } from '$lib/utils/uuidUtils';
import { error } from '@sveltejs/kit';

export async function copyTrip(
	trip: {
		IDAccount: string | null;
		IDTrip: string;
		TripName: string;
		Detail: string | null;
		Preparation: string | null;
		Booking: string | null;
		maxJoiner: number | null;
		imageURL: string | null;
		joiner: {
			IDTrip: string;
			IDAccount: string;
			type: string | null;
			status: string | null;
		}[];
	} | null, // Allow null here
	uuid: string,
	count: number,
	booking: boolean
) {
	try {
		if (!trip) {
			throw error;
		}
		let newIDTrip = await getTripID();
		// console.log("newIDTrip " + newIDTrip)
		const isoDate = getCurrentIsoDate();
		//copy trip
		await prismaMySQL.trip.create({
			data: {
				IDTrip: newIDTrip as string,
				IDOriginTrip: trip.IDTrip as string,
				IDAccount: uuid as string,
				TripName: trip?.TripName as string,
				Detail: trip?.Detail,
				Preparation: trip?.Preparation as string,
				Booking: booking ? 'BE' : 'NM',
				createDate: isoDate as string,
				lastEdit: isoDate as string,
				private: true,
				maxJoiner: count,
				started: false,
				count: 1,
				imageURL: trip.imageURL
			}
		});
		//copy checkpoint
		// const isoDateCK = new Date().toISOString();
		let originCK = await prismaMySQL.checkpoint.findMany({
			where: {
				IDTrip: trip.IDTrip
			}
		});
		let cpID: { IDTrip: string; IDCheckpoint: string }[] = [];
		const newCheckpoints = await Promise.all(
			originCK.map(async (e) => {
				const IDCheckpointTMP = await getCheckpointID();
				cpID.push({ IDCheckpoint: IDCheckpointTMP, IDTrip: newIDTrip });
				return {
					IDCheckpoint: IDCheckpointTMP,
					IDTrip: newIDTrip,
					OrderC: e.OrderC,
					time: e.time,
					locationName: e.locationName,
					detail: e.detail,
					type: e.type
				};
			})
		);

		await prismaMySQL.checkpoint.createMany({
			data: newCheckpoints
		});

		//nosql
		if (cpID.length > 0) {
			await prismaMongo.checkpointNSQL.createMany({
				data: cpID
			});
		} else {
			console.log('No checkpoint data to insert into MongoDB.');
		}
		if (booking) {
			const oldChat = (
				await prismaMongo.orgChat.findFirst({
					where: {
						IDTrip: trip.IDTrip,
						IDAccount: uuid as string
					},
					select: {
						Chat: true
					}
				})
			)?.Chat;
			// if(oldChat){
			//     await prismaMongo.orgChat.deleteMany({
			//         where:{
			//             IDTrip: trip.IDTrip,
			//             IDAccount: uuid as string
			//         }
			//     })
			// }
			await prismaMongo.orgChat.upsert({
				where: {
					IDTrip_IDAccount: {
						// This now refers to the unique combination
						IDTrip: trip.IDTrip,
						IDAccount: uuid as string
					}
				},
				update: {}, // No update if it already exists
				create: {
					IDTrip: trip.IDTrip,
					IDAccount: uuid as string,
					Chat: oldChat ?? []
				}
			});
		}
	} catch (error) {
		throw error;
	}
}

export async function deleateBETrip(tripID: string, IDAccount: string) {
	//origin trip
	try {
		await prismaMySQL.joiner.delete({
			where: {
				IDTrip_IDAccount: {
					IDTrip: tripID as string,
					IDAccount: IDAccount as string
				}
			}
		});
	} catch (error) {
		console.log('can not delete joiner');
	}

	const userIDTrip = await prismaMySQL.trip.findFirst({
		where: {
			IDOriginTrip: tripID,
			IDAccount: IDAccount,
			Booking: 'BE'
		},
		select: {
			IDTrip: true
		}
	});
	console.log('userIDTrip is ' + userIDTrip?.IDTrip);

	try {
		if (userIDTrip?.IDTrip != '') {
			await prismaMySQL.checkpoint.deleteMany({
				where: {
					IDTrip: userIDTrip?.IDTrip
				}
			});
		}
	} catch (error) {
		console.log('can not delete checkpoint');
	}

	try {
		await prismaMySQL.trip.delete({
			where: {
				IDTrip: userIDTrip?.IDTrip
			}
		});
	} catch (error) {
		console.log('can not delete trip');
	}

	//No sql deleate
	// await prismaMongo.orgChat.deleteMany({
	//     where:{
	//         IDTrip:tripID,
	//         IDAccount:IDAccount
	//     }
	// })
	try {
		if(tripID != ''){
			await prismaMongo.checkpointNSQL.deleteMany({
				where: {
					IDTrip: userIDTrip?.IDTrip
				}
			});
		}
	} catch (error) {
		console.log('can not delete checkpointNSQL');
	}
}

export async function deleateTrip(tripID: string) {
	try {
		if (tripID != '') {
			await prismaMySQL.checkpoint.deleteMany({
				where: {
					IDTrip: tripID
				}
			});
		}
	} catch (error) {
		console.log('can not delete checkpoint');
	}

	try {
		if(tripID != ''){
		await prismaMongo.orgChat.deleteMany({
			where: {
				IDTrip: tripID
			}
		});
	}
	} catch (error) {
		console.log('can not delete orgChat');
	}

	try {
		await prismaMySQL.trip.delete({
			where: {
				IDTrip: tripID
			}
		});
	} catch (error) {
		console.log('can not delete trip');
	}

	//No sql deleate
	try {
		if(tripID != ''){
			await prismaMongo.checkpointNSQL.deleteMany({
				where: {
					IDTrip: tripID
				}
			});
		}
		
	} catch (error) {
		console.log('can not delete checkpointNSQL');
	}
}

export async function checkExistTrip(uuid: string) {
	const recordExists = await prismaMySQL.trip.findUnique({
		where: {
			IDTrip: uuid
		}
	});
	return recordExists != null;
}

export async function checkExistCheckpoint(uuid: string) {
	const recordExists = await prismaMySQL.checkpoint.findFirst({
		where: {
			IDCheckpoint: uuid
		}
	});
	return recordExists != null;
}

export async function getCheckpointID(): Promise<string> {
	let newIDCheckpoint = getUUID();
	while (await checkExistCheckpoint(newIDCheckpoint)) {
		newIDCheckpoint = getUUID();
	}
	// console.log('newIDCheckpoint ' + newIDCheckpoint);
	return newIDCheckpoint as string;
}

export async function getTripID(): Promise<string> {
	//copy
	let newIDTrip = getUUID();
	while (await checkExistTrip(newIDTrip)) {
		newIDTrip = getUUID();
	}
	return newIDTrip as string;
}

export function getCurrentIsoDate() {
	return new Date().toISOString();
}
