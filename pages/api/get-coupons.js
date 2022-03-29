const WooCommerceRestApi = require("@woocommerce/woocommerce-rest-api").default;
import {isEmpty, isUndefined} from 'lodash'

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
    const input = req.body;

    console.log( input )
    const { data } = await api.get('coupons', {
        code: input?.coupon
    });
    const item = !isUndefined(data[0]) ? data[0] : null
    res.status(200).json( item );
}