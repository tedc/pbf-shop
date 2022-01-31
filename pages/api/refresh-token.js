import {refreshToken} from '../../src/utils/login';
import cookie from 'cookie';

export default async function handler( req, res ) {
    const { token } = req?.body ?? {};
    const data = await refreshToken( token );
    console.log( data?.refreshJwtAuthToken?.authToken )
    res.status(200).json( data );
}