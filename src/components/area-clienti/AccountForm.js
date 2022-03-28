import { SpinnerDotted } from 'spinners-react'; 
import axios from 'axios';
import InputField from '../checkout/form-elements/InputField';
import { AppContext } from "../context/AppContext";
import { validateAndSanitizeAccountForm } from '../../validator/user';
import { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';
import cx from 'classnames';

export default function AccountForm(props) {
    const user =  props?.session?.user;
    const initialState = {
        id: user?.id,
        firstName: user?.firstName,
        lastName: user?.lastName,
        displayName: user?.customer?.displayName,
        errors: {},
        touched: {},
        password: '',
        passwordConfirm: '',
    };

    const router = useRouter();
    const [input, setInput] = useState(initialState);
    const [ isProcessing, setIsProcessing ] = useState( false );
    const { setSession } = useContext( AppContext );

    const handleOnChange = async (event) => {
        const {target} = event || {};
        const validationResult = validateAndSanitizeAccountForm( {...input, [target.name]: target.value});
        const newState = {...input, [target.name]: target.value, errors: validationResult.errors, touched: {...input?.touched, [target.name]: true}};  
        setInput(newState); 
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        setIsProcessing( true )
        try {
            const inputs = {...input, ...{}};
            delete inputs.errors;
            delete inputs.touched;
            delete inputs.passwordConfirm;
            const data = await axios.post('/api/user/update', inputs);
            const session = await axios.get('/api/auth/session?update');
            setIsProcessing( false );
            router.push(router?.asPath);

        } catch (error) {
            console.log( error )
        }
    }

    const disabled = ()=> {
        return Object.keys( input?.errors ).length > 0 || isProcessing;
    }

    useEffect(()=> {
        setSession( props?.session )
    }, []);
    return (
        <>
        <form className={cx('form', 'form--main', { 'form--loading' : isProcessing})} noValidate onSubmit={handleFormSubmit}>
            <div className="columns columns--gutters">
                <InputField
                    name="firstName"
                    inputValue={input?.firstName}
                    handleOnChange={handleOnChange}
                    label="Nome"
                    type="text"
                    errors={input?.errors}
                    touched={input?.touched}
                    isShipping={false}
                    required={true}
                />
                <InputField
                    name="lastName"
                    inputValue={input?.lastName}
                    handleOnChange={handleOnChange}
                    label="Cognome"
                    type="text"
                    errors={input?.errors}
                    touched={input?.touched}
                    isShipping={false}
                    required={true}
                />
                <InputField
                    name="displayName"
                    inputValue={input?.displayName}
                    handleOnChange={handleOnChange}
                    label="Nome da visualizzare"
                    type="text"
                    errors={input?.errors}
                    touched={input?.touched}
                    isShipping={false}
                    containerClassNames="column--full"
                />
                <InputField
                    name="password"
                    inputValue={input?.password}
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
                    type="password"
                    handleOnChange={handleOnChange}
                    label="Conferma password"
                    errors={input?.errors}
                    touched={input?.touched}
                    isShipping={false}
                />
                <div className="column column--aligncenter">
                    <button className="button button--rounded button--bg-black" disabled={disabled()}>Aggiorna</button>
                </div>
            </div>
        </form>
        {isProcessing && <SpinnerDotted style={{ color: 'black', position: 'fixed', top: '50%', left: '50%', margin: '-25px 0 0 -25px'}} />}
        </>
    )
}