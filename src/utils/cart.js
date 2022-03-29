import { v4 as uuidv4 } from 'uuid';
import { isUndefined } from 'lodash';
/**
 * Clear the cart.
 *
 * @param {function} clearCartMutation clearCartMutation function
 * @param {string} previousRequestError Error from previous request.
 *
 * @returns {Promise<{cartCleared: boolean, error: string}>}
 */
export const clearTheCart = async (clearCartMutation, previousRequestError) => {
    let response = {
        cartCleared: false,
        error: ''
    };

    // Don't proceed if previous request has error.
    if ( previousRequestError ) {
        response.error = previousRequestError;
        return response;
    }

    try {
        const {data} = await clearCartMutation( {
            variables: {
                input: {
                    clientMutationId: uuidv4(),
                    all: true,
                },
            },
        } );

        response.cartCleared = data?.removeItemsFromCart?.cartItems.length;

    } catch ( err ) {
        response.error = err.message;
    }

    return response;
}


/**
 * @TODO will update this in future, when required.
 * Handles adding items to the cart.
 *
 * @return {void}
 */


export const stringifyPrice = price => {
    const number = price.split('.');
    let newPrice = number[1] === '00' ? `€${number[0]}` : price;
    if(!/(€)/.test(newPrice)) {
        newPrice = new new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(newPrice);
        newPrice = newPrice.split(' ');
        newPrice = `${newPrice[1]}${newPrice[0]}`;
        newPrice = newPrice.split(',');
        newPrice = newPrice[1] === '00' ? newPrice[0] : `${newPrice[0]},${newPrice[1]}`;
    }
    return newPrice
}

export const calculateShipping = (data, total) => {
    const { methods } = data;
    if (methods.length === 1) {
        const title = methods[0].method_title;
        const cost = parseFloat( methods[0]?.settings?.cost?.value );
        return {
            title, cost
        }
    } else {
        let current = {};
        methods.map((method)=> {
            if( !isUndefined( method?.settings?.requires) ) {
                const requires = method?.settings?.requires?.value;
                const requirement = method?.settings[requires]?.value;
                if( total >= parseFloat(requirement) ) {
                    const cost = method?.method_id === 'free_shipping' ? 0 : parseFloat( methods[0]?.settings?.cost?.value );
                    current = {
                        title: method?.method_title,
                        cost
                    }
                }
            } else {
                current = { title: method?.method_title, cost: parseFloat( method?.settings?.cost?.value ) };
            }
        });
        return current;
    }
}