import { isEmpty } from 'lodash';
import Link from 'next/link';
import { TableStyles, date } from '../../utils/user';
export default function Orders(props) {
    const { session } = props;
    const orders = session?.user?.customer?.orders?.nodes;
    return (
        <>
            <h2 className="title title--grow-40-bottom title--font-size-24">Ordini</h2>
            {
                isEmpty( orders) ? (
                    <p className="empty-orders">Non hai ancora effettuato ordini.</p>
                ) : (
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
                                Prezzo
                            </th>
                            <th>
                                Data
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                {
                    session?.user?.customer?.orders?.nodes.map( (order, index) => (
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
        </>
    )
}