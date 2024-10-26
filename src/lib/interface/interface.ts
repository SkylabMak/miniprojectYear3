type Token = {
	access_token: string;
	id_token?: string; // Optional because it might not always be present
	refresh_token?: string;
	scope?: string;
	token_type?: string;
	expiry_date?: number;
};

interface joinerList {
	name: string;
	imgURL: string;
}

interface googleInfo {
	Google_ID: string;
	Email: string;
	name: string;
	url: string;
}

interface customError {
	code: number;
	message: string;
}

interface tripCard {
	tripID: string;
	name: string;
	detail: string;
	startDate: string;
	by: string;
	org: boolean;
	imageURL: string;
	count: number;
	people: number;
	peopleMax: number;
}

interface profile {
	name: string;
	Org: string;
	imgURL: string;
}

interface orgChat {
	IDTrip: string; // ของที่พัก
	IDTripCust: string; // ของลูกค้า
	IDAccount: string;
	tripname: string;
	IDOriginTrip: string;
	Lastmessage: string;
	readed: boolean;
	custImgUrl: string;
	custName: string;
	bookDone: string;
	startTime: string;
	count: number;
}

interface tripPageData {
	tripID: string;
	tripIDOrigin: string;
	head: boolean;
	ownOrgTrip: boolean;
	name: string;
	detail: string;
	startDate: string;
	preparation: string;
	booking: string;
	org: string;
	lastEdit: string;
	private: boolean;
	maxJoiner: number;
	started: boolean;
	me: boolean;
	unread: boolean;
	count: number;
	join: boolean;
	imageURL: string;
	hasToken: boolean;
	checkpoint: checkpoint[];
}
interface progress {
	IDAccount: string;
	imgURL: string;
	name: string;
}

interface comment {
	text: string;
	name: string;
	imgUrl: string;
	readed: number;
	time: string;
	my: boolean;
}

interface chat {
	text: string;
	name: string;
	imgUrl: string;
	time: string;
	my: boolean;
}

interface chatSEE {
	text: string;
	name: string;
	imgUrl: string;
	time: string;
	rest: boolean;
}

interface checkpoint {
	IDCheckpoint: string;
	time: string;
	locationName: string;
	type: string;
	commentCount: number;
	unRead: number;
	orderC: number;
	progress: progress[];
	me: boolean;
}
