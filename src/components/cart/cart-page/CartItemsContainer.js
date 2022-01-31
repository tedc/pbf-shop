import Link from 'next/link';
import { useContext, useState } from 'react';
import { AppContext } from "../../context/AppContext";
import { getFormattedCart, getUpdatedItems } from '../../../functions';
import CartItem from "./CartItem";
import { v4 } from 'uuid';
import { useMutation, useQuery } from '@apollo/client';
import UPDATE_CART from "../../../mutations/update-cart";
import GET_CART from "../../../queries/get-cart";
import CLEAR_CART_MUTATION from "../../../mutations/clear-cart";
import { isEmpty, isUndefined, isNull } from 'lodash';
import Title from '../../commons/Title';
import CartRelated from './CartRelated';
import FormCoupon from './FormCoupon';


const CartItemsContainer = (props) => {
    const title = {
        size: 'title--font-size-38 title--grow-80-bottom',
        content: props?.page?.title,
    }
    const withHead = false;
    const categories = [];
    const kits = [];
	// @TODO wil use it in future variations of the project.
	const { cart, setCart } = useContext( AppContext );
	const [requestError, setRequestError] = useState( null );

	// Get Cart Data.
	const { loading, error, data, refetch } = useQuery( GET_CART, {
		notifyOnNetworkStatusChange: true,
		onCompleted: () => {

			// Update cart in the localStorage.
			const updatedCart = getFormattedCart( data );
			localStorage.setItem( 'woo-next-cart', JSON.stringify( updatedCart ) );

			// Update cart data in React Context.
			setCart( updatedCart );
		}
	} );

	// Update Cart Mutation.
	const [updateCart, { data: updateCartResponse, loading: updateCartProcessing, error: updateCartError }] = useMutation( UPDATE_CART, {
		onCompleted: () => {
			refetch();
		},
		onError: ( error ) => {
			if ( error ) {
				const errorMessage = error?.graphQLErrors?.[ 0 ]?.message ? error.graphQLErrors[ 0 ].message : '';
				setRequestError( errorMessage );
			}
		}
	} );

	// Update Cart Mutation.
	const [clearCart, { data: clearCartRes, loading: clearCartProcessing, error: clearCartError }] = useMutation( CLEAR_CART_MUTATION, {
		onCompleted: () => {
			refetch();
		},
		onError: ( error ) => {
			if ( error ) {
				const errorMessage = ! isEmpty(error?.graphQLErrors?.[ 0 ]) ? error.graphQLErrors[ 0 ]?.message : '';
				setRequestError( errorMessage );
			}
		}
	} );

	/*
	 * Handle remove product click.
	 *
	 * @param {Object} event event
	 * @param {Integer} Product Id.
	 *
	 * @return {void}
	 */
	const handleRemoveProductClick = ( event, cartKey, products ) => {

		event.stopPropagation();
		if ( products.length ) {

			// By passing the newQty to 0 in updateCart Mutation, it will remove the item.
			const newQty = 0;
			const updatedItems = getUpdatedItems( products, newQty, cartKey );

			updateCart( {
				variables: {
					input: {
						clientMutationId: v4(),
						items: updatedItems
					}
				},
			} );
		}
	};

	// Clear the entire cart.
	const handleClearCart = ( event ) => {

		event.stopPropagation();

		if ( clearCartProcessing ) {
			return;
		}

		clearCart( {
			variables: {
				input: {
					clientMutationId: v4(),
					all: true
				}
			},
		} );
	}

    if(!isEmpty(cart)) {
        if(!isEmpty(cart.products)) {
            cart.products.map((product) => {
                if( !isEmpty( product?.kits ) && !isNull( product?.kits ) ) {
                    product?.node?.kits.map( (kit)=> {
                        kits.push(kit.databaseId);
                    })
                }
                if( !isEmpty( product?.categories ) && !isNull( product?.categories ) ) {
                    product?.categories.map( (cat)=> {
                        categories.push(cat.databaseId);
                    })
                }
            })
        }
    }

    

    // if(!isEmpty(cart.products)) {
    //     cart.products.map((product) => {
    //         if( !isEmpty( product?.kits ) && !isNull( product?.kits ) ) {
    //             product?.node?.kits.map( (kit)=> {
    //                 kits.push(kit.node.databaseId);
    //             })
    //         }
    //         if( !isEmpty( product?.categories ) && !isNull( product?.kits ) ) {
    //             product?.categories.map( (cat)=> {
    //                 categories.push(cat.node.databaseId);
    //             })
    //         }
    //     })
    // }

	return (
		<div className="cart">
			{ cart ? (
                <>
                <div className="columns columns--grow-140-bottom columns--jcc columns--shrink">
                    <div className="column column--s10-lg">
				    <div className="header">
						<Title title={title} />
						{/*Clear entire cart
						<div className="clear-cart text-right">
							<button className="px-4 py-1 bg-gray-500 text-white rounded-sm w-auto" onClick={ ( event ) => handleClearCart( event ) } disabled={ clearCartProcessing }>
								<span className="woo-next-cart">Clear Cart</span>
								<i className="fa fa-arrow-alt-right"/>
							</button>
							{ clearCartProcessing ? <p>Sto cancellando...</p> : '' }
							{ updateCartProcessing || applyCouponProcessing ? <p>In aggiornamento...</p> : null }
						</div>*/}
					</div>
                    <div className="columns columns--jcsb">
                        <div className="column column--s7-md column--s8-lg">
                            <table className="table">
								{ withHead && <thead className="text-left">
								<tr className="woo-next-cart-head-container">
									<th className="woo-next-cart-heading-el" scope="col"/>
									<th className="woo-next-cart-heading-el" scope="col"/>
									<th className="woo-next-cart-heading-el" scope="col">Product</th>
									<th className="woo-next-cart-heading-el" scope="col">Price</th>
									<th className="woo-next-cart-heading-el" scope="col">Quantity</th>
									<th className="woo-next-cart-heading-el" scope="col">Total</th>
								</tr>
								</thead> }
								<tbody>
								{ cart.products.length && (
									cart.products.map( item => (
										<CartItem
											key={ item.productId }
											item={ item }
											updateCartProcessing={ updateCartProcessing }
											products={ cart.products }
											handleRemoveProductClick={ handleRemoveProductClick }
											updateCart={ updateCart }
										/>
									) )
								) }
								</tbody>
							</table>
                        </div>

						{/*Cart Total*/ }
                        <div className="column column--s4-md column--s3-lg">
                            <FormCoupon cart={cart} setRequestError={setRequestError} refetch={refetch} />
    						<div className="cart__summary">
                                <h4 className="title title--font-size-14 title--font-family-secondary title--normal title---grow-30-bottom">
                                    Riepilogo ordine
                                </h4>
                                <div className="cart__row">
                                    SubTotale
                                    <span>{ ( 'string' !== typeof cart?.subtotal ) ? cart?.subtotal.toFixed(2) : cart?.subtotal }</span>
                                </div>
                                <div className="cart__row">
                                    Spedizione
                                    { !isNull(cart?.shippingTotal) && !isEmpty(cart?.shippingTotal) && !isUndefined(cart?.shippingTotal) && parseInt(cart?.shippingTotal) > 0 ? (
                                        <span>{ ( 'string' !== typeof cart?.shippingTotal ) ? cart?.shippingTotal.toFixed(2) : cart?.shippingTotal }</span>
                                    ) : (<span>Gratuita</span>)}
                                </div>
                                    {/* <h2 className="text-2xl">Cart Total</h2> */}
                                <div className="cart__total">
                                    Totale (iva inc.)
                                    <strong>{ ( 'string' !== typeof cart.totalProductsPrice ) ? cart.totalProductsPrice.toFixed(2) : cart.totalProductsPrice }</strong>
                                </div>
                                <Link href="/checkout">
                                    <a className="button button--bg-black button--rounded">
                                        Procedi con il pagamento
                                    </a>
                                </Link>
    						</div>
                        </div>

					{/* Display Errors if any */}
					{ requestError ? <div className="row woo-next-cart-total-container mt-5"> { requestError } </div> : '' }
                    </div>
                    </div>
				</div>
                <CartRelated {...{categories, kits}} />
                </>
			) : (
				<div className="columns columns--cart-empty columns--jcc columns--grow-140 columns--shrink">
                <div className="column column--s10">
					<h2 className="title title--font-size-38 title--grow-40-bottom">Il tuo carrello è vuoto</h2>
					<Link href="/prodotti">
						<button className="button button--rounded button--bg-black">
							Vai allo shop
						</button>
					</Link>
                </div>
				</div>
			) }
		</div>

	);
};

export default CartItemsContainer;
