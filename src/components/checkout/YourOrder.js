import { Fragment } from 'react';
import CheckoutCartItem from "./CheckoutCartItem";
import { isEmpty, isNull, isUndefined } from 'lodash';

const YourOrder = ( { cart } ) => {

	return (
		<Fragment>
			{ cart ? (
				<Fragment>
					{/*Product Listing*/}
                    { cart.products.length && (
                        cart.products.map( item => (
                            <CheckoutCartItem
                                key={ item.productId }
                                item={ item }
                            />
                        ) )
                    ) }
					<div className="checkout__row">
                        SubTotale
                        <span>{ ( 'string' !== typeof cart?.subtotal ) ? cart?.subtotal.toFixed(2) : cart?.subtotal }</span>
                    </div>
                    <div className="checkout__row">
                        Spedizione
                        { !isNull(cart?.shippingTotal) && !isEmpty(cart?.shippingTotal) && !isUndefined(cart?.shippingTotal) && parseInt(cart?.shippingTotal) > 0 ? (
                            <span>{ ( 'string' !== typeof cart?.shippingTotal ) ? cart?.shippingTotal.toFixed(2) : cart?.shippingTotal }</span>
                        ) : (<span>Gratuita</span>)}
                    </div>
                        {/* <h2 className="text-2xl">Cart Total</h2> */}
                    <div className="checkout__total">
                        Totale (iva inc.)
                        <strong>{ ( 'string' !== typeof cart.totalProductsPrice ) ? cart.totalProductsPrice.toFixed(2) : cart.totalProductsPrice }</strong>
                    </div>
				</Fragment>
			) : '' }
		</Fragment>
	)
};

export default YourOrder;
