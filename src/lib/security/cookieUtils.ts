export const COOKIE_OPTIONS = {
    httpOnly: true,
    // secure: process.env.NODE_ENV === 'production',
    maxAge: 1 * 60 * 60, // a hr
    path: '/',
};