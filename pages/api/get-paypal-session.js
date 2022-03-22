import axios from 'axios';
import { getApiCredentials } from '../../src/utils/order';

const paypalURL = process.env.PAYPAL_REST_URL;

const createOrder = (data, token)=> axios({
    url: `${paypalURL}/v2/checkout/orders`,
    method: 'POST',
    validateStatus: function (status) {
        return status < 500; // Resolve only if the status code is less than 500
      },
    headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}`
    },
    data,
});

export default async function handler(req, res) { 
    if (req.method === "POST") {
        const {data: { access_token }} = await getApiCredentials();
        const params = req?.body;
        try {
            const { data, error } =  await createOrder(params, access_token);
            res.status(200).json({ data, error});
        } catch(err) {
            res.status(200).json(err);
        }
    } else {
        res.setHeader("Allow", "POST");
        res.status(405).end("Method Not Allowed");
    }
}
