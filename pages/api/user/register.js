import { getSession } from "next-auth/react";
import { UpdateUser } from '../../../src/utils/user';
import { isEmpty, isUndefined, isNull } from 'lodash';
import axios from 'axios';
import { signIn } from "next-auth/react";

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
    if (isNull(session)) {
        responseData.error = 'Devi essere loggato';
        res.status(401).json(responseData);
    }
    const inputs = req.body;
    try {
        const fields = {...inputs};
        if( !isUndefined(fields.pricelist) ) {
            delete fields.pricelist;
        }
        const {data, error} = await UpdateUser(fields, session?.accessToken, false);
        if( !isEmpty( inputs?.pricelist ) ) {
            try {
                const user_id = (data?.createCustomer?.customer?.databaseId) ? data?.createCustomer?.customer?.databaseId : null;
                const { data : products } = await axios.post(`${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/pbf/v1/update-pricelist`, { user_id, pricelist: inputs?.pricelist, token : process.env.PBF_API_SECRET });
            //console.log( `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/pbf/v1/update-pricelist` )
                responseData.products = products;
                responseData.success = true;
                responseData.data = data;
                responseData.error = false;
                res.status(200).json(responseData);
            } catch( error ) {
                responseData.error = error;
                res.status(200).json(responseData);
            }
            
        }
        responseData.success = true;
        responseData.data = data;

        responseData.error = false;
        //console.log( data )
        res.status(200).json(responseData)
    }  catch( error ) {
        responseData.error = error;
        res.status(200).json(responseData);
    }
}
