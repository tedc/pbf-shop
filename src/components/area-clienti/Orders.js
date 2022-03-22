import { isEmpty } from 'lodash';
import Link from 'next/link';
import { TableStyles, date } from '../../utils/user';
import { status } from '../../utils/order';
import { useQuery } from '@apollo/client';
import { useState, useEffect } from 'react';
import { GET_ORDERS } from '../../queries/users/get-user'; 
import { CSSTransition } from 'react-transition-group';
import { SpinnerDotted } from 'spinners-react'; 
export default function Orders(props) {
    const { session, user } = props;
    const [orders, setOrders] = useState([]);
    const [ wholesaler, setWholesaler ] = useState(null);
    const { data, loading } = useQuery(GET_ORDERS, {
        notifyOnNetworkStatusChange: true,
        variables: {
            customerId: session?.user?.databaseId
        },
        onCompleted: ()=> {
            setOrders( data?.orders?.nodes ?? [])
        }
    });
    let getRole;
    session?.user?.roles?.nodes.map((r) => {
        getRole = r?.name !== 'customer' ? r?.name : null;
    });
    useEffect(()=> {
        if( getRole === 'hairdresser' ) setWholesaler( session?.user?.parentName )
    }, [ session ] );
    return (
        <>
            <CSSTransition classNames="fade-in" timeout={750} in={!isEmpty( orders) && !loading} unmountOnExit>
            <div className="orders">
            <h2 className="title title--grow-40-bottom title--font-size-24">Ordini</h2>
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
                            <th>
                                Stato
                            </th>
                            { wholesaler && <th>Venduto da</th>}
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
                                { order?.lineItems?.nodes.length }
                            </td>
                            <td>
                                { order?.total }
                            </td>
                            <td>
                                { date( order?.date ) }
                            </td>
                            <td>
                                { status( order?.status) }
                            </td>

                            { getRole === 'hairdresser' && wholesaler && <td dangerouslySetInnerHTML={{__html:wholesaler}}></td>}
                        </tr>
                    ))
                }
                    </tbody>

                </table>
            </div>
            </CSSTransition>
            <CSSTransition classNames="fade-in" timeout={750} in={isEmpty( orders) && !loading} unmountOnExit>
            <p className="empty-orders">Non hai ancora effettuato ordini.</p>
            </CSSTransition>
            <CSSTransition in={ loading } timeout={750} classNames="account-loading" unmountOnExit>
            <SpinnerDotted  style={{ color: 'black', position: 'absolute', top: '50%', left: '50%', margin: -35}} /> 
            </CSSTransition>
            <style jsx>{
            `${TableStyles}
             .fade-in-enter {
                opacity: 0;
            }
            .fade-in-enter-active {
                opacity: 1;
                transition: opacity .75s;
            }
            .fade-in-exit {
                opacity: 1;
            }
            .fade-in-exit-active {
                opacity: 0;
                transition: opacity .75s;
            }`}</style>
        </>
    )
}