import Link from 'next/link';
import { useState, useContext } from 'react';
import { isEmpty, isNull } from 'lodash';
import validateAndSanitizeLoginForm from '../../validator/login';
import { signIn } from "next-auth/react";
import { AppContext } from "../context/AppContext";
import { useRouter } from 'next/router';
import cx from 'classnames';
import { SpinnerDotted } from 'spinners-react';
import { useSession } from 'next-auth/react';
import { CSSTransition } from 'react-transition-group';
export default function Login(props) {
    const {
        loginCover,
        loginTitle,
        loginContent,
    } = props;
    
    const router = useRouter();
    const { showLogin, setShowLogin, setSession } = useContext( AppContext );
    const { data : session } = useSession();
    const [ loginFields, setLoginFields ] = useState( {
        username: '',
        password: '',
    } );
    const [ errorMessage, setErrorMessage ] = useState( null );
    const [ loading, setLoading ] = useState( false );

        // Validation and Sanitization.
    const validationResult = validateAndSanitizeLoginForm( {
        username: loginFields?.username ?? '',
        password: loginFields?.password ?? '',
    } );

    const onFormSubmit = ( event ) => {
        event.preventDefault();
        setErrorMessage( null );
        if ( validationResult.isValid ) {
            setLoading( true );
            return signIn('credentials', {
                username: validationResult?.sanitizedData?.username ?? '',
                password: validationResult?.sanitizedData?.password ?? '',
                redirect: false,
            }).then((data)=> {
                setLoading( false );
                if( isEmpty(data?.error) ) {  
                    setShowLogin( false );
                    setSession( session );
                    router.reload();
                    //router.push(router?.asPath);
                } else {
                    const message = data?.error === 'invalid_username' ? 'Nome utente errato o inesistente.' : 'La password digitata non risulta corretta.';
                    setErrorMessage( message );
                }
            });
        } else {
            setClientSideError( validationResult );
        }
    };

    /**
     * Sets client side error.
     *
     * Sets error data to result received from our client side validation function,
     * and statusbar to true so that its visible to show the error.
     *
     * @param {Object} validationResult Validation Data result.
     */
    const setClientSideError = ( validationResult ) => {
        if ( validationResult.errors.password ) {
            setErrorMessage( validationResult.errors.password );
        }

        if ( validationResult.errors.username ) {
            setErrorMessage( validationResult.errors.username );
        }
    };

    const handleOnChange = ( event ) => {
        setLoginFields( { ...loginFields, [event.target.name]: event.target.value } );
    };

    const { username, password } = loginFields;
    return (
        <form className={cx('form', 'form--login', { 'form--login-loading': loading})} noValidate onSubmit={onFormSubmit}>
            <div className="form__close" onClick={()=> setShowLogin(!showLogin)}></div>
            <div className="columns columns--relative columns--grow-140 columns--shrink columns--jcc columns--aic" style={{backgroundImage: `url(${loginCover.sourceUrl})`, backgroundSize: 'cover'}}>
                <div className="column column--s5-xl column--s7-lg column--s9-md">
                    <h5 className="title title--font-size-60 title--grow-40-bottom" dangerouslySetInnerHTML={ { __html: loginTitle } }></h5>
                    <div className="desc" dangerouslySetInnerHTML={ { __html: loginContent } }></div>
                    <input type="email" name="username" placeholder="Email" value={username} onChange={handleOnChange}/>
                    <input type="password" name="password" placeholder="Password"  value={password} onChange={handleOnChange}/>
                    <button className="button button--rounded button--bg-white" disabled={ !validationResult.isValid  }>Accedi</button>
                    <p className="paragraph paragraph--register">Non sei registrato? <Link href="/registrazione/"><a><strong>Inizia da qui</strong></a></Link>.<br/>Se invece non ricordi la password, <Link href="/area-clienti/lost-password/"><a><strong>Clicca qui?</strong></a></Link></p>
                    <CSSTransition in={!isNull(errorMessage)} timeout={750} classNames="fade-in" unmountOnExit>
                        <div className="message message--error">{ errorMessage }</div>
                    </CSSTransition>
                    <style jsx>{`.fade-in-enter {
                        opacity: 0;
                        visibility: hidden;
                    }
                    .fade-in-enter-active {
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
                </div>
            </div>

            { loading && <SpinnerDotted style={{ color: 'white', position: 'fixed', top: '50%', left: '50%', margin: '-25px 0 0 -25px'}} /> }
        </form>
    )
}