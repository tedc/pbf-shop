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
    
    const inputs = req.body;
    try {
        const {data, error} = await UpdateUser(inputs, '', false);
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
