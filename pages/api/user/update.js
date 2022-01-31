import { getSession } from "next-auth/react";
import { UpdateUser } from '../../../src/utils/user';
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

    const inputs = req.body;
    try {

        const session = await getSession({req});

        const {data, error} = await UpdateUser(inputs, session?.accessToken);

        responseData.success = true;
        responseData.data = data;
        responseData.error = false;
        res.status(200).json(responseData)
    }  catch( error ) {
        responseData.error = error;
        res.status(200).json(responseData);
    }
    
}
