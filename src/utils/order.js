import {isArray, isEmpty} from "lodash";
import axios from 'axios';import client from "../components/ApolloClient";
import CREATE_ORDER from '../mutations/create-order';
import { v4 } from 'uuid';

/**
 * Get line items for stripe
 *
 * @param {array} products Products.
 *
 * @returns {*[]|*} Line items, Array of objects.
 */
export const getStripeLineItems = ( products ) => {

    if ( isEmpty( products ) || !isArray( products ) ) {
        return []
    }

    return products?.map(
        ( { productId, name, price, qty: quantity, image } ) => {
            return {
                price: price?.toString(), // The reason we pass price here and not total, because stripe multiplies it with qty.
                quantity,
                name,
                image,
                productId,
            };
        },
    );
}

/**
 * Get line items for create order
 *
 * @param {array} products Products.
 *
 * @returns {*[]|*} Line items, Array of objects.
 */
export const getCreateOrderLineItems = (products) => {

    if (isEmpty(products) || !isArray( products )) {
        return []
    }

    return products?.map(
        ({productId, qty: quantity}) => {
            return {
                quantity,
                product_id: productId,
                // variation_id: '', // @TODO to be added.
            };
        },
    );
}


export const getCreateGraphOrderLineItems = (products) => {

    if (isEmpty(products) || !isArray( products )) {
        return []
    }

    return products?.map(
        ({productId, qty: quantity}) => {
            return {
                quantity,
                productId,
                // variation_id: '', // @TODO to be added.
            };
        },
    );
}

/**
 * Get Formatted create order data.
 *
 * @param order
 * @param products
 * @return {{shipping: {country: *, city: *, phone: *, address_1: (string|*), address_2: (string|*), postcode: (string|*), last_name: (string|*), company: *, state: *, first_name: (string|*), email: *}, payment_method_title: string, line_items: (*[]|*), payment_method: string, billing: {country: *, city: *, phone: *, address_1: (string|*), address_2: (string|*), postcode: (string|*), last_name: (string|*), company: *, state: *, first_name: (string|*), email: *}}}
 */
export const getCreateOrderData = (order, products) => {
    // Set the billing Data to shipping, if applicable.
    const shippingData = order.shippingDifferentThanShipping ? order.shipping : order.billing;

    // Checkout data.
    return {
        shipping: {
            first_name: shippingData?.firstName,
            last_name: shippingData?.lastName,
            address_1: shippingData?.address1,
            address_2: shippingData?.address2,
            city: shippingData?.city,
            country: shippingData?.country,
            state: shippingData?.state,
            postcode: shippingData?.postcode,
            email: shippingData?.email,
            phone: shippingData?.phone,
            company: shippingData?.company,
        },
        billing: {
            first_name: order?.billing?.firstName,
            last_name: order?.billing?.lastName,
            address_1: order?.billing?.address1,
            address_2: order?.billing?.address2,
            city: order?.billing?.city,
            country: order?.billing?.country,
            state: order?.billing?.state,
            postcode: order?.billing?.postcode,
            email: order?.billing?.email,
            phone: order?.billing?.phone,
            company: order?.billing?.company,
            vat: order?.billing?.vat
        },
        payment_method: order?.paymentMethod,
        line_items: getCreateOrderLineItems( products ),
        set_paid : order?.set_paid ?? false
    };
}



export const getCreateGraphOrderData = (order, products)=> {
    const shippingData = order.shippingDifferentThanShipping ? order.shipping : order.billing;
    const coupons = [];
    if( order?.discountAmount ) {
        order?.discountAmount.map((c)=> {
            coupons.push(c?.code);
        })
    }
    console.log( order );
    return {
        shipping: {
            firstName: shippingData?.firstName,
            lastName: shippingData?.lastName,
            address1: shippingData?.address1,
            address2: shippingData?.address2,
            city: shippingData?.city,
            country: shippingData?.country,
            state: shippingData?.state,
            postcode: shippingData?.postcode,
            email: shippingData?.email,
            phone: shippingData?.phone,
            company: shippingData?.company,
        },
        billing: {
            firstName: order?.billing?.firstName,
            lastName: order?.billing?.lastName,
            address1: order?.billing?.address1,
            address2: order?.billing?.address2,
            city: order?.billing?.city,
            country: order?.billing?.country,
            state: order?.billing?.state,
            postcode: order?.billing?.postcode,
            email: order?.billing?.email,
            phone: order?.billing?.phone,
            company: order?.billing?.company,
            vat: order?.billing?.vat
        },
        paymentMethod: order?.paymentMethod,
        lineItems: getCreateGraphOrderLineItems( products ),
        isPaid : order?.set_paid ?? false,
        coupons
    }
}


/**
 * Create order.
 *
 * @param {Object} orderData Order data.
 * @param {function} setOrderFailedError sets the react state to true if the order creation fails.
 * @param {string} previousRequestError Previous request error.
 *
 * @returns {Promise<{orderId: null, error: string}>}
 */
