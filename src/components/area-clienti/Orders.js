import { isEmpty } from 'lodash';
import Link from 'next/link';
import { TableStyles, date } from '../../utils/user';
import { status } from '../../utils/order';
import { useState, useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';
import { SpinnerDotted } from 'spinners-react'; 
import axios from 'axios';
export default function Orders(props) {
    const { session, user } = props;
    const [orders, setOrders] = useState([]);
    const [ wholesaler, setWholesaler ] = useState(null);
    const [ loading, setLoading ] = useState(false);
    let getRole;
    session?.user?.roles?.nodes.map((r) => {
        getRole = r?.name !== 'customer' ? r?.name : null;
    });
    useEffect(()=> {
        setLoading( true );
        axios.post('/api/user/get-orders', {
            customerId: user?.databaseId
        }).then((res)=> {
            const { data, success, error } = res;
            if( data?.success ) {
                setOrders( data?.data?.customer?.orders?.nodes );
            }
            setLoading( false );
        })
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
                            <td data-title="Ordine">
                                <Link href={{
                                    pathname: '/area-clienti/ordine/[id]',
                                    query : {
                                        id: order?.orderNumber
                                    }
                                }}>
                                    <a>#{ order?.orderNumber }</a>
                                </Link>
                            </td>
                            <td data-title="Elementi">
                                { order?.lineItems?.nodes.length }
                            </td>
                            <td data-title="Prezzo">
                                { order?.total }
                            </td>
                            <td data-title="Data">
                                { date( order?.date ) }
                            </td>
                            <td data-title="Stato">
                                { status( order?.status) }
                            </td>

                            { getRole === 'hairdresser' && wholesaler && <td data-title="Venduto da" dangerouslySetInnerHTML={{__html:wholesaler}}></td>}
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