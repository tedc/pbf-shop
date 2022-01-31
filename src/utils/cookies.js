import cookie from 'cookie';

export function parseCookies( req ) {
     return cookie.parse( req?.headers?.cookie ? req?.headers?.cookie : '' );
}

export function getAuthToken( req ) {
    const cookies = parseCookies( req );
    return cookies.auth || '' ;
}

export function getRefreshToken( req ) {
    const cookies = parseCookies( req );
    return cookies.refreshAuth || '' ;
}