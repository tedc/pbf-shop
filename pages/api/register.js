import axios from 'axios';
import {isEmpty} from 'lodash';
const url = `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/pbf/v1/register-form`;

export default async function handler( req, res ) {
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
        responseData.fields = req?.body

        res.status(200).json(responseData, );

    } catch (error) {
        /**
         * Request usually fails if the data in req.body is not sent in the format required.
         *
         * @see Data shape expected: https://stackoverflow.com/questions/49349396/create-an-order-with-coupon-lines-in-woocomerce-rest-api
         */
        responseData.success = false;
        responseData.error = error;
        res.status(200).json(responseData);
    }
}