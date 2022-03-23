import client from "../../../src/components/ApolloClient"; 
import { GET_ORDERS } from '../../../src/queries/users/get-user'; 
import { getSession } from "next-auth/react";
import { isEmpty } from 'lodash';

export default async function handler(req, res) {

    const responseData = {
        success: false,
        data: '',
        error: ''
    }
    if ( isEmpty(req.body) ) {
        responseData.error = 'Required data not sent';
        return responseData;
    }
    const session = await getSession({req});
    const { customerId } = req?.body;
    try {
        const { data, errors } = await client.query( {
            query: GET_ORDERS,
            variables: {
                customerId
            },
            context: {
                headers: {
                    'authorization' : session?.accessToken ? `Bearer ${session?.accessToken}`: '',
                }
            },
        } );
        responseData.success = true;
        responseData.data = data;
        responseData.error = errors;
        res.status(200).json(responseData);
    } catch(error) {
        responseData.error = error;
        res.status(200).json(responseData);
    }
}