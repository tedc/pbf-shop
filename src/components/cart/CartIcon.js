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
import { getFormattedCart, getUpdatedItems, addToCart, removeItemFromCart } from "../../functions";
import { CSSTransition } from 'react-transition-group';
import { useSession } from 'next-auth/react';
import { SpinnerDotted } from 'spinners-react'; 
import { useRouter } from 'next/router';

const CartIcon = () => {
	const { miniCart, setMiniCart, cart, setCart, showInCart, setShowInCart, cartLoading, setCartLoading, setMenuVisibility } = useContext( AppContext );
    const [ isCartLoading, setIsCartLoading ] = useState( false );
    const {data: session } = useSession();
    const cartStorage = process?.browser ? window.localStorage.getItem( 'woo-next-cart' ) : null;
    const router = useRouter();
    
    const productsCount = ( null !== miniCart && Object.keys( miniCart ).length ) ? miniCart.totalProductsCount : '';
	const totalPrice = ( null !== miniCart && Object.keys( miniCart ).length ) ? miniCart.totalProductsPrice : '';
    const openCart = (event)=> {
        const matchMin = window.matchMedia(`(min-width:48em)`);
        if(matchMin.matches) {
            event.preventDefault();
            if( router?.asPath.indexOf('cart') === -1) {
                setShowInCart(true);
                setMenuVisibility( true );
            }
        } else {
            if( router?.asPath.indexOf('cart') !== -1) {
                event.preventDefault();
            }
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
            if( updatedCart ) {
                localStorage.setItem('woo-next-cart', JSON.stringify(updatedCart));
            } else {
                localStorage.removeItem('woo-next-cart');
            }
            

            // Update cart data in React Context.
            setCart(updatedCart);
            setMiniCart(updatedCart);
            setCartLoading( false );
        }
    });
    const [updateCart, { data: updateCartResponse, loading: updateCartProcessing, error: updateCartError }] = useMutation( UPDATE_CART, {
        context: {
            headers: {
                authorization: session?.accessToken ? `Bearer ${session?.accessToken}` : '',
            }
        },
        onCompleted: () => {
            refetch();
        },
    } );

    const handleRemoveProductClick = ( event, cartKey, products, id ) => {

        event.stopPropagation();
        if ( products.length ) {
            setCartLoading( true );
            // By passing the newQty to 0 in updateCart Mutation, it will remove the item.
            
            removeItemFromCart( id );
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

    useEffect(()=> {
        const newCart = JSON.parse(cartStorage);
        setMiniCart( newCart );
        setCartLoading( false );
    }, [ cartStorage ])

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
                <div className={cx("mini-cart", {"mini-cart--loading" : cartLoading})} onClick={() => {setShowInCart(false);setMenuVisibility(false)}}>
                    <div className="mini-cart__wrapper">
                        <div className="mini-cart__close">Chiudi<i></i></div>
                        <h4 className="title title--font-size-12">Bag
                { productsCount ? <span> ({ productsCount })</span> : '' }</h4>
                            <>
                            { miniCart?.products?.length && (
                                miniCart?.products.map( item => (
                                    <CartItem
                                        key={ item.productId }
                                        item={ item }
                                        products={ miniCart?.products }
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
                    { cartLoading && <SpinnerDotted style={{ color: 'white', position: 'absolute', top: '50%', left: '50%', margin: '-25px 0 0 -25px', zIndex: 2}} /> }
                </div>
            </CSSTransition>
        </div>

	)
};

export default CartIcon;
