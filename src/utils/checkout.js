import client from "../components/ApolloClient";
import {isEmpty, isArray} from 'lodash';
import { createCheckoutSession } from 'next-stripe/client' // @see https://github.com/ynnoj/next-stripe
import { loadStripe } from "@stripe/stripe-js";

import GET_STATES from "../queries/get-states";
import {createTheOrder, getCreateOrderData} from "./order";
import {clearTheCart} from "./cart";

import axios from 'axios';

/**
 * Get states
 *
 * @param {String} countryCode Country code
 *
 * @returns {Promise<void>}
 */
export const getStates = async ( countryCode ) => {
    const { data } = await client.query( {
        query: GET_STATES,
        variables: { countryCode: countryCode || '' }
    } )

    return data?.wooStates?.states ?? [];
}

/**
 * Set states for the country.
 *
 * @param {Object} target Target.
 * @param {Function} setTheStates React useState function to set the value of the states basis country selection.
 * @param {Function} setIsFetchingStates React useState function, to manage loading state when request is in process.
 *
 * @return {Promise<void>}
 */
export const setStatesForCountry = async ( target, setTheStates, setIsFetchingStates ) => {
    if ( 'country' === target.name ) {
        setIsFetchingStates(true);
        //const countryCode = target[target.selectedIndex].getAttribute('data-countrycode')
        const countryCode = target.value;
        console.log( countryCode )
        const states = await getStates( countryCode );
        setTheStates( states || [] );
        setIsFetchingStates(false);
    }
}

export const handleShippingDifferentThanBilling = ( input, setInput, target ) => {
    const newState = { ...input, [target.name]: ! input.shippingDifferentThanShipping };
    setInput( newState );
}

export const handleCreateAccount = ( input, setInput, target ) => {
    const newState = { ...input, [target.name]: ! input.createAccount };
    setInput( newState );
}

export const handleTerms = ( input, setInput, target ) => {
    const newState = { ...input, [target.name]: ! input.termsAndConditions };
    setInput( newState );
}


/**
 * Handle Stripe checkout.
 *
 * 1. Create Formatted Order data.
 * 2. Create Order using Next.js create-order endpoint.
 * 3. Clear the cart session.
 * 4. On success set show stripe form to true
 *
 * @param input
 * @param products
 * @param setRequestError
 * @param setShowStripeForm
 * @param clearCartMutation
 * @param setIsStripeOrderProcessing
 *
 */
export const handleStripeCheckout = async (input, products, setRequestError, clearCartMutation, setIsStripeOrderProcessing, setCreatedOrderData) => {
    setIsStripeOrderProcessing(true);
    const orderData = getCreateOrderData( input, products );
    orderData.set_paid = true;

    // On success show stripe form.
    try {
        const session = await createCheckoutSessionAndRedirect( products, input );
        const createCustomerOrder = await createTheOrder( orderData, setRequestError,  '' );
        setCreatedOrderData(createCustomerOrder);

        const cartCleared = await clearTheCart( clearCartMutation, createCustomerOrder?.error );
        setIsStripeOrderProcessing(false);

        if ( isEmpty( createCustomerOrder?.orderId ) || cartCleared?.error ) {
            setRequestError('Clear cart failed')
            return null;
        }
        return createCustomerOrder;
    } catch(error) {
        return error;
    }
    

    // try {
    //     const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
    //     if (stripe) {
    //         stripe.redirectToCheckout({ sessionId: session.id, successUrl : `${success_url}&order_id=${createCustomerOrder?.orderId}` });
    //     }
    // } catch (error) {
    //     console.log( input );
    // }

    return createCustomerOrder;
}

export const handlePayPalCheckout = async (input, products, setRequestError, clearCartMutation, setIsPaypalOrderProcessing, setCreatedOrderData) => {
    setIsPaypalOrderProcessing(true);
    const orderData = getCreateOrderData( input, products );
    const createCustomerOrder = await createTheOrder( orderData, setRequestError,  '' );
    const cartCleared = await clearTheCart( clearCartMutation, createCustomerOrder?.error );

    if ( isEmpty( createCustomerOrder?.orderId ) || cartCleared?.error ) {
        console.log( 'came in' );
        setRequestError('Clear cart failed');
        setIsPaypalOrderProcessing(false);
        return null;
    }

    // On success show stripe form.
    setCreatedOrderData(createCustomerOrder)
    const data = await createPayPalCheckoutSession( products, input, createCustomerOrder?.orderId );
    setIsPaypalOrderProcessing(false);
    return data;
}

