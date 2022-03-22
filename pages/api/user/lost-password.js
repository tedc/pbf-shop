import axios from 'axios';
import { isEmpty } from 'lodash';

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
    const { email } = req?.body;
    try {
        const { data } = await axios.post(`${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/pbf/v1/reset-password`, { email, token : process.env.PBF_API_SECRET });
    //console.log( `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/pbf/v1/update-pricelist` )
        responseData.success = data?.success;
        responseData.data = data?.data;
        responseData.error = !data?.success;
        res.status(200).json(responseData);
    } catch( error ) {
        responseData.error = error;
        res.status(200).json(responseData);
    }
    
}