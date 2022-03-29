import Link from 'next/link';
import { useContext, useState, useEffect } from 'react';
import { AppContext } from "../../context/AppContext";
import { getFormattedCart, getUpdatedItems, removeItemFromCart } from '../../../functions';
import CartItemLocal from "./CartItemLocal";
import { v4 } from 'uuid';
import { isEmpty, isUndefined, isNull } from 'lodash';
import Title from '../../commons/Title';
import CartRelated from './CartRelated';
import FormCouponLocal from './FormCouponLocal';
import CartEmpty from './CartEmpty';
import cx from 'classnames';
import { SpinnerDotted } from 'spinners-react'; 
import { CSSTransition } from 'react-transition-group';
import { calculateShipping } from '../../../utils/cart';
import { stringifyPrice } from '../../../utils/cart';

const CartItemsContainerLocal = (props) => {
    const title = {
        size: 'title--font-size-38 title--grow-80-bottom',
        content: props?.page?.title,
    }
    const withHead = false;
    const categories = [];
    const kits = [];
    // @TODO wil use it in future variations of the project.
    const { miniCart, setMiniCart, cartFetching, setCartFetching } = useContext( AppContext );
    const [requestError, setRequestError] = useState( null );

    // Get Cart Data.
    /*
     * Handle remove product click.
     *
     * @param {Object} event event
     * @param {Integer} Product Id.
     *
     * @return {void}
     */

    const handleRemoveProductClick = ( event, products, id ) => {
        if(cartFetching) return;

        event.stopPropagation();
        if ( products.length ) {
            setCartFetching( true );
            // By passing the newQty to 0 in updateCart Mutation, it will remove the item.
            const cart = removeItemFromCart( id );
            setMiniCart( cart );
            setCartFetching( false );
        }
    };


    // Clear the entire cart.
    const handleClearCart = ( event ) => {

        event.stopPropagation();

        if ( clearCartProcessing ) {
            return;
        }
        localStorage.removeItem('woo-next-cart');
        setMiniCart( null );
    }
    const currentCart = miniCart;

    if(!isEmpty(currentCart)) {
        if(!isEmpty(currentCart?.products)) {
            currentCart?.products.map((product) => {
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
    return (
        <>
            { currentCart && <div className={cx('cart', {'cart--loading': cartFetching})}>
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
                            <table className="table table--cart">
                                <tbody>
                                { currentCart?.products?.length && (
                                    currentCart?.products.map( item => (
                                        <CartItemLocal
                                            key={ item.productId }
                                            item={ item }
                                            updateCartProcessing={ cartFetching }
                                            products={ currentCart.products }
                                            handleRemoveProductClick={ handleRemoveProductClick }
                                        />
                                    ) )
                                ) }
                                </tbody>
                            </table>
                        </div>

                        {/*Cart Total*/ }
                        <div className="column column--s4-md column--s3-lg">
                            <FormCouponLocal cart={currentCart} setRequestError={setRequestError} />
                            <div className="cart__summary">
                                <h4 className="title title--font-size-14 title--font-family-secondary title--normal title---grow-30-bottom">
                                    Riepilogo ordine
                                </h4>
                                <div className="cart__row">
                                    SubTotale
                                    <span>{ ( 'string' !== typeof currentCart?.subtotal ) ? stringifyPrice( currentCart?.subtotal.toFixed(2) ) : currentCart?.subtotal }</span>
                                </div>
                                <div className="cart__row">
                                    Spedizione
                                    { !isNull(currentCart?.shippingTotal) && !isEmpty(currentCart?.shippingTotal) && !isUndefined(currentCart?.shippingTotal) && parseInt(currentCart?.shippingTotal) > 0 ? (
                                        <span>{ ( 'string' !== typeof currentCart?.shippingTotal ) ? stringifyPrice( currentCart?.shippingTotal.toFixed(2)  ): currentCart?.shippingTotal }</span>
                                    ) : (<span>Gratuita</span>)}
                                </div>
                                { miniCart?.appliedCoupons && <div className="cart__row">
                                    Sconti
                                    { miniCart?.appliedCoupons?.map((c, index)=> (
                                        <span key={`${c?.id}-${index}`}></span>
                                    ))}
                                </div> }
                                    {/* <h2 className="text-2xl">Cart Total</h2> */}
                                <div className="cart__total">
                                    Totale (iva inc.)
                                    <strong>{ ( 'string' !== typeof currentCart?.totalProductsPrice ) ? stringifyPrice( currentCart?.totalProductsPrice.toFixed(2) ) : currentCart?.totalProductsPrice }</strong>
                                </div>
                                <Link href="/checkout">
                                    <a className="button button--bg-black button--rounded">
                                        Procedi con il pagamento
                                    </a>
                                </Link>
                            </div>
                        </div>

                    {/* Display Errors if any */}
                    { requestError ? <div className="column column--grow-30-top"><div className="message message--error"> { requestError } </div></div> : '' }
                    </div>
                    </div>
                </div>
                <CartRelated {...{categories, kits}} />
                </div>
            }
            <CSSTransition in={ isNull( currentCart ) || isEmpty( currentCart ) } classNames="fade-in" timeout={350} unmountOnExit>
            <div className={cx('cart', {'cart--loading': cartFetching})}>
                <CartEmpty />
            </div>
            </CSSTransition> 
            { cartFetching && <SpinnerDotted style={{ color: 'black', position: 'fixed', top: '50%', left: '50%', margin: '-25px 0 0 -25px', zIndex: 3}} /> }
            <style jsx>{
                `.fade-in-enter {
                    opacity: 0;
                }
                .fade-in-enter-active {
                    transition: opacity .35s;
                }
                .fade-in-exit {
                    opacity: 1;
                }
                .fade-in-exit-active {
                    opacity: 0;
                    transition: opacity .35s;
                }`
            }</style>   
        </>
    );
};

export default CartItemsContainerLocal;
