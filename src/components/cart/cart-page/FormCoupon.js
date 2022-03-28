import { Fragment, useRef } from 'react';
import { isEmpty, isNull, isUndefined } from 'lodash';
import {useMutation} from '@apollo/client';
import Title from '../../commons/Title';
import { APPLY_COUPON, REMOVE_COUPONS } from "../../../mutations/apply-coupon";
import { v4 } from 'uuid';

export default function FormCoupon({cart, refetch, setRequestError, setCouponProcessing}) {
    const inputRef = useRef();
    
    const [applyCoupon, { data: applyCouponRes, loading: applyCouponProcessing, error: applyCouponError }] = useMutation( APPLY_COUPON, {
        onCompleted: () => {
            refetch();
            setCouponProcessing( false );
        },
        onError: ( error ) => {
            if ( error ) {
                const errorMessage = ! isEmpty(error?.graphQLErrors?.[ 0 ]) ? error.graphQLErrors[ 0 ]?.message : '';
                setRequestError( errorMessage );
            }
            setCouponProcessing( false );
        }
    } );

    const [removeCoupon, { data: removeCouponRes, loading: removeCouponProcessing, error: removeCouponError }] = useMutation( REMOVE_COUPONS, {
        onCompleted: () => {
            refetch();
            setCouponProcessing( false );
        },
        onError: ( error ) => {
            if ( error ) {
                const errorMessage = ! isEmpty(error?.graphQLErrors?.[ 0 ]) ? error.graphQLErrors[ 0 ]?.message : '';
                setRequestError( errorMessage );
            }
            setCouponProcessing( false );
        }
    } );
    
    const handleApplyCoupon = ( event, target ) => {

        event.preventDefault();
        event.stopPropagation();

        if ( applyCouponProcessing ) {
            return;
        }
        setRequestError( null );
        setCouponProcessing( true );
        const coupon = target.current.value;

        if(isUndefined(coupon) || isNull( coupon) || isEmpty(coupon)) {
            return;
        }

        applyCoupon( {
            variables: {
                input: {
                    clientMutationId: v4(),
                    code: coupon
                }
            },
        } );
    }
    const handleRemoveCoupon = ( event, code ) => {

        event.preventDefault();
        event.stopPropagation();

        if ( removeCouponProcessing ) {
            return;
        }

        setRequestError( null );


        setCouponProcessing( true );

        const coupon = code;

        if(isUndefined(coupon) || isNull( coupon) || isEmpty(coupon)) {
            return;
        }

        removeCoupon( {
            variables: {
                input: {
                    clientMutationId: v4(),
                    codes: coupon
                }
            },
        } );
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