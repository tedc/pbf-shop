import { useContext, useEffect, useState } from 'react';
import { AppContext } from "../context/AppContext";
import Link from 'next/link';
import { isEmpty, isUndefined } from 'lodash';
import { v4 } from 'uuid';
import cx from 'classnames';
import {ShoppingCart} from '../icons';
import CartItem from './cart-page/CartItem';
import GET_CART from "../../queries/get-cart";
import UPDATE_CART from "../../mutations/update-cart";
import { useMutation, useQuery } from '@apollo/client';
import { getFormattedCart, getUpdatedItems } from "../../functions";
import { CSSTransition } from 'react-transition-group';
import { useSession } from 'next-auth/react';

const CartIcon = () => {
	const { cart, setCart, showInCart, setShowInCart } = useContext( AppContext );
    const [ isCartLoading, setIsCartLoading ] = useState( false );
    const {data: session } = useSession();
    
    const productsCount = ( null !== cart && Object.keys( cart ).length ) ? cart.totalProductsCount : '';
	const totalPrice = ( null !== cart && Object.keys( cart ).length ) ? cart.totalProductsPrice : '';
    const openCart = (event)=> {
        const matchMin = window.matchMedia(`(min-width:48em)`);
        if(matchMin.matches) {
            event.preventDefault();
            setShowInCart(true);
        }
        
    }
    const {data, refetch} = useQuery(GET_CART, {
        notifyOnNetworkStatusChange: true,
        context: {
            headers: {
                authorization: session?.accessToken ? `Bearer ${session?.accessToken}` : '',
            }
        },
        onCompleted: () => {
            // Update cart in the localStorage.
            const updatedCart = getFormattedCart(data);
            localStorage.setItem('woo-next-cart', JSON.stringify(updatedCart));

            // Update cart data in React Context.
            setCart(updatedCart);
        }
    });
    const [updateCart, { data: updateCartResponse, loading: updateCartProcessing, error: updateCartError }] = useMutation( UPDATE_CART, {
        context: {
            headers: {
                authorization: session?.accessToken ? `Bearer ${session?.accessToken}` : '',
            }
        },
        onCompleted: () => {
            console.log( 'UPDATE_CART' )
            refetch();
        },
        // onError: ( error ) => {
        //     if ( error ) {
        //         const errorMessage = error?.graphQLErrors?.[ 0 ]?.message ? error.graphQLErrors[ 0 ].message : '';
        //         setRequestError( errorMessage );
        //     }
        // }
    } );

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

	return (
        <div className="banner__cart">
    		{/*<Link href="/cart">
    			<a className="banner__cart-link" href="#" onClick={() => openCart(event)}>
    				Bag
    				{ productsCount ? <span> ({ productsCount })</span> : '' }

                	{/*{ totalPrice ? <span> { totalPrice }</span> : '' }
    			</a>
    		</Link>*/}
            <a className="banner__cart-link" href="/cart" onClick={() => openCart(event)}>
                Bag
                { productsCount ? <span> ({ productsCount })</span> : '' }

                {/*{ totalPrice ? <span> { totalPrice }</span> : '' }*/}
            </a>
            <CSSTransition in={showInCart} timeout={300} classNames="mini-cart-anim" unmountOnExit>
                <div className="mini-cart" onClick={() => setShowInCart(false)}>
                    <div className="mini-cart__wrapper">
                        <div className="mini-cart__close">Chiudi<i></i></div>
                        <h4 className="title title--font-size-12">Bag
                { productsCount ? <span> ({ productsCount })</span> : '' }</h4>
                            <>
                            { cart?.products?.length && (
                                cart?.products.map( item => (
                                    <CartItem
                                        key={ item.productId }
                                        item={ item }
                                        products={ cart.products }
                                        handleRemoveProductClick={ handleRemoveProductClick }
                                        updateCart={ updateCart }
                                        isMiniCart={ true }
                                    />
                                ) )
                            ) } 
                            </>
                            { productsCount && <Link href="/cart">
                                <a className="button button--rounded button--bg-black">
                                    Vai al carrello
                                    <ShoppingCart />
                                </a>
                            </Link> }
                        { ! productsCount && <><p>Il tuo carrello è vuoto</p><Link href="/prodotti">
                                <a className="button button--rounded button--bg-black">
                                    Vai allo shop
                                </a>
                            </Link></>}
                    </div>
                </div>
            </CSSTransition>
        </div>

	)
};

export default CartIcon;
