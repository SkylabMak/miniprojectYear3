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
    imageURL:string,
    count: number
}

interface profile {
    name: string,
    Org: boolean,
    imgURL: string,

}

interface orgChat {
    custID: string
    IDTrip: string,// ของลูกค้า
    IDAccount: string,
    tripname: string
    IDOriginTrip: string,
    Lastmessage: string,
    readed: Boolean,
    custImgUrl: string,
    custName: string,
    bookDone: string,
    startTime: string
}

interface tripPageData {
    tripID: string
    tripIDOrigin: string
    head: string
    ownOrgTrip:boolean
    name: string
    detail: string
    startDate: string
    preparation: string
    booking: string
    org:string
    lastEdit: string
    private: string
    maxJoiner: string
    started: boolean
    me: Boolean
    unread: Boolean
    count: number
    join: Boolean
    imageURL:string
    hasToken:boolean
    checkpoint: {
        IDCheckpoint: string
        time: string,
        locationName: string
        type: string
        commentCount: number
        unRead: number
        orderC: number
        progress: progress[]
        me: boolean
    }[]
}
interface progress {
    IDAccount: string,
    imgURL: string,
    name: string
}

interface comment {
    text: string;
    name: string;
    imgUrl: string;
    readed: number;
    time:string
    my: boolean;
  }

interface chat{
    text: string;
    name: string;
    imgUrl: string;
    time:string;
    my: boolean;
}