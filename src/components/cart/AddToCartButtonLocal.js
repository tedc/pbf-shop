import {useState, useContext} from "react";
import Link from "next/link";
import {v4} from 'uuid';
import cx from 'classnames';
import {ShoppingCart} from '../icons';

import {AppContext} from "../context/AppContext";
import {getFormattedCart, addToCart} from "../../functions";
import { useSession } from 'next-auth/react';

const AddToCartLocal = (props) => {

    const {product, input, fixed} = props;
    const [quantity, setQuantity] = useState(1);
    const productQryInput = {
        clientMutationId: v4(), // Generate a unique id.
        productId: product.productId,
        quantity: quantity,
    };

    const { cartFetching, setCartFetching, setMiniCart, cart, setCart,  refetchCart, showInCart, setShowInCart, setCartLoading, setMenuVisibility } = useContext(AppContext);
    const [requestError, setRequestError] = useState( null );


    const {data: session } = useSession();

    const handleAddToCartClick = async () => {
        setMenuVisibility( true );
        setShowInCart( true );
        setCartLoading(true);
        setCartFetching( true );
        productQryInput.quantity = quantity;
        setRequestError(null);
        addToCart(product, quantity);
        setCartLoading( false );
        setCartFetching( false );
    };

    const handleFormSubmit = (event)=> {
        event.preventDefault();
        handleAddToCartClick();
    }
    const handleQtyChange = (event, v)=> {
        if ( process.browser ) {
            event.stopPropagation();
            let value = quantity + v === 0 ? 1 : quantity + v;
            if(product.stock) {
                value = quantity + v > product.stock ? product.stock : quantity + v;
            }
            setQuantity(value);
        }
    }

    return (
        <form className="product__add" onSubmit={(event) => handleFormSubmit(event)} noValidate>
            {/* Check if its an external product then put its external buy link */}
            {"ExternalProduct" === product.__typename ? (
                    <a href={product?.externalUrl ?? '/'} target="_blank"
                       className="px-3 py-1 rounded-sm mr-3 text-sm border-solid border border-current inline-block hover:bg-purple-600 hover:text-white hover:border-purple-600">
                        Buy now
                    </a>
                ) :
                <>
                { input && <div className="input input--quantity">
                    <div className="input__mod input__mod--minus" onClick={(event) => handleQtyChange(event, -1)}></div>
                    <input
                        type="number"
                        min="1"
                        max={ product.stock ? product.stock : 999999 }
                        value={quantity}
                        onChange={(event)=> {quantity = event.target.value}}
                    /> 
                    <div className="input__mod input__mod--plus" onClick={(event) => handleQtyChange(event, 1)}></div>
                </div> }
                <button
                    disabled={cartFetching}
                    className={cx(
                        'button button--rounded button--bg-black',
                        {'button--loading': cartFetching}
                    )}
                >
                    { cartFetching ? 'In aggiunta alla bag...' : 'Aggiungi alla tua bag' }
                     <ShoppingCart />
                </button>
                </>
            }
        </form>
    );
};

export default AddToCartLocal;
