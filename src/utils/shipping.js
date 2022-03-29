const WooCommerceRestApi = require("@woocommerce/woocommerce-rest-api").default;
const api = new WooCommerceRestApi({
    url: process.env.NEXT_PUBLIC_WORDPRESS_URL,
    consumerKey: process.env.NEXT_PUBLIC_WC_CONSUMER_KEY,
    consumerSecret: process.env.NEXT_PUBLIC_WC_CONSUMER_SECRET,
    version: "wc/v3",
    queryStringAuth: true,
    axiosConfig: {
        headers: { 'Content-Type': 'application/json' },
        insecureHTTPParser: true,
        auth: {
            username: process.env.NEXT_PUBLIC_WC_CONSUMER_KEY,
            password: process.env.NEXT_PUBLIC_WC_CONSUMER_SECRET
        },
    }
});

export async function shippingZones() {
    try {
        const { data } = await api.get('shipping/zones');
        return data;
    } catch(error) {
        return error;
    }
    
}

export async function shippingMethods(zone) {
    try {
        const { data : methods } = await api.get(`shipping/zones/${zone}/methods`);
        const { data : locations } = await api.get(`shipping/zones/${zone}/locations`);
        return { methods, locations };
    } catch(error) {
        return error;
    }
    
}