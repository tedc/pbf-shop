import axios from 'axios';
import {isEmpty} from 'lodash';
export default async function handler( req, res ) {
    const url = `${process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL}/wp-json/pbf/v1/register-forms`;
    //res.status(200).json({ url: url});
    const responseData = {
        success: false,
        message: '',
        redirect: '',
        error: ''
    }

    if ( isEmpty(req.body) ) {
        responseData.error = 'Required data not sent';
        return responseData
    }
    try {
        const {data} = await axios.post(
            url,
            req.body
        );
        responseData.success = true;
        responseData.message = data.message;
        responseData.redirect = data.redirect;

        res.status(200).json(responseData);

    } catch (error) {
        /**
         * Request usually fails if the data in req.body is not sent in the format required.
         *
         * @see Data shape expected: https://stackoverflow.com/questions/49349396/create-an-order-with-coupon-lines-in-woocomerce-rest-api
         */
        
        responseData.error = error;
        res.status(error.response.status).json(responseData);
    }
}