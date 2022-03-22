import axios from 'axios';
import { isEmpty } from 'lodash';
import { ResetPassword } from '../../../src/utils/user';

export default async function handler(req, res) {
    if(req.method !== 'POST') {
        res.status(500);
    }
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
        const {data, error} = await ResetPassword(inputs);
        responseData.success = true;
        responseData.data = data;
        responseData.error = false;
        res.status(200).json(responseData)
    }  catch( error ) {
        responseData.error = error;
        res.status(200).json(responseData);
    }
    
}