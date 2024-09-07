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
    code :number,
    message:string
}