import { buffer } from "micro";
import axios from 'axios';
import { getApiCredentials } from '../../src/utils/order';

const paypalURL = process.env.PAYPAL_REST_URL;

const WooCommerceRestApi = require("@woocommerce/woocommerce-rest-api").default;

// export const config = {
//     api: {
//         bodyParser: false,
//     },
// };

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
 * Update Order.
 *
 * Once payment is successful or failed,
 * Update Order Status to 'Processing' or 'Failed' and set the transaction id.
 *
 * @param {String} newStatus Order Status to be updated.
 * @param {String} orderId Order id
 * @param {String} transactionId Transaction id.
 *
 * @returns {Promise<void>}
 */
const updateOrder = async ( newStatus, orderId, transactionId = '' ) => {

    let newOrderData = {
        status: newStatus
    }

    if ( transactionId ) {
        newOrderData.transaction_id = transactionId
    }

    try {
        const {data} = await api.put( `orders/${ orderId }`, newOrderData );
        console.log( '✅ Order updated data', data );
    } catch (ex) {
        console.error('Order creation error', ex);
        throw ex;
    }
}

const checkOrder = (id, token)=> axios({
    url: `${paypalURL}/v2/checkout/orders/${id}/capture`,
    method: 'POST',
    validateStatus: function (status) {
        return status < 500; // Resolve only if the status code is less than 500
      },
    headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}`
    },
});


const getOrder = (id, token)=> axios({
    url: `${paypalURL}/v2/checkout/orders/${id}`,
    method: 'GET',
    validateStatus: function (status) {
        return status < 500; // Resolve only if the status code is less than 500
      },
    headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}`
    },
});



export default async function handler(req, res) {
    //if (req.method === "POST") {
        const body = req?.body;
        const authorize = await getApiCredentials();
        const access_token = authorize?.data?.access_token;
        const token = body?.token;
        const order_id = body?.order_id;
            
        try {
            const { data } = await checkOrder(token, access_token);
            let status;
            if( data?.name === 'UNPROCESSABLE_ENTITY') {
                const { data : checkData } = await getOrder(token, access_token);
                status = checkData?.status;
            } else {
                status = data?.status;
            }

            if( status === 'COMPLETED' ) {
                try {
                    await updateOrder( 'processing', order_id, token );
                    console.log( 'processing ')
                    
                    res.status(200).json({ success: true });
                } catch (error) {
                    await updateOrder( 'failed', order_id );
                    res.status(200).json({ success: false });
                }
            } else {
                await updateOrder( 'failed', order_id );
                res.status(200).json({ success: false });
            }
        } catch(error) {
            res.status(200).json({ success: false });
        }
    // } else {
    //     res.setHeader("Allow", "POST");
    //     res.status(405).end("Method Not Allowed");
    // }
};
