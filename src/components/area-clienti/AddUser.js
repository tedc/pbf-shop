import validateAndSanitizeCheckoutForm from '../../validator/checkout';
import { createUserInputData, TableStyles, pricelistLayouts } from '../../utils/user';
import { setStatesForCountry } from "../../utils/checkout";
import { isEmpty, isNull } from 'lodash';
import { useState, useEffect, useContext } from 'react';
import Address from "../checkout/Address";
import axios from 'axios';
import cx from 'classnames';
import { AppContext } from "../context/AppContext";
import { SpinnerDotted } from 'spinners-react'; 
import { useRouter } from 'next/router';
import { CSSTransition } from 'react-transition-group';
import { Dropzone } from '@dropzone-ui/react';
import Pricelist from './Pricelist';
import PricelistInfo from './PricelistInfo';

const initialState = {
    roles: ['hairdresser'],
    billing : {
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
    },
};

export default function AddUser(props) {
    const { billingCountries } = props?.countries || {};
    
    const router = useRouter();

    const { setSession } = useContext( AppContext );
    const [ input, setInput] = useState(initialState);
    const [ theBillingStates, setTheBillingStates] = useState([]);
    const [ isFetchingBillingStates, setIsFetchingBillingStates] = useState(false);
    const [ isProcessing, setIsProcessing ] = useState( false );
    const [ isUserAdded, setIsUserAdded ] = useState( false ); 
    const [ user, setUser ] = useState( null );
    const [ files, setFiles ] = useState( [] );
    const [ pricelist, setPricelist ] = useState( null );
    const [ errorMessage, setErrorMessage ] = useState(null);
    const [ isInfoOpen, setIsInfoOpen ] = useState(false);
    
    const handleOnChange = async (event) => {
        const {target} = event || {};
        const billingValidationResult = validateAndSanitizeCheckoutForm( {...input?.billing, [target.name]: target.value}, theBillingStates?.length);
        const newState = {...input, billing: {...input?.billing, [target.name]: target.value, errors: billingValidationResult.errors, touched: {...input?.billing?.touched, [target.name]: true}}};  
        setInput(newState);
        const states = setTheBillingStates,
            fetching = setIsFetchingBillingStates;
        await setStatesForCountry(target, states, fetching);
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        setIsProcessing( true );
        
        const inputData = createUserInputData(input, false);
        const fields = {
            billing : inputData,
            email: inputData?.email,
            firstName: inputData?.firstName,
            lastName: inputData?.lastName,
            username: inputData?.email,
            roles: input?.roles,
            parent: props?.user?.databaseId
        }

        if( !isNull(pricelist) ) {
            fields.pricelist = pricelist;
        }

        const { data } = await axios.post('/api/user/register', fields);
        const session = await axios.get('/api/auth/session?update');
        setIsProcessing( false );
        const {
            success,
            data : result,
            error
        } = data;
        if( ! success ) {
            setErrorMessage( data?.error?.message )
        } else {
            setUser( result?.createCustomer?.customer );
            setIsUserAdded( success );
        }

    }

    const handleFileInput = (files) => {
        setIsProcessing(true)
        setFiles(files)
    }

    const clearFiles = ()=> {
        setFiles([]);
        setPricelist(null);
    }

    const disabled = ()=> {
        if( isProcessing ) {
            return true;
        }
        if( isNull( input?.billing?.touched ) ) {
            return true;
        }
        const cond = Object.keys( input?.billing?.touched ).length >= 8;
        if( cond ) {
            return Object.keys( input?.billing?.errors ).length > 0;
        } else {
            return true;
        }
    }

    useEffect(()=> {
        setSession( props?.session );
    }, []);

    return (
        <>
        <CSSTransition in={ !isUserAdded } timeout={750} classNames="fade-in" unmountOnExit>
        <>
        <h2 className="title title--grow-40-bottom title--font-size-24">Aggiungi utente</h2>
        <form className={cx('form form--main column column--s10-lg', {'form--loading':isProcessing})} noValidate onSubmit={(event) => handleFormSubmit(event)}>
            <div className="columns columns--gutters">
                <Address
                    states={theBillingStates}
                    countries={billingCountries}
                    input={input?.billing }
                    handleOnChange={(event) => handleOnChange(event, false, true)}
                    isFetchingStates={isFetchingBillingStates}
                    handleErrors={(event) => handleErrors(event)}
                    isShipping={false}
                    isBillingOrShipping
                    isRegister={false}
                />
                <div className="column column--input column--relative column--grow-30-bottom">
                    <label className="upload" htmlFor="pricelist">
                        <span className="upload__content">
                            Carica il listino prezzi
                            { !isEmpty(files) && <span style={{fontSize:11}}><br/>{files[0].file?.name}</span>}
                        </span>
                        <i className="upload__info" onClick={()=> setIsInfoOpen(true)}>?</i>
                        <i className="upload__btn"></i>
                        {  !isEmpty(files) && <i className="upload__clear" onClick={()=> clearFiles()}></i> }
                        <Dropzone
                            header={true}
                            footer={false}
                            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                            style={{
                                position: 'absolute',
                                width: '100%',
                                height: '100%',
                                top: 0,
                                left: 0,
                                opacity: 0,
                            }}
                            minHeight="100%"
                            maxHeight="100%"
                            maxFiles={1}
                            localization='IT-it'
                            url="/api/user/upload"
                            value={files}
                            onUploadStart={handleFileInput}
                            uploadOnDrop={true}
                            onUploadFinish={(res)=> {
                                if( res[0].serverResponse?.status ) {
                                    setPricelist( res[0].serverResponse?.sheet );
                                    setIsProcessing(false);
                                }
                            }}
                            behaviour="replace"
                      ></Dropzone>
                    </label>
                </div>
                <div className="column column--aligncenter">
                    <button className="button button--rounded button--bg-black" disabled={disabled()}>Aggiungi</button>
                </div>
            </div>
            <Pricelist pricelist={pricelist}/>
            { !isNull(errorMessage) && <div>{errorMessage}</div>}
        </form>
        </>
        </CSSTransition>
        <CSSTransition in={ isUserAdded && !isNull( user ) } timeout={750} classNames="fade-in" unmountOnExit>
        <div className="user">
            <h2 className="title title--grow-40-bottom title--font-size-24">Hai aggiunto un utente<div className="title__check"></div></h2>
            <p>
                { user?.billing?.firstName && user?.billing?.firstName } { user?.billing?.lastName && user?.billing?.lastName }{ (user?.billing?.lastName || user?.billing?.firstName) &&< br/>}
                { user?.billing?.address1 && user?.billing?.address1 }{ user?.billing?.address1 &&< br/>}
                { user?.billing?.postcode && user?.billing?.postcode }{user?.billing?.state && ` (${user?.billing?.state})`}{ user?.billing?.country && ` - ${user?.billing?.country}` }{ (user?.billing?.postcode || user?.billing?.state || user?.billing?.country) &&< br/>}
                { user?.billing?.vat && `P.Iva ${user?.billing?.vat}` }{ user?.billing?.vat &&< br/>}
                { user?.billing?.email && user?.billing?.email }{ user?.billing?.email &&< br/>}
                { user?.billing?.phone && user?.billing?.phone }{ user?.billing?.phone &&< br/>}
            </p> 
            <Pricelist pricelist={pricelist}/>
        </div>
        </CSSTransition>
        {isProcessing && <SpinnerDotted style={{ color: 'black', position: 'fixed', top: '50%', left: '50%', margin: '-25px 0 0 -25px'}} />}
        <style jsx>{
            `
            .user .title {
                display: flex;
                align-items: center;
            }
            .user .title__check:before {
                width: 13px;
                height: 7px;
                content: '';
                border-left: 1px solid white;
                border-bottom: 1px solid white;
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate3d(-50%, -70%, 0) rotate(-45deg);
            }
            .user .title__check {
                position: relative;
                flex: 0 0 auto;
                width: 30px;
                height: 30px;
                background-color: black;
                margin-left: 20px;
                border-radius: 30px;
                content: '';
            }
            .fade-in-enter {
                opacity: 0;
                visibility: hidden;
            }
            .fade-in-enter-active {
                position: absolute; 
                top: 0;
                left: 0; 
                width: 100%;
                opacity: 1;
                visibility: visible;
                transition: opacity .75s;
            }
            .fade-in-enter-done {
                visibility: visible;
                opacity: 1;
            }
            .fade-in-exit {
                visibility: visible;
                opacity: 1;
            }
            .fade-in-exit-active {
                visibility: visible;
                opacity: 0;
                transition: opacity .75s;
            }
            .fade-in-exit-done {
                visibility: hidden;
                opacity: 0;
            }`}</style>
            
        <PricelistInfo {...{isInfoOpen, setIsInfoOpen}} />
        </>
    )
}