import { useQuery, useLazyQuery } from '@apollo/client';
import { GET_ORDER } from '../../queries/users/get-user';
import cx from 'classnames';
import { SpinnerDotted } from 'spinners-react'; 
import { useState } from 'react';
import { isNull, isEmpty, isUndefined } from 'lodash';
import Link from 'next/link';
import OrderDiv from './OrderDiv';

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



export default function Order(props) {
    const {
        params,
        session,
    } = props;
    const [order, setOrder ] = useState(null);
    const { data, error, loading, refetch } = useQuery(GET_ORDER, {
        fetchPolicy:'cache-and-netowrk',
        variables : {
            id : params?.id
        },
        onCompleted : ()=> {
            setOrder( data?.order )
        }
    });
    
    return (
        <>
        <div className={cx('order', {'order--loading' : loading && isNull(order) })}>
            <h2 className="title title--grow-40-bottom title--font-size-24">Ordine #{params?.id}</h2>
            { !isNull( order ) && <OrderDiv order={order} session={session} /> }
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
        {loading || isNull(order) && <SpinnerDotted style={{ color: 'black', position: 'fixed', top: '50%', left: '50%', margin: '-25px 0 0 -25px'}} />}
        </>
    )
}