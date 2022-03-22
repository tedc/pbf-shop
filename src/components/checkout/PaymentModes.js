import Error from "./Error";
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap/dist/gsap';
import { isEmpty, isNull } from 'lodash';
import { Paypal, CcIcon } from '../icons';
import cx from 'classnames';
import InputField from "./form-elements/InputField";
import { useSession } from 'next-auth/react';
import { SpinnerDotted } from 'spinners-react'; 
import { CSSTransition } from 'react-transition-group';
import { GET_HAIRDRESSER_PAYMENTS_INFO } from '../../queries/users/get-user';
import { getRole } from '../../utils/user';
import { useLazyQuery } from '@apollo/client';



const CreditCard = (props)=> {
    const { input, handleOnChange, CardNumberElement, CardCvcElement, CardExpiryElement, gateway, cardFilled, setCardFilled } = props;
    const ELEMENT_OPTIONS = {
      style: {
        base: {
            fontSize: '12px',
            color: '#000',
            border: '1px solid #000',
            lineHeight: '40px',
            '::placeholder': {
                color: '#959490',
            },
        },
        invalid: {
            color: '#9e2146',
        },
      },
    };

    const handleCardChange = (event, key)=> {
        setCardFilled({
            ...cardFilled,
            [key] : event?.complete
        })
    }
    return (
        <>
        <h4 className="title title--grow-30-bottom title--upper title--font-size-12">Dettagli carta</h4>   
        <div className="cc columns columns--gutters">
            <InputField
                name="holderName"
                inputValue={input?.holderName}
                required={ gateway === 'stripe' }
                handleOnChange={handleOnChange}
                label="Nome e cognome del titolare della carta"
                //errors={errors}
                isShipping={false}
                containerClassNames="column--s12"
            />
            <div className="column column--grow-30-bottom column--s8">
            <label className="label" htmlFor="cardNumber">Numero di carta</label>
            <div className="cc__item cc__item--number">
            <CardNumberElement
              id="cardNumber"
              options={ELEMENT_OPTIONS}
              onChange={(event)=> handleCardChange(event, 'cardNumber') }
            />
            </div>
            </div>
            <div className="column column--grow-30-bottom column--s4">
            <label className="label" htmlFor="expiry">Data di scadenza</label>
            <div className="cc__item cc__item--expiry">

                <CardExpiryElement
                  id="expiry"
                  options={ELEMENT_OPTIONS}
                  onChange={(event)=> handleCardChange(event, 'expiry') }
                />
            </div>
            </div>
            <div className="column">
            <label className="label" htmlFor="cvc">Codice CVC</label>
            <div className="cc__item cc__item--cvc">
                <CardCvcElement
                  id="cvc"
                  options={ELEMENT_OPTIONS}
                  onChange={(event)=> handleCardChange(event, 'cvc')  }
                />
            </div>
            </div>
        </div>
        </>
    )
}

const PaymentModes = ( { input, handleOnChange, gateways, CardNumberElement, CardCvcElement, CardExpiryElement, cardFilled, setCardFilled } ) => {
    const { errors, paymentMethod } = input || {}
    const { data: session, status } = useSession();
    const boxRef = useRef();
    const [ current, setCurrent] = useState( current );
    const [ items, setItems ] = useState( gateways );

    const [ fetchPosts, { loading } ] = useLazyQuery( GET_HAIRDRESSER_PAYMENTS_INFO, {
        notifyOnNetworkStatusChange: true,
        onCompleted: ( data ) => {
            const array = [];
            if( data?.user?.payments ) {
                if( !isNull( data?.user?.payments.bacs ) ) {
                    array.push({
                        id: 'bacs',
                        title: 'Bonifico Bancario',
                        description: data?.user?.payments.bacs
                    });
                }
                if( !isNull( data?.user?.payments.cod ) ) {
                    array.push({
                        id: 'cod',
                        title: 'Contrassegno',
                        description: data?.user?.payments.cod
                    });
                }
                setItems(array);
            }
        },
        onError: ( error ) => {
            console.log(error)
            //setSearchError( error?.graphQLErrors ?? '' );
        }
    } );

    useEffect(()=> {
        if(process.browser && status !== 'loading') {

            const div = boxRef.current;
            const currentTab = div.querySelector(`#${paymentMethod}`);
            const activeTab = div.querySelectorAll(`.checkout__getaway-desc:not(#${paymentMethod})`);
            
            const timeline = gsap.timeline({
                defaults: {
                    overwrite: 'auto',
                    duration: .5,
                }
            });
            timeline
                .to(activeTab, {
                    autoAlpha: 0,
                    onComplete: ()=> {
                        setCurrent( paymentMethod )
                    }
                })
                .fromTo(currentTab, {
                    autoAlpha: 0,
                },{
                    autoAlpha: 1
                })
        }
        if( status === 'authenticated' ) {
            if( getRole(session) === 'hairdresser' ) {
                const id = session?.user?.parent;
                if( id ) {
                    fetchPosts({
                        variables: {
                            id,
                        }
                    })
                }
            }
        }
    }, [ paymentMethod, status ] );

	return (

        <CSSTransition in={ status !== 'loading' } timeout={750} classNames="fade-in" unmountOnExit>
    		<div className="checkout__payment">
                <h2 className="title title--font-size-38 title--grow-40-bottom"><span className="num">{input?.shippingDifferentThanShipping ? '03.' : '02.'}</span>Metodo di pagamento</h2>
    			<nav className="checkout__gateways">
                    <h3 className="title title--upper title--font-size-12 title--grow-40-bottom">
                        Scegli il metodo di pagamento
                    </h3>
                    { 
                        items.map((gateway, index)=> (
                            <label className="checkout__tab" key={`${gateway.id}-${index}`}>
                                <input onChange={ handleOnChange } value={gateway.id} name="paymentMethod" type="radio" checked={gateway.id === paymentMethod}/>
                                <span className={ cx("checkout__method", `checkout__method--${gateway.id}`, { 'checkout__method--image' : gateway.id === 'paypal' }) }>
                                    { gateway.id === 'paypal' && <Paypal /> }
                                    { gateway.id === 'stripe' && <><CcIcon />{gateway.title}</> }
                                    { gateway.id !== 'stripe' && gateway.id !== 'paypal' && gateway.title }
                                </span>
                            </label>
                        ))
                    }
                </nav>
                <div className="checkout__details" ref={boxRef}>
                    { 
                        items.map((gateway, index)=> (
                            <div className={ cx('checkout__getaway-desc', { 'checkout__getaway-desc--active' : current === gateway.id  })} id={gateway.id} key={`${gateway.id}-${index}`}>
                                { !isEmpty( gateway.description ) && !isNull( gateway.description ) && <p dangerouslySetInnerHTML={{__html: gateway.description}}></p> }
                                { !isEmpty( gateway.instructions ) && !isNull( gateway.instructions ) && <p dangerouslySetInnerHTML={{__html: gateway.instructions}}></p> }
                                { gateway.id === 'stripe' && <CreditCard {...{input, handleOnChange, CardNumberElement, CardCvcElement, CardExpiryElement, gateway: gateway.id, cardFilled, setCardFilled } } /> }
                            </div>
                        ))
                    }
                </div>
                <Error errors={ errors } fieldName={ 'paymentMethod' }/>
    		</div>
        </CSSTransition>
	);
};

export default PaymentModes;
