import Layout from "../src/components/Layout";
import GET_COUNTRIES from "../src/queries/get-countries";
import { createUserInputData } from '../src/utils/user';
import client from "../src/components/ApolloClient";
import { GET_MENUS } from '../src/queries/get-menus';
import Seo from '../src/components/seo';
import { Costumer, Hairdresser, Wholesaler } from '../src/components/icons';
import validateAndSanitizeCheckoutForm from '../src/validator/checkout';
import { setStatesForCountry } from "../src/utils/checkout";
import Link from 'next/link';
import { isEmpty, isNull, isUndefined} from 'lodash';
import { useState } from 'react';
import Address from "../src/components/checkout/Address";
import InputField from "../src/components/checkout/form-elements/InputField";
import CheckboxField from "../src/components/checkout/form-elements/CheckboxField";
import cx from 'classnames';
import axios from 'axios';
import { signIn } from "next-auth/react";
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

export default function Register(props) {
    const {billingCountries} = props?.countries?.wooCountries || {};
    const router = useRouter();
    const { data : session } = useSession();

    if( !isUndefined( session ) && !isNull( session ) ) {
        router.push('/area-clienti');
    } 

    const initialState = {
        role: 'customer',
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
        password: '',
        passwordConfirm: '',
        privacy: false,
        marketing: false,
    };

    const [ input, setInput] = useState(initialState);
    const [theBillingStates, setTheBillingStates] = useState([]);
    const [isFetchingBillingStates, setIsFetchingBillingStates] = useState(false);
    const [ isProcessing, setIsProcessing ] = useState( false );
    const [ isRegisterSent, setIsRegisterSent ] = useState(false);
    const [ successMessage, setSuccessMessage ] = useState(null);
    const [errorMessage, setErrorMessage ] = useState(null);

    const handleChecks = ( target ) => {
        const newState = { ...input, [target.name]: ! input[target.name], touched: {...input?.touched, [target.name]: true}  };
        setInput( newState );
    }
    
    const RegisterCustomer = async ()=> {
        const billingData = {billing: {}};

        Object.entries(input).map(([key, value])=> {
            if( key !== 'errors' && key !== 'role' && key !== 'touched' && !/(password)/.test(key) && key !== 'privacy' && key !== 'marketing') {
                billingData.billing[key] = value;
            }
        })
        const inputData = createUserInputData(billingData, false);
        const fields = {
            billing : inputData,
            email: inputData?.email,
            firstName: inputData?.firstName,
            lastName: inputData?.lastName,
            username: inputData?.email,
            roles: [input?.role],
        }

        if( !isEmpty(input?.password) && input?.role === 'customer' ) {
            fields.password = input?.password;
        }

        const { data } = await axios.post('/api/user/new', fields);

        const {
            success,
            data : result,
            error,
        } = data;
        
        if( success ) {
            if( !isEmpty(input?.password) && input?.role === 'customer' ) {
                return signIn('credentials', {
                    username: fields?.username,
                    password: fields?.password
                }).then((data)=> {
                    if( isEmpty(data?.error) ) {
                        setIsProcessing( false );
                        router.push('/area-clienti');
                        //router.push(router?.asPath);
                    } else {
                        const message = data?.error === 'invalid_username' ? 'Nome utente errato o inesistente.' : 'La password digitata non risulta corretta.';
                        setErrorMessage( message );
                        setIsProcessing( false );
                    }
                });
            }
        }
        setIsProcessing( false );
    }


    const RegisterForm = async ()=> {
        const fields = {};
        Object.entries(input).map(([key, value])=> {
            if( key !== 'errors' && key !== 'touched' ) {
                if( key === 'firstName') {
                    fields['first_name'] = value;
                } else if ( key === 'lastName') {
                    fields['last_name'] = value
                } else {
                    if(  key !== 'role'  && key !== 'privacy' && key !== 'marketing' ) {
                        fields[`billing_${key}`] = value;
                    } else {
                        fields[key] = value;
                    }
                }    
            }
        })
    


        const { data } = await axios.post('/api/register', fields);
        const {
            success,
            message,
            error
        } = data;

        setIsRegisterSent( success );
        if( success ) {
            setSuccessMessage( message );
        } else {
            setErrorMessage( error );
        }
        
        setIsProcessing( false );

        

    }
    const handleOnChange = async (event) => {
        const {target} = event || {};
        if ('privacy' === target?.name || 'marketing' === target?.name) {
            handleChecks(target);
        } else {
            const billingValidationResult = validateAndSanitizeCheckoutForm( {...input, [target.name]: target.value}, theBillingStates?.length, input.role === 'customer');
            const newState = {...input, [target.name]: target.value, errors: billingValidationResult.errors, touched: {...input?.touched, [target.name]: true}};  
            setInput(newState); 
            await setStatesForCountry(target, setTheBillingStates, setIsFetchingBillingStates);
        }
        
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        setIsProcessing( true );
        setErrorMessage( null );
        setSuccessMessage( null );
        if( input?.role === 'customer') {
            await RegisterCustomer();
        } else {
            await RegisterForm();
        }
    }

    const disabled = ()=> {
        if( !input?.privacy ) return true;
        let length = theBillingStates?.length ? 9 : 8;
        length += input?.role === 'customer' ? 2 : 0;
        const cond = Object.keys( input?.touched ).length >= length;
        if( cond ) {
            return Object.keys( input?.errors ).length > 0;
        } else {
            return true;
        }
    }

    return (
        <Layout {...props}>
            <Seo seo={props.seo} uri="/registrazione/" />
            { !isRegisterSent && <div className="register columns columns--jcc columns--shrink columns--grow-140-bottom">
                <header className="header">
                    <h1 className="title title--font-size-16 title--grow-30-bottom title--font-family-secondary title--normal">
                        Registrazione
                    </h1>
                    <h2 className="title title--grow-40-bottom title--font-size-38">
                        Che tipo di utente sei?
                    </h2>
                </header>
                <form className={cx("form form--main form--main-register column column--s10-lg column--grow-40-top", {'form--loading': isProcessing})} noValidate onSubmit={(event) => handleFormSubmit(event)}>
                    <nav className="form__radios" onChange={(event)=> handleOnChange(event)} >
                        <div className="label">
                            <input type="radio" name="role" value="customer" id="customer" checked={ input?.role === 'customer' } onChange={(event)=> setInput({...input, role : event.target.value })} /><label htmlFor="customer" className="label__value label__value--customer"><Costumer width={47} height={55} />Consumatore</label>
                        </div>
                        <div className="label">
                            <input type="radio" name="role" value="hairdresser" id="hairdresser" checked={ input?.role === 'hairdresser' } onChange={(event)=> setInput({...input, role : event.target.value })} /><label htmlFor="hairdresser" className="label__value label__value--hairdresser"><Hairdresser width={68} height={41}/>Professionista</label>
                        </div>
                        <div className="label">
                            <input type="radio" name="role" value="wholesaler" id="wholesaler" checked={ input?.role === 'wholesaler' } onChange={(event)=> setInput({...input, role : event.target.value })} /><label htmlFor="wholesaler" className="label__value label__value--wholesaler"><Wholesaler width={44} height={44}/>Rivenditore</label>
                        </div>
                    </nav>
                    <div className="columns columns--gutters">
                        <Address
                            states={theBillingStates}
                            countries={billingCountries}
                            input={input}
                            handleOnChange={(event) => handleOnChange(event, false, true)}
                            isFetchingStates={isFetchingBillingStates}
                            handleErrors={(event) => handleErrors(event)}
                            isShipping={false}
                            isBillingOrShipping
                            isRegister
                        />
                        { input?.role === 'customer' && (
                            <>
                            <InputField
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
                            <InputField
                                name="passwordConfirm"
                                inputValue={input?.passwordConfirm}
                                required={input?.role === 'customer'}
                                type="password"
                                handleOnChange={handleOnChange}
                                label="Conferma password"
                                errors={input?.errors}
                                touched={input?.touched}
                                isShipping={false}
                            />
                            </>
                        )}
                        <div className="column column--grow-30-bottom">
                            <CheckboxField
                                name="privacy"
                                type="checkbox"
                                checked={input?.privacy}
                                handleOnChange={handleOnChange}
                                className={cx({ 'label--error' : !input?.privacy && input?.touched && ( input?.touched.hasOwnProperty( 'privacy' ) ) })}
                                label="Acconsento il trattamento dei dati sulla Privacy Policy*"
                            />
                        </div>
                        <div className="column column--grow-30-bottom">
                            <CheckboxField
                                name="marketing"
                                type="checkbox"
                                checked={input?.marketing}
                                handleOnChange={handleOnChange}
                                label="Acconsento al trattamento dei miei dati personali atto alla condivisione
    di comunicazioni commerciali."
                            />
                        </div>
                        <div className="column column--aligncenter">
                            <button className="button button--rounded button--bg-black" disabled={disabled()}>Registrati</button>
                        </div>
                    </div>
                    { errorMessage && <div className="message message--error">{ errorMessage }</div> } 
                </form>
            </div> }
            { isRegisterSent && successMessage && <div className="register register--thank-you">
                <div className="columns columns--grow-140-bottom columns--shrink columns--jcc column--aic" style={{minHeight: '50vh'}}>
                    <div className="column column--s10-md column--s8-lg">
                    <p style={{textAlign: 'center', fontSize: `${(24/16)}em`}} dangerouslySetInnerHTML={{__html: successMessage}}></p>
                    </div>
                </div>
            </div>}
        </Layout>
    )
}

export async function getStaticProps() {
    const menus = await client.query({
        query: GET_MENUS,
    });
    const { data } = await client.query({
        query: GET_COUNTRIES
    });

    const seo = {
        title: 'Registrati | Professional By Fama',
        metaDesc: 'Registrati allo shop di Professional By Fama',
        metaRobotsNoindex: 'noindex',
        metaRobotsNofollow: 'nofollow',
        opengraphDescription: '',
        opengraphTitle: '',
        opengraphImage: '',
        opengraphSiteName: ''
    }
    return {
        props: {
            countries: data || {},
            seo : seo,
            menus: menus?.data?.menus,
            options: menus?.data?.optionsPage?.impostazioni,
            isCheckout: false,
            categories: menus?.data?.categories?.nodes ?? []
        },
        revalidate: 1
    };

}
