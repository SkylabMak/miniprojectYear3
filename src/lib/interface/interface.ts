type Token = {
    access_token: string;
    id_token?: string; // Optional because it might not always be present
    refresh_token?: string;
    scope?: string;
    token_type?: string;
    expiry_date?: number;
};

interface googleInfo {
    Google_ID: string;
    Email: string;
    name: string
}

interface customError {
    code: number,
    message: string
}

interface tripCard {
    tripID: string,
    name: string,
    detail: string,
    startDate: string,
    by: string,
    org: boolean,
    count: number
}

interface profile {
    name: string,
    Org: boolean,
    imgURL: string,

}

interface orgChat {
    IDTrip: string,// ของลูกค้า
    IDAccount: string,
    tripname:string
    IDOriginTrip: string,
    Lastmessage: string,
    readed: Boolean,
    custImgUrl: string,
    custName: string,
    bookDone: string,
    startTime: string
}