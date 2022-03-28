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

export default async function handler(req, res) {
    const responseData = {
        success: false,
        order: '',
    }
    const id = req?.query?.order_id;
    try {
        const {data} = await api.get(
            `orders/${id}`,
        );

        responseData.success = true;
        responseData.order = data;
        console.log( data )
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