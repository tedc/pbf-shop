import { useContext, useEffect, useState } from 'react';
import { AppContext } from "../context/AppContext";
import Link from 'next/link';
import { isEmpty, isUndefined, isNull } from 'lodash';
import { v4 } from 'uuid';
import cx from 'classnames';
import {ShoppingCart} from '../icons';
import CartItemLocal from './cart-page/CartItemLocal';
import { getFormattedCart, getUpdatedItems, addToCart, removeItemFromCart, cleanCart } from "../../functions";
import { CSSTransition } from 'react-transition-group';
import { useSession } from 'next-auth/react';
import { SpinnerDotted } from 'spinners-react'; 
import { useRouter } from 'next/router';

const CartIconLocal = () => {
    const { cartFetching, miniCart, setMiniCart, cart, setCart, showInCart, setShowInCart, cartLoading, setCartLoading, setMenuVisibility } = useContext( AppContext );
    const {data: session, status } = useSession();
    const cartStorage = process?.browser ? window.localStorage.getItem( 'woo-next-cart' ) : null;
    const router = useRouter();

    const [ productsCount, setProductsCount ] = useState( '');
    const [ totalPrice, setTotalPrice ] = useState('');
    
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
   
    const handleRemoveProductClick = ( event, products, id ) => {
        if(cartFetching) return;

        event.stopPropagation();
        removeProduct(id);
    };

    const removeProduct = (id)=> {
        if ( products.length ) {
            setCartLoading( true );
            // By passing the newQty to 0 in updateCart Mutation, it will remove the item.
            removeItemFromCart( id );

            setCartLoading( false );
        }
    }

    useEffect(()=> {
        const newCart = JSON.parse(cartStorage);
        cleanCart( newCart, status, session );
        setMiniCart( newCart );
        setProductsCount(( null !== newCart && Object.keys( newCart ).length ) ? newCart.totalProductsCount : '');
        setTotalPrice(( null !== newCart && Object.keys( newCart ).length ) ? newCart.totalProductsPrice : '');
        setCartLoading( false );
    }, [ cartStorage, status ])

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
                                    <CartItemLocal
                                        key={ item.productId }
                                        item={ item }
                                        products={ miniCart?.products }
                                        handleRemoveProductClick={ handleRemoveProductClick }
                                        isMiniCart={ true }
                                        updateCartProcessing={cartFetching}
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

export default CartIconLocal;
