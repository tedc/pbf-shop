import { find, isEmpty } from 'lodash';
import { TableStyles, displayName, date } from '../../utils/user';
import Link from 'next/link';

const OrdersTable = ({orders})=> {
    return (
        <table className="table table--private">
            <thead>
                <tr>
                    <th>
                        Ordine
                    </th>
                    <th>
                        Elementi
                    </th>
                    <th>
                        Totale
                    </th>
                    <th>
                        Data
                    </th>
                </tr>
            </thead>
            <tbody>
        {
            orders.map( (order, index) => (
                <tr key={`${order?.orderNumber}-${index}`}>
                    <td>
                        <Link href={{
                            pathname: '/area-clienti/ordine/[id]',
                            query : {
                                id: order?.orderNumber
                            }
                        }}>
                            <a>#{ order?.orderNumber }</a>
                        </Link>
                    </td>
                    <td>
                        { order?.lineItems?.edges.length }
                    </td>
                    <td>
                        { order?.total }
                    </td>
                    <td>
                        { date( order?.date ) }
                    </td>
                </tr>
            ))
        }
            </tbody>
        <style jsx>{
            TableStyles
        }</style>
        </table>
    )
}

export default function Customer(props) {
    const { params, group, } = props;
    const { billingCountries } = props?.countries?.wooCountries || {};
    const customer = find(group, (c)=> c?.databaseId === parseInt( params?.id) );
    const country = (c)=> {
        return find(billingCountries, (co) => co?.value === c);
    }
    return (
        <>
        <h2 className="title title--grow-40-bottom title--font-size-24">{ displayName(customer) }</h2>
        <header className="header header--customer-address columns columns--jcsb">
            { customer?.billing?.address1 && <span dangerouslySetInnerHTML={ { __html : customer?.billing?.address1} }></span>}
            { customer?.billing?.postcode && <span dangerouslySetInnerHTML={ { __html : customer?.billing?.postcode} }></span>}
            { customer?.billing?.city && <span dangerouslySetInnerHTML={ { __html : customer?.billing?.city} }></span>}
            { customer?.billing?.country && <span dangerouslySetInnerHTML={ { __html : country(customer?.billing?.country).label } }></span>}
            { customer?.billing?.vat && <span dangerouslySetInnerHTML={ { __html : `P.iva ${customer?.billing?.vat}`} }></span>}
        </header>
        <div className="columns columns--gutters">
            <div className="column column--grow-40 column--s6-xs column--s3-md column--data">
                <div className="data">
                    Numero ordini<br/>
                    <strong>
                        { !isEmpty( customer?.orders?.nodes ) ? customer?.orders?.nodes?.length : 0 }
                    </strong>
                </div>
            </div>
            <div className="column column--grow-40 column--s6-xs column--s3-md column--data">
                <div className="data">
                Totale ordini<br/>
                <strong>
                    { customer?.totalSpent  ? `€${customer?.totalSpent}` : '/' }
                </strong>
                </div>
            </div>
            <div className="column column--grow-40 column--s6-xs column--s3-md column--data">
                <div className="data"> 
                Valore medio<br/>
                <strong>
                    { customer?.averageSpent  }
                </strong>
                </div>
            </div>
            <div className="column column--grow-40 column--s6-xs column--s3-md column--data">
                <div className="data">
                Frequenza ordini<br/>
                <strong>
                    { customer?.purchaseMonthlyFrequency  }
                </strong>
                </div>
            </div>
        </div>
        {
            !isEmpty( customer?.orders?.nodes ) && <OrdersTable orders={customer?.orders?.nodes} />
        }
        <style jsx>{
            `.header--customer-address {
                background-color: black;
                color: white;
                padding: 20px;
            }
            .header--customer-address p {
                flex: 0 0 auto;
                font-size: 12px;
                padding: 15px;
            }
            @media screen and (min-width:40em) {
                .header--customer-address p {
                    padding: 20px;
                }
            }
            .column--data .data {
                padding: 20px;
                text-align: center;
                background-color: white;
                border-radius: 5px;
                font-size: 14px;
            }
            .column--data .data strong {
                display: inline-block;
                margin-top: 20px;
                font-size: 24px;
            }
            `
        }</style>
        </>
    )
}