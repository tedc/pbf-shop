import {loginUser} from '../../src/utils/login';
import cookie from 'cookie';

export default async function handler( req, res ) {
    const { username, password } = req?.body ?? {};
    try {
        const {data, errors} = await loginUser( {username, password} );

        res.setHeader( 'Set-Cookie', [
            cookie.serialize( 'auth', String( data?.login?.authToken ?? '' ), {
                httpOnly: true,
                secure: 'development' !== process.env.NODE_ENV,
                path: '/',
                maxAge: 300 // 1 week
            } ),
            cookie.serialize( 'refreshAuth', String( data?.login?.refreshToken ?? '' ), {
                httpOnly: true,
                secure: 'development' !== process.env.NODE_ENV,
                path: '/',
                maxAge: 60 * 60 * 24 * 7 // 1 week
            } )
        ]);
        res.status( 200 ).json( { success: Boolean( data?.login?.authToken ), data: data } );
    } catch(errors) {
        const error = {}
        if(errors?.message === 'invalid_username' || errors?.message === 'invalid_email') {
            error.message = 'Nome utente non valido o inesistente';
        } else if(errors?.message === 'incorrect_password') {
            error.message = 'Password errata';
        } else {
            error.message = 'Qualcosa è andato storto, riprova.'
        }
        res.status( 200 ).json( error );
    }
    // Only sending a message that successful, because we dont want to send JWT to client.
    
    
}