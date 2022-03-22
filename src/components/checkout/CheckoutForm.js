import {useState, useContext, useEffect} from 'react';
import {useMutation, useQuery} from '@apollo/client';
import cx from 'classnames';

import YourOrder from "./YourOrder";
import PaymentModes from "./PaymentModes";
import {AppContext} from "../context/AppContext";
import validateAndSanitizeCheckoutForm from '../../validator/checkout';
import {getFormattedCart, createCheckoutData,} from "../../functions";
import OrderSuccess from "./OrderSuccess";
import FormCoupon from '../cart/cart-page/FormCoupon';
import CartEmpty from '../cart/cart-page/CartEmpty';
import GET_CART from "../../queries/get-cart";
import CHECKOUT_MUTATION from "../../mutations/checkout";
import APPLY_COUPON from "../../mutations/apply-coupon";
import Address from "./Address";
import InputField from "./form-elements/InputField";
import {
    handleShippingDifferentThanBilling,
    handleCreateAccount, 
    handleStripeCheckout, handleSimpleCheckout, handlePayPalCheckout,
    setStatesForCountry, handleTerms
} from "../../utils/checkout";
import CheckboxField from "./form-elements/CheckboxField";
import CLEAR_CART_MUTATION from "../../mutations/clear-cart";
import {CardNumberElement,
  CardCvcElement,
  CardExpiryElement} from '@stripe/react-stripe-js';
import { isEmpty, isNull, isUndefined} from 'lodash';
import { SpinnerDotted } from 'spinners-react';
import { useSession } from "next-auth/react";
import { useRouter } from 'next/router';

// Use this for testing purposes, so you dont have to fill the checkout form over an over again.
// const defaultCustomerInfo = {
// 	firstName: 'Imran',
// 	lastName: 'Sayed',
// 	address1: '123 Abc farm',
// 	address2: 'Hill Road',
// 	city: 'Mumbai',
// 	country: 'IN',
// 	state: 'Maharastra',
// 	postcode: '221029',
// 	email: 'codeytek.academy@gmail.com',
// 	phone: '9883778278',
// 	company: 'The Company',
// 	errors: null
// }

const defaultCustomerInfo = {
    firstName: '',
    lastName: '',
    address1: '',
    address2: '',
    city: '',
    country: '',
    state: '',
    postcode: '',
    email: '',
    phone: '',
    company: '',
    vat: '',
    errors: null,
    touched: null,
}

