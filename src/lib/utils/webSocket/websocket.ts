// Map to track online users by their userId and WebSocket connectio
export function getSocketID(idAccount:string,idTrip:string){
    return `${idAccount}+${idTrip}`
}