export const handleSimpleCheckout = async (input, products, setRequestError, clearCartMutation, setIsSimpleOrderProcessing, setCreatedOrderData) => {
    setIsSimpleOrderProcessing(true);
    try {
        const orderData = getCreateOrderData( input, products );
        const createCustomerOrder = await createTheOrder( orderData, setRequestError,  '' );
        const cartCleared = await clearTheCart( clearCartMutation, createCustomerOrder?.error );
        setIsSimpleOrderProcessing(false);
        if ( isEmpty( createCustomerOrder?.orderId ) || cartCleared?.error ) {
            setRequestError('Clear cart failed')
            return null;
        }

        setCreatedOrderData(createCustomerOrder);
        return createCustomerOrder;

    } catch(error) {
        setIsSimpleOrderProcessing(false);
        setRequestError("Si è verificato un errore durante il pagamento.")
        return null;
    }
    
    

    // On success show stripe form.

}

const createCheckoutSessionAndRedirect = async ( products, input, orderId ) => {
    const sessionData = {
        success_url: window.location.origin + `/thank-you?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: window.location.href,
        customer_email: input?.billing?.email,
        line_items: getStripeLineItems( products ),
        metadata: getMetaData( input ),
        payment_method_types: ['card'],
        mode: 'payment'
    }
    
    try {
        const session = await createCheckoutSession(sessionData);
        return session;
        
    } catch(error) {
        console.log(input);
    }
    
}

const getStripeLineItems = (products) => {
    if (isEmpty(products) && !isArray(products)) {
        return [];
    }

    return products.map(product => {
        return {
            quantity: product?.qty ?? 0,
            name: product?.name ?? '',
            images: [product?.image?.sourceUrl ?? ''],
            amount: product?.price,
            currency: 'eur',
        }
    })
}

const createPayPalCheckoutSession = async ( products, input, orderId) => {
    let total = 0;
    const items = [];
    products.map(product => {
        const qty = product?.qty,
            amount = product?.price,
            subTotal = amount * qty
        total += subTotal;
        const item = {
            name: product?.name,
            quantity: qty,
            sku: product?.sku,
            category: 'PHYSICAL_GOODS',
            unit_amount: {
                currency_code: 'EUR',
                value: amount
            }
        };

        items.push(item);
    })
    const paypalData = {
        intent: 'CAPTURE',
        payer: {
            email_address: input?.billing?.email,
            name: {
                given_name: input?.billing?.firstName,
                surname: input?.billing?.lastName,
            },
            phone: {
                phone_number: { national_number : input?.billing?.phone }
            },
            address: {
                address_line_1: !input?.shippingDifferentThanShipping ? input?.billing?.address1 : input?.shipping?.address1,
                address_line_2: !input?.shippingDifferentThanShipping ? input?.billing?.address2 : input?.shipping?.address2,
                postal_code: !input?.shippingDifferentThanShipping ? input?.billing?.postcode : input?.shipping?.postcode,
                country_code: !input?.shippingDifferentThanShipping ? input?.billing?.country : input?.shipping?.country,
                admin_area_1: !input?.shippingDifferentThanShipping ? input?.billing?.state : input?.shipping?.state,
                admin_area_2: !input?.shippingDifferentThanShipping ? input?.billing?.city : input?.shipping?.city,
            }
        },
        purchase_units: [{
            amount: {
                currency_code: 'EUR',
                value: total,
                breakdown: {
                    item_total: {
                        currency_code: 'EUR',
                        value: total
                    }
                }
            },
            items,
        }],
        application_context: {
            user_action: 'PAY_NOW',
            brand_name: 'Professional By Fama',
            locale: 'it-IT',
            landing_page: 'LOGIN',
            return_url: window.location.origin + `/thank-you?order_id=${orderId}`,
            cancel_url: `${window.location.origin}/checkout`,
        }
    }

    try {
        const { data } = await axios.post('/api/get-paypal-session', paypalData);
        return data;
    } catch(error) {
        return error;
    }

}

/**
 * Get meta data.
 *
 * @param input
 * @param {String} orderId Order Id.
 *
 * @returns {{lineItems: string, shipping: string, orderId, billing: string}}
 */
export const getMetaData = ( input, orderId ) => {

    return {
        billing: JSON.stringify(input?.billing),
        shipping: JSON.stringify(input.billingDifferentThanShipping ? input?.billing?.email : input?.shipping?.email),
    };

    // @TODO
    // if ( customerId ) {
    //     metadata.customerId = customerId;
    // }

}
