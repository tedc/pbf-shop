import { isEmpty } from 'lodash';
import Link from 'next/link';
import { TableStyles, date, getWholesalerOrders } from '../../utils/user';
import { status } from '../../utils/order';
import { useState, useEffect } from 'react'; 
import { CSSTransition } from 'react-transition-group';
import { SpinnerDotted } from 'spinners-react'; 
export default function CustomersOrders(props) {
    const { session, user } = props;
    const [orders, setOrders] = useState([]);
    const [ isLoading, setIsLoading ] = useState(true);
    const getDate = (d)=> {
        const order_Date = d.split(' ');
        return date( order_Date[0] );
    }
    useEffect(async ()=> {
        const {data} = await getWholesalerOrders(session)
        setOrders( data );
        console.log( data )
        setIsLoading( false );
    }, [session])
    return (
        <>
            <CSSTransition classNames="fade-in" timeout={750} in={!isEmpty( orders) && !isLoading} unmountOnExit>
            <div className="orders">
            <h2 className="title title--grow-40-bottom title--font-size-24">Cronologia ordini</h2>
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
                            <th>
                                Ordinato da
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                {
                    orders.map( (order, index) => (
                        <tr key={`${order?.id}-${index}`}>
                            <td>
                                <Link href={{
                                    pathname: '/area-clienti/ordine/[id]',
                                    query : {
                                        id: order?.id
                                    }
                                }}>
                                    <a>#{ order?.id }</a>
                                </Link>
                            </td>
                            <td>
                                { order?.lines }
                            </td>
                            <td>
                                { order?.total }
                            </td>
                            <td>
                                { getDate( order?.date?.date ) }
                            </td>
                            <td>
                                { status( order?.status) }
                            </td>
                            <td>
                                <Link href={{
                                    pathname: '/area-clienti/rete/cliente/[id]',
                                    query: {
                                        id : order?.user_id
                                    }
                                }}><a  dangerouslySetInnerHTML={{__html:order?.name}}></a></Link>
                            </td>
                        </tr>
                    ))
                }
                    </tbody>

                </table>
            </div>
            </CSSTransition>
            <CSSTransition classNames="fade-in" timeout={750} in={isEmpty( orders) && !isLoading} unmountOnExit>
            <p className="empty-orders">Non hai ancora effettuato ordini.</p>
            </CSSTransition>
            <CSSTransition in={ isLoading } timeout={750} classNames="account-loading" unmountOnExit>
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