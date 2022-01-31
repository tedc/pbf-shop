import { getCsrfToken } from "next-auth/react";

export default  async ()=> {
    // const authToken = getAuthToken( req );
    // const isCookie =  Boolean( authToken );
    res.status( 200 ).json( { isLoggedIn : false } );
}