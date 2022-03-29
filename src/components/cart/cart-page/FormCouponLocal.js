import { Fragment, useRef, useContext } from 'react';
import { isEmpty, isNull, isUndefined } from 'lodash';
import Title from '../../commons/Title';
import { v4 } from 'uuid';
import { applyCoupon, removeCoupon } from '../../../functions';
import { useSession } from 'next-auth/react';
import { AppContext } from "../../context/AppContext";
import axios from 'axios';

export default function FormCoupon({cart, refetch, setRequestError }) {
    const { data: session } = useSession();
    const inputRef = useRef();
    const { miniCart, setMiniCart, cartFetching, setCartFetching } = useContext( AppContext );
    
    const handleApplyCoupon = async ( event, target ) => {

        event.preventDefault();
        event.stopPropagation();

        if ( cartFetching ) {
            return;
        }
        setRequestError( null );
        setCartFetching( true );
        const coupon = target.current.value;

        if(isUndefined(coupon) || isNull( coupon) || isEmpty(coupon)) {
            return;
        }

        const { data } = await axios.post('/api/get-coupons', {
            coupon
        });

        console.log( data )

        applyCoupon( data, cart, setRequestError, setMiniCart, session );
        setCartFetching( false );
    }
    const handleRemoveCoupon = ( event, code ) => {

        event.preventDefault();
        event.stopPropagation();

        if ( cartFetching ) {
            return;
        }

        setRequestError( null );


        setCartFetching( true );

        const coupon = code;

        if(isUndefined(coupon) || isNull( coupon) || isEmpty(coupon)) {
            return;
        }

        removeCoupon( coupon, cart, setMiniCart );

        setCartFetching( false );
    }
    return (
        <Fragment>
            <div className="coupon">
                <h4 className='title title--normal title--font-size-14 title--font-family-secondary'>Inserisci il tuo codice sconto</h4>
                <input type="text" name="coupon" placeholder="Codice" ref={inputRef} />
                <button onClick={(event)=> handleApplyCoupon( event, inputRef )}>Applica</button>
                 { !isEmpty( cart?.appliedCoupons ) && !isNull( cart?.appliedCoupons ) && (<Title title={{ content : 'I tuoi sconti', type: 'h4', size: 'title--font-size-11 title--font-family-secondary'}} />) }
                <>
                { !isEmpty( cart?.appliedCoupons ) && !isNull( cart?.appliedCoupons ) ? (
                    cart?.appliedCoupons.map((coupon)=> (
                        <div className="coupon__item">
                            <div className="coupon__data">
                                Codice: {coupon.code}<br/>
                                Sconto: {coupon.discountAmount}
                            </div>
                            <div className="coupon__remove" onClick={(event) => handleRemoveCoupon(event, coupon.code)}>
                                Rimuovi
                            </div>
                        </div>
                    ))
                    
                ) : ( '' ) }
                </>
            </div>
        </Fragment>
    )
}