export const createTheOrder = async ( orderData, setOrderFailedError, previousRequestError ) => {
    let response = {
        orderId: null,
        total: '',
        currency: 'eur',
        error: ''
    };

    // Don't proceed if previous request has error.
    if ( previousRequestError ) {
        response.error = previousRequestError;
        return response;
    }

    setOrderFailedError( '' );

    try {
        const request = await fetch( '/api/create-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify( orderData ),
        } );
        // const result = await request.json();
        
        //const request = axios({ url: '/api/create-order', data:orderData})
        const result = await request.json();
        if ( result.error ) {
            response.error = result.error;
            setOrderFailedError( 'Something went wrong. Order creation failed. Please try again' );
        }
        response.orderId = result?.orderId ?? '';
        response.total = result.total ?? '';
        response.currency = result.currency ?? '';
        response.status = result.staus ?? 'pending';

    } catch ( error ) {
        // @TODO to be handled later.
        console.warn( 'Handle create order error', error?.message );
           
    }

    return response;
}

export const createTheGraphOrder = async (orderData, setOrderFailedError, previousRequestError, session )=> {
    let response = {
        orderId: null,
        total: '',
        currency: 'eur',
        error: ''
    };

    // Don't proceed if previous request has error.
    if ( previousRequestError ) {
        response.error = previousRequestError;
        return response;
    }

    setOrderFailedError( '' );
    try {
        const { data } = await client.mutate( {
            mutation: CREATE_ORDER,
            variables: {
                input: {
                    clientMutationId: v4(), // Generate a unique id
                    ...orderData
                },
            },
            context: {
                headers: {
                    'authorization' : session?.accessToken ? `Bearer ${session?.accessToken}`: '',
                }
            },
        } );
        response.orderId = data?.createOrder?.orderId ?? '';
        response.total = data?.createOrder?.order?.total ?? '';
        response.currency = data?.createOrder?.order?.currency ?? '';
        response.status = data?.createOrder?.order?.status ? status( data?.createOrder?.order?.status ) : 'pending';

    } catch( error ) {
        console.log(error);
        console.warn( 'Handle create order error', error?.message );
    }
    return response;
}

export const status = (v)=> {
    const s = v.toUpperCase();
    let string;
    if( s === 'PENDING') {
        string = 'In attesa di pagamento';
    } else if ( s === 'PROCESSING') {
        string = 'In lavorazione';
    } else if( s === 'ON_HOLD' ) {
        string = 'Sospeso'
    } else if( s === 'COMPLETED') {
        string = 'Completato';
    } else if( s === 'CANCELLED') {
        string = 'Annullato';
    } else if( s === 'CANCELLED') {
        string = 'Annullato';
    } else if( s === 'REFUNDED') {
        string = 'Rimborsato';
    } else if( s === 'FAILED') {
        string = 'Fallito';
    }
    return string;
}

export const getOrderData = (order)=> {
    let obj = {};
    Object.entries(order).map( ([key, value])=> {
        let k  = '';
        if( key === 'date_created') {
            k = 'date';
            obj = {
                ...obj,
                [k] :value
            }
        } else if( key === 'number') {
            obj = {
                ...obj,
                orderNumber :value
            }
        }  else {
            if( key === 'billing' || key === 'shipping') {
                if( key === 'billing') {
                    obj = {
                        ...obj,
                        hasBillingAddress  : !isEmpty(order?.billing, true)
                    }
                } else {
                    obj = {
                        ...obj,
                        hasShippingAddress  : !isEmpty(order?.billing, true)
                    }
                }

                const subObj = {};
                Object.entries(value).map( ([sk, v])=> {
                    let subK = '';
                    if( /(address_)/.test(sk) ) {
                        subK = sk.replace('_', '');
                    } else {
                        const keyObj = sk.split('_');
                        keyObj.map((newK, index)=> {
                            if( index === 0) {
                                subK += newK;
                            } else {
                                const str = newK.charAt(0).toUpperCase() + newK.slice(1);
                                subK += str;
                            }
                        });
                    }
                    subObj[subK] = v;
                });
                obj = {
                    ...obj,
                    [key] :subObj
                }
            } else {
                const keyObj = key.split('_');
                keyObj.map((newK, index)=> {
                    if( index === 0) {
                        k += newK;
                    } else {
                        const str = newK.charAt(0).toUpperCase() + newK.slice(1);
                        k += str;
                    }
                });
                obj = {
                    ...obj,
                    [k] :value
                }
            }
        } 
        
    });

    return obj;
}

export const getApiCredentials = ()=> axios({
    url: `${process.env.PAYPAL_REST_URL}/v1/oauth2/token`,
    method: 'post',
    headers: {
        Accept: 'application/json',
        'Accept-Language': 'it_IT',
        'content-type': 'application/x-www-form-urlencoded',
    },
    auth: {
        username: process.env.PAYPAL_CLIENT_ID,
        password: process.env.PAYPAL_CLIENT_SECRET,
    },
    params: {
        grant_type: 'client_credentials',
    },
});
