import { useQuery } from '@apollo/client';
import { GET_HAIRDRESSER_PAYMENTS_INFO } from '../../queries/users/get-user';
import { GET_GATEWAYS } from '../../queries/get-gateways';
import { useState, useEffect } from 'react';
import { date } from '../../utils/user';
import { status } from '../../utils/order';
import { isUndefined, isNull } from 'lodash';


const ShippingAddress = ({order})=> {
    if( !order?.hasBillingAddress && !order?.hasShippingAddress ) {
        return ('');
    }
    const shipping = order?.hasBillingAddres ? order?.shipping : order?.billing
    return (
         <p>
            { shipping?.firstName && shipping?.firstName } { shipping?.lastName && shipping?.lastName }{ (shipping?.lastName || shipping?.firstName) &&< br/>}
            { shipping?.address1 && shipping?.address1 }{ shipping?.address1 &&< br/>}
            { shipping?.postcode && shipping?.postcode }{shipping?.state && ` (${shipping?.state})`}{ shipping?.country && ` - ${shipping?.country}` }{ (shipping?.postcode || shipping?.state || shipping?.country) &&< br/>}
            { shipping?.email && shipping?.email }{ shipping?.email &&< br/>}
            { shipping?.phone && shipping?.phone }{ shipping?.phone &&< br/>}
        </p>
    )
}

const OrderDiv = ({order, session}) => {
    const [ method, setMethod ] = useState(null);
    const parent = session ? session?.user?.parent : false;
    const [ wholesaler, setWholesaler ] = useState(null);
    if( parent ) {
        const { data : dataParent } = useQuery(GET_HAIRDRESSER_PAYMENTS_INFO, {
            variables: {
                id: parent
            },
            onCompleted : ()=> {
                const currentMethod = dataParent?.user?.payments[order?.paymentMethod];
                if( !isUndefined(currentMethod)  ) {
                    setMethod({
                        id: order?.paymentMethod,
                        description: currentMethod
                    })
                }
            }
        });
    } else {
        const { data, error, loading, refetch } = useQuery(GET_GATEWAYS, {
            onCompleted : ()=> {
                const gateways = data?.paymentGateways?.nodes ? data?.paymentGateways?.nodes.filter((gateway) => gateway.enabled ) : [ ];
                gateways.map((g)=> {
                    if( g.id === order?.paymentMethod ) {
                        setMethod(g);
                    }
                })
            }
        });
    }

    

    let getRole;
    if( session ) {
        session?.user?.roles?.nodes.map((r) => {
            getRole = r?.name !== 'customer' ? r?.name : null;
        });
    }  
    useEffect(()=> {
        if( getRole === 'hairdresser') setWholesaler( session?.user?.parentName );
        console.log( order )
    }, [ session, method ] );
    return (
        <>
        <div className="order__header">
            <div className="columns columns--gutters columns--jcsb">
                <div className="order__column column column--auto">
                    Numero ordine<br/>
                    <strong>{order?.orderNumber}</strong>
                </div>
                <div className="order__column column column--auto">
                    Data<br/>
                    <strong>{ date( order?.date ) }</strong>
                </div>
                <div className="order__column column column--auto">
                    Totale<br/>
                    <strong>{ order?.total }</strong>
                </div>
                <div className="order__column column column--auto">
                    Metodo ti pagamento<br/>
                    <strong>{ order?.paymentMethod === 'stripe' ? 'Carta di credito' : (isNull(method) ? order?.paymentMethodTitle : method?.title )}</strong>
                </div>
                <div className="order__column column column--auto">
                    Stato<br/>
                    <strong>{ status( order?.status ) }</strong>
                </div>
                { wholesaler && <div className="order__column column column--auto">
                    Venduto da<br/>
                    <strong dangerouslySetInnerHTML={{__html:wholesaler}}></strong>
                </div> }
            </div>
        </div>
        { order?.paymentMethod !== 'paypal' && order?.paymentMethod !== 'stripe' && <div className="order__customer-info order__customer-info-payment">
            <h2 className="title">Istruzioni per il pagamento</h2>
            { method?.instruction && <p dangerouslySetInnerHTML={{__html: method?.instruction}}></p> }
            { method?.description && <p dangerouslySetInnerHTML={{__html: method?.description}}></p> }
        </div> }
        <div className="order__customer-info">
            <div className="columns columns--gutters columns--jcsb">
            <div className="order__column column column--s6-sm"> 
                <h2 className="title">Indirizzo di fatturazione</h2>
                { order?.hasBillingAddress ? (<p>
                    { order?.billing?.firstName && order?.billing?.firstName } { order?.billing?.lastName && order?.billing?.lastName }{ (order?.billing?.lastName || order?.billing?.firstName) &&< br/>}
                    { order?.billing?.address1 && order?.billing?.address1 }{ order?.billing?.address1 &&< br/>}
                    { order?.billing?.postcode && order?.billing?.postcode }{order?.billing?.state && ` (${order?.billing?.state})`}{ order?.billing?.country && ` - ${order?.billing?.country}` }{ (order?.billing?.postcode || order?.billing?.state || order?.billing?.country) &&< br/>}
                    { order?.billing?.vat && `P.Iva ${order?.billing?.vat}` }{ order?.billing?.vat &&< br/>}
                    { order?.billing?.email && order?.billing?.email }{ order?.billing?.email &&< br/>}
                    { order?.billing?.phone && order?.billing?.phone }{ order?.billing?.phone &&< br/>}
                </p> ) : ('') }
            </div>
            { ( order?.hasBillingAddress || order?.hasBillingAddress ) && <div className="order__column column column--s6-sm">
                <h2 className="title">Indirizzo di spedizione</h2>
                    <ShippingAddress order={order}/>
            </div> }
            </div>
        </div>
        <style jsx>{
            `
            .order__header {     
                font-size: 12px;
            }
            
            .order__customer-info {
                font-size: 14px;
                margin: 40px 0;
                border-top: 1px solid black;
                border-bottom: 1px solid black;
                padding: 40px 0;
                font-weight: normal;
            }
            .order__customer-info-payment {
                margin-bottom: 0;
                border-bottom: 0;
                padding-bottom: 0;
            }
            .order__customer-info .title {
                font-size: 14px;
                font-weight: bold;
                margin-bottom: 20px;
            }
            .order__header .order__column {
                line-height: 1.3;
            }
            .order__header strong {
                padding-top: 5px;
                display: inline-block;
                font-size: 16px;
            }
            @media screen and (max-width: 39.99em) {
                .order__column {
                    width: 50%;
                    padding-top: 10px;
                    padding-bottom: 10px;
                }
            }
            `
        }
        </style>
        </>
    )
}

export default OrderDiv