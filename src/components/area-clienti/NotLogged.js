import { AppContext } from "../context/AppContext";
import { useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { isEmpty, isNull, isUndefined } from 'lodash';
import {validateAndSanitizeLostForm, validateAndSanitizeResetForm} from '../../validator/lost-password';
import cx from 'classnames';
import axios from 'axios';
import { SpinnerDotted } from 'spinners-react'; 
import { productsUrlParams } from '../../utils/product';

const LostPassword = ()=> {
    const [ email, setEmail ] = useState(null);
    const [ isProcessing, setIsProcessing ] = useState(false);
    const [ touched, setTouched ] = useState(false);
    const [ errorMessage, setErrorMessage ] = useState(null);
    const [ successMessage, setSuccessMessage ] = useState(null);
    const handleOnChange = (event)=> {
        const { target } = event ?? null;
        setEmail( target.value );
        if(!touched) setTouched( true )
    }
    const handleFormSubmit = async (event)=> {
        event.preventDefault();
        setIsProcessing(true);
        if( !isNull(successMessage)) {
            setSuccessMessage(null);
        }
        setErrorMessage(null);
        const { data } = await axios.post('/api/user/lost-password', {email});

        if( data?.success ){
            setSuccessMessage(data?.data);
        } else {
            setErrorMessage(data?.data);
        }
        setIsProcessing(false);
    }
    const validationResult = validateAndSanitizeLostForm( {
        email
    } );
    const disabled = ()=> {
        return !validationResult.isValid;
    }
    return (
        <div className="columns columns--jcc">
            <div className="column column--s5-xl column--s7-lg column--s9-md">
                <form className={cx("form", "form--main", {"form--loading": isProcessing})} noValidate onSubmit={handleFormSubmit}>
                    <h5 className="title title--font-size-24">Richiedi una nuova password</h5>
                    <p>Potrai di nuovo accedere all'area clienti di Professional by Fama</p>
                    <label className="label" htmlFor="email_reset">Il tuo indirizzo email*</label>
                    <input type="email" name="email" id="email_reset" onChange={handleOnChange} onBlur={handleOnChange}
                className={cx({ 'error' : !validationResult.isValid && touched })} />
                    <p>
                        <button className="button button--rounded button--bg-black" disabled={disabled()}>Richiedi</button>
                    </p>
                    { successMessage && <div className="message message--success">{ successMessage }</div> } 
                    { errorMessage && <div className="message message--error">{ errorMessage }</div> } 
                </form>
                {isProcessing && <SpinnerDotted style={{ color: 'black', position: 'fixed', top: '50%', left: '50%', margin: '-25px 0 0 -25px'}} />}
            </div>
            <style jsx>{
                `.form--main {
                    text-align: center;
                }
                .form--main p {
                    padding: 20px 0;
                }
                @media screen and (min-width:40em) {
                    .form--main p {
                        padding: 30px 0;
                    }
                }
                .form--main .label {
                    text-align: left;
                }
                .message--success {
                    background: #68b702;
                    padding: 20px;
                    color: white;
                }
                `
            }</style>
        </div>
    )
}

const ResetPassowrd = ({router})=> {
    const [ fields, setFields ] = useState({
        password: '',
        passwordConfirm: ''
    });
    const [ touched, setTouched ] = useState({
        password: false,
        passwordConfirm: false
    });
    const [ isProcessing, setIsProcessing ] = useState(false);
    const [ errorMessage, setErrorMessage ] = useState(null);

    const uparams = productsUrlParams(router);

    const handleOnChange = (event)=> {
        const { target } = event ?? null;
        setFields( { ...fields, [target?.name] : target?.value } );
        if( !touched[target?.name]) {
            setTouched({...touched, [target?.name] : true});
        }
    }
    const handleFormSubmit = async (event)=> {
        event.preventDefault();
        setIsProcessing(true);
        setErrorMessage(null);
        const inputs = {...fields};
        delete inputs?.all;
        delete inputs?.passwordConfirm;
        const { data } = await axios.post('/api/user/reset-password', inputs);
        if( data?.success ){
            router.push('/area-clienti');
        } else {
            setErrorMessage(data?.data);
        }
        setIsProcessing(false);
    }
    const validationResult = validateAndSanitizeResetForm( fields );
    const disabled = ()=> {
        if( isEmpty(router?.query, true) ) {
            return true;
        }
        if( touched.password && touched?.passwordConfirm ) {
            return !validationResult.isValid;
        } else {
            return true;
        }
    }
    useEffect(()=> {
        setFields({...fields, ...router?.query});
    }, [ router?.query ])
    return (
        <div className="columns columns--jcc">
            <div className="column column--s5-xl column--s7-lg column--s9-md">
                <form className={cx("form", "form--main", {"form--loading": isProcessing})} noValidate onSubmit={handleFormSubmit}>
                    <h5 className="title title--font-size-24">Imposta una nuova password</h5>
                    <p>Potrai di nuovo accedere all'area clienti di Professional by Fama</p>
                    <label className="label" htmlFor="email_reset">Password*</label>
                    <input type="password" name="password" id="password" onChange={handleOnChange} onBlur={handleOnChange}
                className={cx({ 'error' : !isEmpty(validationResult.errors.password) && !isUndefined( validationResult.errors.password ) && touched.password })} />
                    <label className="label" htmlFor="passwordConfirm">Conferma password*</label>
                    <input type="password" name="passwordConfirm" id="passwordConfirm" onChange={handleOnChange} onBlur={handleOnChange}
                className={cx({ 'error' : !isEmpty(validationResult.errors.passwordConfirm) && !isUndefined( validationResult.errors.passwordConfirm ) && touched.passwordConfirm })} />
                    <p>
                        <button className="button button--rounded button--bg-black" disabled={disabled()}>Richiedi</button>
                    </p>
                    { errorMessage && <div className="message message--error">{ errorMessage }</div> } 
                </form>
                {isProcessing && <SpinnerDotted style={{ color: 'black', position: 'fixed', top: '50%', left: '50%', margin: '-25px 0 0 -25px'}} />}
            </div>
            <style jsx>{
                `.form--main {
                    text-align: center;
                }
                .form--main p {
                    padding: 20px 0;
                }
                .form--main input + label {
                    margin-top: 20px;
                }
                @media screen and (min-width:40em) {
                    .form--main p {
                        padding: 30px 0;
                    }
                }
                .form--main .label {
                    text-align: left;
                }
                .message--success {
                    background: #68b702;
                    padding: 20px;
                    color: white;
                }
                `
            }</style>
        </div>
    )
}

const NotLogged = (props)=> {
    const router = useRouter();
    const isLostPassowrd = router?.asPath.indexOf('lost-password') !== -1;
    const isResetPassowrd = router?.asPath.indexOf('reset-password') !== -1;
    const { setShowLogin } = useContext( AppContext );
    return (
        <>
        { !isLostPassowrd && !isResetPassowrd &&<div className="account__login">
            <p>Devi accedere per consultare l'area clienti del sito.</p>
            <button className="button button--rounded button--bg-black" onClick={()=>setShowLogin(true)}>Entra</button>
            <style jsx>
                {
                    `.account__login {
                        text-align:center;
                        padding: 40px 0;
                    }
                    @media screen and (min-width:40em) {
                        .account__login {
                            padding: 80px 0;
                        }
                    }
                    .account__login p {
                        font-size: 20px;
                        margin-bottom: 40px;
                    }
                    `
                }
            </style>
        </div> }
        { isLostPassowrd && <LostPassword /> }
        { isResetPassowrd && <ResetPassowrd router={router} /> }
        </>
    )
}

export default NotLogged;