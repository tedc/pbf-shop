const WooCommerceRestApi = require("@woocommerce/woocommerce-rest-api").default;
import {isEmpty} from 'lodash'

const api = new WooCommerceRestApi({
    url: process.env.NEXT_PUBLIC_WORDPRESS_URL,
    consumerKey: process.env.WC_CONSUMER_KEY,
    consumerSecret: process.env.WC_CONSUMER_SECRET,
    version: "wc/v3",
    queryStringAuth: true,
    axiosConfig: {
        headers: { 'Content-Type': 'application/json' },
        insecureHTTPParser: true,
        auth: {
        username: process.env.WC_CONSUMER_KEY,
        password: process.env.WC_CONSUMER_SECRET
      },
    }
});

/**
 * Create order endpoint.
 *
 * @see http://woocommerce.github.io/woocommerce-rest-api-docs/?javascript#create-an-order
 *
 * @param {Object} req Request.
 * @param {Object} res Response.
 *
 * @return {Promise<{orderId: string, success: boolean, error: string}>}
 */
export default async function handler(req, res) {

    const responseData = {
        success: false,
        orderId: '',
        total: '',
        currency: '',
        error: ''
    }

    if ( isEmpty(req.body) ) {
        responseData.error = 'Required data not sent';
        return responseData
    }

    const data = req.body;
   

    try {
        const {data} = await api.post(
            'orders',
            req.body
        );

        responseData.success = true;
        responseData.orderId = data.number;
        responseData.total = data.total;
        responseData.currency = data.currency;
        responseData.status = data.status;

        res.json(responseData)

    } catch (error) {
        /**
         * Request usually fails if the data in req.body is not sent in the format required.
         *
         * @see Data shape expected: https://stackoverflow.com/questions/49349396/create-an-order-with-coupon-lines-in-woocomerce-rest-api
         */
        
        console.log(error.response)
        responseData.error = error;
        res.status(error.response.status).json(responseData);
    }
}
