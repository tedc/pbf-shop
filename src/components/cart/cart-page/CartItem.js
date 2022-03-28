import { useState, useRef, useContext, useEffect } from 'react';
import { v4 } from "uuid";
import { getUpdatedItems, addToCart } from "../../../functions";
import { stringifyPrice } from '../../../utils/cart';
import { Loading } from "../../icons";
import Link from 'next/link';
import {AppContext} from "../../context/AppContext";

const CartItem = ( {
	                   item,
	                   products,
					   updateCartProcessing,
	                   handleRemoveProductClick,
	                   updateCart,
                       isMiniCart,
                   } ) => {

	const [productCount, setProductCount] = useState( 0 );
    const { setCartLoading, cartFetching } = useContext(AppContext);
    const inputBox = useRef();

	/*
	 * When user changes the qty from product input update the cart in localStorage
	 * Also update the cart in global context
	 *
	 * @param {Object} event event
	 *
	 * @return {void}
	 */
	const handleQtyValue = ( event ) => {
        if ( process.browser ) {

			event.stopPropagation();

			// If the previous update cart mutation request is still processing, then return.
			if ( updateCartProcessing || cartFetching ) {
				return;
			}

			// If the user tries to delete the count of product, set that to 1 by default ( This will not allow him to reduce it less than zero )
			const newQty = ( event.target.value ) ? parseInt( event.target.value ) : 1;

            setProductCount(newQty);
			// Set the new qty in state		

		}
	};

    const updateQtyChange = (v, add)=> {
        if ( products.length ) {
            if( add === 0 ) return;
            setCartLoading( true );
            addToCart(item, add);
            const updatedItems = getUpdatedItems( products, v, item.cartKey );
            updateCart( {
                variables: {
                    input: {
                        clientMutationId: v4(),
                        items: updatedItems
                    }
                },
            } );
        }
    }

    const handleQtyChange = (event, v)=> {
        if ( updateCartProcessing || cartFetching ) {
            return;
        }
        if ( process.browser ) {
            event.stopPropagation();
            const add = productCount + v === 0 ? 0 : v;
             let value = productCount + v === 0 ? 1 : productCount + v;
            if(item.stock) {
                value = productCount + v > item?.stock ? item?.stock : productCount + v;
            }
            setProductCount(value);
            updateQtyChange(  value, add  );
        }
    }

    useEffect(()=> {
        setProductCount( item.qty )
    }, [ item ] );

	return (
        <>
        {   isMiniCart ? (
                <div className="mini-cart__item" key={ item.productId }>
                    <img width="64" src={ item.image.sourceUrl } srcSet={ item.image.srcSet } alt={ item.image.title }/>
                    <div className="mini-cart__content">
                        <Link href={{
                            pathname: "/prodotti/[slug]",
                            query: {
                                slug : item.slug
                            }
                        }}>
                        <a>{ item.name }</a></Link>
                        <div className="input input--quantity">
                            <div className="input__mod input__mod--minus" onClick={(event) => handleQtyChange(event, -1)}></div>
                            <input
                                type="number"
                                min="1"
                                data-cart-key={ item.cartKey }
                                max={ item.stock ? item.stock : undefined }
                                value={ productCount }
                                onChange={( event ) => handleQtyValue( event )}
                                ref={inputBox}
                            /> 
                            <div className="input__mod input__mod--plus" onClick={(event) => handleQtyChange(event, 1)}></div>
                        </div>
                        <div className="mini-cart__price">{ ( 'string' !== typeof item.totalPrice ) ? stringifyPrice( item.totalPrice.toFixed( 2 ) ) : item.totalPrice }</div>
                    </div>
                    <span className="remove"
                      onClick={ ( event ) => handleRemoveProductClick( event, item.cartKey, products, item?.productId ) }></span>
                </div>
            )
        : 
		(<tr className="tr" key={ item.productId }>
			<td className="td">
				<img width="64" src={ item.image.sourceUrl } srcSet={ item.image.srcSet } alt={ item.image.title }/>
			</td>
			<td className="td">
                <Link href={{
                    pathname: "/prodotti/[slug]",
                    query: {
                        slug : item.slug
                    }
                }}>
                <a>{ item.name }</a></Link></td>

			{/* Qty Input */ }
			<td className="td">
				{/* @TODO Need to update this with graphQL query */ }
                <div className="input input--quantity">
                    <div className="input__mod input__mod--minus" onClick={(event) => handleQtyChange(event, -1)}></div>
                    <input
                        type="number"
                        min="1"
                        data-cart-key={ item.cartKey }
                        max={ item.stock ? item.stock : undefined }
                        value={ productCount }
                        onChange={( event ) => handleQtyValue( event )}
                        ref={inputBox}
                    /> 
                    <div className="input__mod input__mod--plus" onClick={(event) => handleQtyChange(event, 1)}></div>
                </div>
			</td>
			<td className="td">
				{ ( 'string' !== typeof item.totalPrice ) ? item.totalPrice.toFixed( 2 ) : item.totalPrice }
			</td>
            <th className="td td--remove">
                {/* Remove item */}
                <span className="remove"
                      onClick={ ( event ) => handleRemoveProductClick( event, item.cartKey, products ) }>
                    
                </span>
            </th>
            
		</tr> ) }
        </>
	)
};

export default CartItem;