const CheckoutForm = ({countriesData, gateways, stripe, elements}) => {

    const [ isUserFetching, setIsUserFetching ] = useState( false );
    const [ showPayment, setShowPayment ] = useState(true);

    const { data: session, status } = useSession();

    const router = useRouter();

    const [ role, setRole ] = useState( null );
    
    const {billingCountries, shippingCountries} = countriesData || {}

    const initialState = {
        billing: {
            ...defaultCustomerInfo,
        },
        shipping: {
            ...defaultCustomerInfo
        },
        password: '',
        createAccount: false,
        orderNotes: '',
        shippingDifferentThanShipping: false,
        paymentMethod: 'bacs',
        termsAndConditions: false,
    };

    const { cart, setCart} = useContext(AppContext);
    const [input, setInput] = useState(initialState);
    const [orderData, setOrderData] = useState(null);
    const [requestError, setRequestError] = useState(null);
    const [theShippingStates, setTheShippingStates] = useState([]);
    const [isFetchingShippingStates, setIsFetchingShippingStates] = useState(false);
    const [theBillingStates, setTheBillingStates] = useState([]);
    const [isFetchingBillingStates, setIsFetchingBillingStates] = useState(false);
    const [isStripeOrderProcessing, setIsStripeOrderProcessing] = useState(false);
    const [isSimpleOrderProcessing, setIsSimpleOrderProcessing] = useState(false);
    const [createdOrderData, setCreatedOrderData] = useState({});
    const [ cardFilled, setCardFilled ] = useState({
        expiry: false,
        cardNumber: false,
        cvc: false
    })

    const { loading, error, data, refetch } = useQuery( GET_CART, {
        notifyOnNetworkStatusChange: true,
        onCompleted: () => {            // Update cart in the localStorage.
            const updatedCart = getFormattedCart( data );
            localStorage.setItem( 'woo-next-cart', JSON.stringify( updatedCart ) );

            setInput({
                ...input,
                coupons: data?.cart?.appliedCoupons,
                shippingTotal: data?.cart?.shippingTotal
            })
            // Update cart data in React Context.
            setCart( updatedCart );
        }
    } );


    // Create New order: Checkout Mutation.
    const [checkout, {
        data: checkoutResponse,
        loading: checkoutLoading,
    }] = useMutation(CHECKOUT_MUTATION, {
        variables: {
            input: orderData
        },
        onError: (error) => {
            if (error) {
                setRequestError(error?.graphQLErrors?.[0]?.message ?? '');
            }
        }
    });

    const [ clearCartMutation ] = useMutation( CLEAR_CART_MUTATION );

    /*
     * Handle form submit.
     *
     * @param {Object} event Event Object.
     *
     * @return {void}
     */
    
    const handleFormSubmit = async (event) => {
        event.preventDefault();

        /**
         * Validate Billing and Shipping Details
         *
         * Note:
         * 1. If billing is different than shipping address, only then validate billing.
         * 2. We are passing theBillingStates?.length and theShippingStates?.length, so that
         * the respective states should only be mandatory, if a country has states.
         */
        const billingValidationResult = validateAndSanitizeCheckoutForm(input?.billing, theBillingStates?.length);
        const shippingValidationResult = input?.shippingDifferentThanShipping ? validateAndSanitizeCheckoutForm(input?.shipping, theShippingStates?.length) : {errors: null, isValid: true};

        if (!shippingValidationResult.isValid || !billingValidationResult.isValid) {
            setInput({
                ...input,
                billing: {...input.billing, errors: billingValidationResult.errors},
                shipping: {...input.shipping, errors: shippingValidationResult.errors}
            });

            return;
        }
        if ( 'stripe' === input?.paymentMethod ) {
            const createdOrderData = await handleStripeCheckout(input, cart?.products, setRequestError, clearCartMutation, setIsStripeOrderProcessing, setCreatedOrderData);
        	router.push(`/thank-you?order_id=${createdOrderData?.order_id}`);
            return null;
        } else if( 'paypal' === input?.paymentMethod ) {
            const createdOrderData = await handlePayPalCheckout(input, cart?.products, setRequestError, clearCartMutation, setIsStripeOrderProcessing, setCreatedOrderData);
            const links = createdOrderData?.data?.links;
            let url = '';
            links.map(link => {
                if(link.rel === 'approve') {
                    url = link.href;
                }
            });
            window.location = url;
            return createdOrderData;
        } 

        const createdOrderData = await handleSimpleCheckout(input, cart?.products, setRequestError, clearCartMutation, setIsSimpleOrderProcessing, setCreatedOrderData);
        const checkOutData = createCheckoutData(input);
        setRequestError(null);
        setOrderData(checkOutData);
        router.push(`/thank-you?order_id=${createdOrderData?.order_id}`);
        return null;
    };

    /*
     * Handle onchange input.
     *
     * @param {Object} event Event Object.
     * @param {bool} isShipping If this is false it means it is billing.
     * @param {bool} isBillingOrShipping If this is false means its standard input and not billing or shipping.
     *
     * @return {void}
     */
    const handleOnChange = async (event, isShipping = false, isBillingOrShipping = false) => {
        const {target} = event || {};

        if ('createAccount' === target.name) {
            handleCreateAccount(input, setInput, target)
        } else if ('shippingDifferentThanShipping' === target.name) {
            handleShippingDifferentThanBilling(input, setInput, target);
        } else if('termsAndConditions' === target.name) {
            handleTerms(input, setInput, target);
        } else if (isBillingOrShipping) {
            if (isShipping) {
                await handleShippingChange(target)
            } else {
                await handleBillingChange(target)
            }
        } else {
            const newState = {...input, [target.name]: target.value};
            setInput(newState);
        }

    };

    const disabled = ()=> {
        if( !input?.shippingDifferentThanShipping ) {
            if( isNull( input?.billing?.touched ) ) {
                return true;
            }
        }  else {
            if( isNull( input?.billing?.touched ) || isNull( input?.shipping?.touched ) ) {
                return true;
            }
        }
        if( input?.paymentMethod === 'stripe' ) {
            if( !cardFilled.expiry || !cardFilled.cvc || !cardFilled.cardNumber ) {
                return true;
            }
        }
        let length = theBillingStates?.length ? 9 : 8;
        if( input?.shippingDifferentThanShipping ) {
            length += theShippingStates?.length ? 8 : 7;
        }
        const cond = !input?.shippingDifferentThanShipping ? Object.keys( input?.billing?.touched ).length >= length : (Object.keys( input?.billing?.touched ).length + Object.keys( input?.shipping?.touched ).length) >= length;
        if( cond ) {
            if( !input?.shippingDifferentThanShipping ) {
                return Object.keys( input?.billing?.errors ).length > 0 || isOrderProcessing || !input?.termsAndConditions;
            } else {
                return Object.keys( input?.billing?.errors ).length > 0 ||  Object.keys( input?.shipping?.errors ).length > 0 || isOrderProcessing || !input?.termsAndConditions;
            }
        } else {
            return true;
        }
    }


    const handleShippingChange = async (target) => {
        const shippingValidationResult =  input?.shippingDifferentThanShipping ? validateAndSanitizeCheckoutForm( {...input?.shipping, [target.name]: target.value}, theShippingStates?.length) : {errors: null, isValid: true};
        const newState = {...input, shipping: {...input?.shipping, [target.name]: target.value, errors: shippingValidationResult.errors, touched: {...input?.shipping?.touched, [target.name]: true} } };
        setInput(newState);
        await setStatesForCountry(target, setTheShippingStates, setIsFetchingShippingStates);
    }

    const handleBillingChange = async (target) => {
        const billingValidationResult = validateAndSanitizeCheckoutForm( {...input?.billing, [target.name]: target.value}, theBillingStates?.length);
        const newState = {...input, billing: {...input?.billing, [target.name]: target.value, errors: billingValidationResult.errors, touched: {...input?.billing?.touched, [target.name]: true}}};  
        setInput(newState);
        await setStatesForCountry(target, setTheBillingStates, setIsFetchingBillingStates);
    }

    const handleApplyCoupon = ( event, target ) => {

        event.preventDefault();
        event.stopPropagation();

        if ( applyCouponProcessing ) {
            return;
        }

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

    useEffect(async () => {
        if (null !== orderData) {
            await checkout();
        }
        if( status === 'authenticated' ) {
            setIsUserFetching( true );
            const user = session?.user;
            user?.roles?.nodes.map((r) => {
                setShowPayment( r?.name !== 'wholesaler' );
                setRole( r?.name );
            });
            const obj = {...input, billing : { ...input?.billing, ...user?.billing}, shipping: { ...input?.shipping, ...user?.shipping}};
            if( !isUndefined(obj.billing['__typename'])) delete obj.billing['__typename'];
            if( !isUndefined(obj.shipping['__typename'])) delete obj.shipping['__typename'];
            // if( !isEmpty(user.shipping, true) ) {
            //     obj.shipping.touched = {}
            // }
            if( !isEmpty(user.billing, true) ) {
                obj.billing.touched = {};
                obj.billing.errors = {};
            }

            if( !isEmpty(user.shipping, true) ) {
                obj.shipping.touched = {};
                obj.shipping.errors = {};
            }
            
            for( let key in user?.billing) {
                const item = user?.billing[key];
                if( !isNull( item ) && key !== '__typename' ) {
                    obj.billing.touched[key] = true;
                }
            }

            for( let key in user?.shipping) {
                const item = user?.shipping[key];
                if( !isNull( item ) && key !== '__typename' ) {
                    obj.shipping.touched[key] = true;
                }
            }

            setInput(obj);
            setIsUserFetching( false );
        }
        return ()=> {
            setIsProcessing( false );
        }
    }, [orderData, status]);

    // Loading state
    const isOrderProcessing = checkoutLoading || isStripeOrderProcessing || loading || isSimpleOrderProcessing || status === 'loading' || isUserFetching;
    
    return (
        <>  
            {cart ? (
                <div className="columns columns--shrink columns--grow-140-bottom columns--jcc">
                    <div className="column column--s10-lg">
                        <form onSubmit={handleFormSubmit} className={cx('form', 'form--main', 'form--checkout', 'columns', 'columns--jcsb', {'form--loading' : isOrderProcessing})}>
                            <h2 className="column title title--font-size-38 title--grow-40-bottom"><span className="num">01</span>Indirizzo di fatturazione</h2>
                                   
                            <div className="column column--s7-md column--s8-lg">
                                <div className="checkout__billing">
                                     <div className="columns columns--gutters">
                                        <Address
                                            states={theBillingStates}
                                            countries={billingCountries}
                                            input={input?.billing}
                                            handleOnChange={(event) => handleOnChange(event, false, true)}
                                            isFetchingStates={isFetchingBillingStates}
                                            isShipping={false}
                                            isBillingOrShipping
                                        />
                                        { status !== 'authenticated' && <div className="column column--grow-30-bottom"><CheckboxField
                                            name="createAccount"
                                            type="checkbox"
                                            checked={input?.createAccount}
                                            handleOnChange={handleOnChange}
                                            label="Crea un account con queste credenziali"
                                        /></div> }
                                        { status !== 'authenticated' && input?.createAccount && <><InputField
                                            name="username"
                                            inputValue={input?.username}
                                            required={false}
                                            type="email"
                                            handleOnChange={handleOnChange}
                                            label="Email per il login (se vuoi usarne una diversa da quella di fatturazione)"
                                            errors={input?.errors}
                                            touched={input?.touched}
                                            isShipping={false}
                                        /><InputField
                                            name="password"
                                            inputValue={input?.password}
                                            required={input?.role === 'customer'}
                                            handleOnChange={handleOnChange}
                                            label="Password"
                                            type="password"
                                            errors={input?.errors}
                                            touched={input?.touched}
                                            isShipping={false}
                                        />
                                        </>}
                                        <div className="column column--grow-30-bottom">
                                            <CheckboxField
                                                name="shippingDifferentThanShipping"
                                                type="checkbox"
                                                checked={input?.shippingDifferentThanShipping}
                                                handleOnChange={handleOnChange}
                                                label="Vuoi spedire a un indirizzo differente?"
                                            />
                                        </div>
                                        
                                    </div>
                                </div>
                                    {/*Shippin Details*/}
                            {input?.shippingDifferentThanShipping ? (
                                <div className="checkout__shipping">
                                    <h2 className="title title--font-size-38 title--grow-40-bottom"><span className="num">02</span>Indirizzo di spedizione</h2>
                                    <div className="columns columns columns--gutters">
                                        <Address
                                            states={theShippingStates}
                                            countries={shippingCountries}
                                            input={input?.shipping}
                                            handleOnChange={(event) => handleOnChange(event, true, true)}
                                            isFetchingStates={isFetchingShippingStates}
                                            isShipping
                                            isBillingOrShipping
                                        />
                                    </div>
                                </div>
                            ) : null}

                                { showPayment && <PaymentModes input={input} handleOnChange={handleOnChange} gateways={gateways} CardNumberElement={CardNumberElement} CardCvcElement={CardCvcElement} CardExpiryElement={CardExpiryElement} cardFilled={cardFilled} setCardFilled={setCardFilled} /> }
                            </div>
                            
                            <div className="column column--s4-md column--s3-lg">
                                <FormCoupon cart={cart} setRequestError={setRequestError} refetch={refetch} />
                                {/* Order & Payments*/}
                                <div className="checkout__summary">
                                    {/*	Order*/}
                                    <h4 className="title title--font-size-14 title--font-family-secondary title--normal title---grow-30-bottom">
                                        Riepilogo ordine
                                    </h4>
                                    <YourOrder cart={cart}/>
                                    <CheckboxField
                                        name="termsAndConditions"
                                        type="checkbox"
                                        checked={input?.termsAndConditions}
                                        handleOnChange={handleOnChange}
                                        label="Ho letto e accetto termini e condizioni del sito web*"
                                    />
                                    <button disabled={ disabled() } className={cx(
                                            'button button--rounded button--bg-white',
                                            {'button--loading': isOrderProcessing}
                                    )} type="submit">Acquista</button>
                                </div>
                            </div>
                            {/* Checkout Loading*/}
                            {isOrderProcessing && <SpinnerDotted style={{ color: 'black', position: 'fixed', top: '50%', left: '50%', margin: '-25px 0 0 -25px'}} />}
                            {requestError && <p>Error : {requestError} :( Please try again</p>}
                        </form>
                    </div>
                </div>
            ) : <CartEmpty />}
            {/*	Show message if Order Success*/}
            <OrderSuccess response={checkoutResponse}/>
        </>
    );
};

export default CheckoutForm;
