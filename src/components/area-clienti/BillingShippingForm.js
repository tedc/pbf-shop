import validateAndSanitizeCheckoutForm from '../../validator/checkout';
import { createUserInputData } from '../../utils/user';
import { setStatesForCountry } from "../../utils/checkout";
import { isEmpty, isNull } from 'lodash';
import { useState, useEffect, useContext } from 'react';
import Address from "../checkout/Address";
import axios from 'axios';
import cx from 'classnames';
import { AppContext } from "../context/AppContext";
import { SpinnerDotted } from 'spinners-react'; 
import { useRouter } from 'next/router';

export default function BillingShippingForm(props) {
    const {billingCountries, shippingCountries} = props?.countries || {};
    
    const {
        isShipping
    } = props;
    const user =  props?.session?.user;
    const customer = props?.user;

    const initialState = {
        billing: {
            ...customer?.billing,
            errors: null,
            touched: null,
        },
        shipping: {
             ...customer?.shipping,
            errors: null,
            touched: null,
        },
    };

    const router = useRouter();

    for ( const key in customer ) {
        if( key === 'billing' || key === 'shipping') {
            const item = customer[key];

            for (const k in item ) {
                if( k !== '__typename') {
                    if( key == 'shipping') {
                        if( k !== 'vat') initialState[key][k] = isNull( item[k] ) ? '' : item[k];
                    } else {
                        initialState[key][k] = isNull( item[k] ) ? '' : item[k]
                    }
                }
            }
        }
    }

    const { setSession } = useContext( AppContext );
    const [input, setInput] = useState(initialState);
    const [theBillingStates, setTheBillingStates] = useState([]);
    const [theShippingStates, setTheShippingStates] = useState([]);
    const [isFetchingBillingStates, setIsFetchingBillingStates] = useState(false);
    const [isFetchingShippingStates, setIsFetchingShippingStates] = useState(false);
    const [ isProcessing, setIsProcessing ] = useState( false );
    
    const handleOnChange = async (event) => {
        const {target} = event || {};

        let newState = {};

        if( !isShipping ) {
            const billingValidationResult = validateAndSanitizeCheckoutForm({ ...input?.billing, [target.name]: target.value }, theBillingStates?.length);
            newState = {...input, billing : { ...input.billing, [target.name]: target.value, errors: billingValidationResult.errors, touched: {...input?.touched, [target.name]: true} }}
        } else {
            const shippingValidationResult = validateAndSanitizeCheckoutForm({ ...input?.shipping, [target.name]: target.value }, theShippingStates?.length);
            newState = {...input, shipping : { ...input.shipping, [target.name]: target.value, errors: shippingValidationResult.errors, touched: {...input?.touched, [target.name]: true} }};  
        }
        setInput(newState); 
        const states = !isShipping ? setTheBillingStates : setTheShippingStates,
            fetching = !isShipping ? setIsFetchingBillingStates : setTheShippingStates;
        await setStatesForCountry(target, states, fetching);
        
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        setIsProcessing( true );
        const inputData = createUserInputData(input, isShipping);
        const fields = isShipping ? { shipping : inputData } : { billing : inputData };
        fields.id = user?.id;
        
        const data = await axios.post('/api/user/update', fields);
        const session = await axios.get('/api/auth/session?update');
        setIsProcessing( false );
        router.push(router?.asPath);
        //const data = await axios.post(url, fields);

    }

    const title = !isShipping ? 'fatturazione' : 'spedizione';

    useEffect(()=> {
        setSession( props?.session );
    }, []);

    return (
        <>
        <h2 className="title title--grow-40-bottom title--font-size-24">Informazioni di {title}</h2>
        <form className={cx('form form--main column column--s10-lg', {'form--loading':isProcessing})} noValidate onSubmit={(event) => handleFormSubmit(event)}>
            <div className="columns columns--gutters">
                <Address
                    states={isShipping ? theShippingStates : theBillingStates}
                    countries={isShipping ? shippingCountries : billingCountries}
                    input={isShipping ? input?.shipping : input?.billing }
                    handleOnChange={(event) => handleOnChange(event, false, true)}
                    isFetchingStates={isShipping ? isFetchingShippingStates : isFetchingBillingStates}
                    handleErrors={(event) => handleErrors(event)}
                    isShipping={isShipping}
                    isBillingOrShipping
                    isRegister={false}
                />
                <div className="column column--aligncenter">
                    <button className="button button--rounded button--bg-black">Aggiorna</button>
                </div>
            </div>
        </form>
        {isProcessing && <SpinnerDotted style={{ color: 'black', position: 'fixed', top: '50%', left: '50%', margin: '-25px 0 0 -25px'}} />}
        </>
    )
}