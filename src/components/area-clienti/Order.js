import { useQuery } from '@apollo/client';
import { GET_ORDER } from '../../queries/users/get-user';
import cx from 'classnames';
import { SpinnerDotted } from 'spinners-react'; 
import { useState } from 'react';
import { isNull, isEmpty } from 'lodash';
import { date } from '../../utils/user';
import Link from 'next/link';

const ShippingAddress = ({order})=> {
    if( !order?.hasBillingAddress && !order?.hasBillingAddress ) {
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

const OrderDiv = ({order}) => {
    console.log( order )
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
                    <strong>{ order?.paymentMethodTitle }</strong>
                </div>
            </div>
        </div>
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
            `
        }
        </style>
        </>
    )
}

export default function Order(props) {
    const {
        params,
        session,
    } = props;
    const [order, setOrder ] = useState(null);
    const { data, error, loading, refetch } = useQuery(GET_ORDER, {
        variables : {
            id : params?.id
        },
        onCompleted : ()=> {
           setOrder( data?.order )
        }
    })
    return (
        <>
        <div className={cx('order', {'order--loading' : loading })}>
            <h2 className="title title--grow-40-bottom title--font-size-24">Ordine #{props?.params?.id}</h2>
            { !isNull( order ) && <OrderDiv order={order} /> }
            <h3 className="title title--font-size-24">Dettaglio ordine</h3>
            <style jsx>{
                `
                .order {
                    transition: opacity .5s;
                }
                .order--loading {
                    opacity: 0;
                }`
            }</style>
            <table className="table table--order">
                <thead>
                    <tr>
                        <th>
                            <h4 className="title title--font-size-18 title--font-family-secondary title--normal">Prodotto</h4>
                        </th>
                        <th>
                            <h4 className="title title--font-size-18 title--font-family-secondary title--normal">Prezzo</h4>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        order?.lineItems?.nodes.map( (line, index)=> (
                        <tr key={`${line?.databaseId}-${index}`}>
                            <td>
                                <Link href={{
                                    pathname: '/prodotti',
                                    query : {
                                        slug : line?.product?.slug
                                    }
                                }}>
                                    <a dangerouslySetInnerHTML={{__html: `${line?.product?.name} x${line?.quantity}` }}></a>
                                </Link>
                            </td>
                            <td>
                                € {line?.total}
                            </td>
                        </tr>
                        ))
                    }
                </tbody>
                <tfoot>
                    <tr>
                        <td>
                            SubTotale
                        </td>
                        <td>
                            { order?.subtotal }
                        </td>
                    </tr>
                    { parseInt( order?.shippingTotal ) > 0 && <tr>
                        <td>
                            Spedizione
                        </td>
                        <td>
                            { order?.shippingTotal }
                        </td>
                    </tr>}
                    <tr>
                        <td>
                            Totale (iva incl.)
                        </td>
                        <td>
                            <strong>{ order?.total }</strong>
                        </td>
                    </tr>
                </tfoot>
            </table>
            <style jsx>{
                `
                .table--order {
                    table-layout: auto;
                }
                .table--order td, .table--order th {
                    padding: 20px;
                    border-bottom: 1px solid black;
                    text-align: left;
                    font-weight: normal;
                }
                .table--order th {
                    font-size: 16px;
                }
                .table--order tbody td {
                    font-size: 20px;
                }
                .table--order tr td:nth-last-child(1), .table--order tr th:nth-last-child(1) {
                    text-align: right;
                }
                .table--order tbody a {
                    position: relative;
                }
                .table--order tbody a:after {
                    position: absolute;
                    left: 0;
                    bottom: 0;
                    content: '';
                    height: 1px;
                    background-color: black;
                    width: 100%;
                    transform-origin: left center;
                    transition: transform .5s;
                }
                .table--order tbody a:hover:after {
                    transform-origin: right center;
                    transform: translateZ(0) scaleX(0);
                }
                .table--order tfoot td {
                    font-size: 16px;
                    color: white;
                    background-color: black;
                }
                .table--order tfoot tr:nth-last-child(1) td {
                    position: relative;
                }
                .table--order tfoot tr:nth-last-child(1) td:nth-last-child(1):before,
                .table--order tfoot tr:nth-last-child(1) td:nth-child(1):before {
                    position: absolute;
                    top: 0;
                    height: 1px;
                    background-color: white;
                    opacity: .2;
                    content: '';
                }
                .table--order tfoot tr:nth-last-child(1) td:nth-last-child(1):before {
                    right: 20px;
                    left: 0;
                }
                .table--order tfoot tr:nth-last-child(1) td:nth-child(1):before {
                    right: 0px;
                    left: 20px;
                }
                `
            }
            </style>
        </div>
        {loading && <SpinnerDotted style={{ color: 'black', position: 'fixed', top: '50%', left: '50%', margin: '-25px 0 0 -25px'}} />}
        </>
    )
}