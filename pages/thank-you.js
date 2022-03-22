import {useState, useEffect, useContext} from "react";
import Link from 'next/link';
import Layout from "../src/components/Layout";
import {AppContext} from "../src/components/context/AppContext";
import { useRouter } from 'next/router';
import client from '../src/components/ApolloClient';
import {PAGE_BY_URI} from '../src/queries/page/get-page';
import {GET_PAGES_URI} from '../src/queries/page/get-pages';
import {GET_PRODUCTS, GET_PRODUCTS_BLOCKS} from '../src/queries/products/get-products';
import { GET_MENUS } from '../src/queries/get-menus';
import Page from '../src/components/Page';
import { isEmpty, isArray, isUndefined, isNull } from 'lodash';
import Seo from '../src/components/seo';
import { SpinnerDotted } from 'spinners-react'; 
import { GET_ORDER } from '../src/queries/users/get-user';
import { useLazyQuery } from '@apollo/client';
import OrderDiv from '../src/components/area-clienti/OrderDiv';
import cx from 'classnames';
import axios from 'axios';
import { getOrderData } from '../src/utils/order';

const ThankYouContent = () => {
    const {cart, setCart} = useContext(AppContext);
    const [isSessionFetching, setSessionFetching] = useState(true);
    const [sessionData, setSessionData] = useState({});
    const router = useRouter();
    const token = process.browser ? router?.query?.token : null;
    const order_id = process.browser ? router?.query?.order_id : null;
    const [ order, setOrder ] = useState(null);
    const [ fetchOrder, { data, error, loading }] = useLazyQuery(GET_ORDER, {
        onCompleted : ()=> {
            setOrder( data?.order );
            setSessionFetching( false );
        }
    });
    useEffect(() => {
        if (process.browser && !isUndefined( order_id ) && !isNull( order_id ) ) {
            localStorage.removeItem('woo-next-cart');
            setCart(null);
            if( !isNull(token) ) {
                const transactionData = {
                    token: token,
                    order_id : order_id
                }
                axios
                    .post('/api/paypal-web-hook', transactionData)
                    .then( res => {
                        if( res?.data?.success ) {
                            axios.get('/api/get-order', {
                                params: {
                                    order_id
                                }
                            }).then((res)=> {
                                const data = res?.data;
                                const orderData = getOrderData( data?.order );
                                setOrder( orderData );
                                setSessionFetching( false );
                            })
                        }
                    });
            } else {
                axios.get('/api/get-order', {
                    params: {
                        order_id
                    }
                }).then((res)=> {
                    const data = res?.data;
                    const orderData = getOrderData( data?.order );
                    setOrder( orderData );
                    setSessionFetching( false );
                })
            }
           
            // fetchOrder({
            //     variables : {
            //         orderId : order_id
            //     }
            // })
            // if (session_id) {
            //     axios.get(`/api/get-stripe-session/?session_id=${session_id}`)
            //         .then((response) => {
            //             setSessionData(response?.data ?? {});
            //             setSessionFetching(false);
            //         })
            //         .catch((error) => {
            //             console.log(error);
            //             setSessionFetching(false);
            //         });
            // }
        }



    }, [order_id, token]);

    return (
        <div className="columns columns--jcc columns--shrink columns--grow-140">
            <div className="column column--s10-lg">
            <header className="header">
                <h1 className="title title--font-size-16 title--grow-30-bottom title--font-family-secondary title--normal">
                    Ordine completato con successo
                </h1>
                <h2 className="title title--grow-40-bottom title--font-size-38">
                     Grazie per aver scelto Professional By Fama
                </h2>
            </header>
            <div className={cx('order', {'order--loading' : isSessionFetching })}>
                <h2 className="title title--grow-40-bottom title--font-size-24">Ordine #{order_id}</h2>
                { !isNull( order ) && <OrderDiv order={order} session={false} /> }
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
                            order?.lineItems.map( (line, index)=> (
                            <tr key={`${line?.databaseId}-${index}`}>
                                <td>
                                    <Link href={{
                                        pathname: '/prodotti/[slug]',
                                        query : {
                                            slug : line?.slug
                                        }
                                    }}>
                                        <a dangerouslySetInnerHTML={{__html: `${line?.name} x${line?.quantity}` }}></a>
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
            </div>
            {isSessionFetching && <SpinnerDotted style={{ color: 'black', position: 'fixed', top: '50%', left: '50%', margin: '-25px 0 0 -25px'}} />}
        </div>
    )
}

export default function ThankYou(props) {

    return (
        <Layout {...props}>
            <Seo seo={props.seo} uri="/thank-you/" />
            <ThankYouContent />
        </Layout>
    )
}

export async function getStaticProps() {
    const menus = await client.query({
        query: GET_MENUS,
    });

    const seo = {
        title: 'Acquisto completato | Professional By Fama',
        metaRobotsNoindex: 'noindex',
        metaRobotsNofollow: 'nofollow',
        opengraphDescription: '',
        opengraphTitle: '',
        opengraphImage: '',
        opengraphSiteName: ''
    }
    return {
        props: {
            seo : seo,
            menus: menus?.data?.menus,
            options: menus?.data?.optionsPage?.impostazioni,
            isCheckout: false,
            categories: menus?.data?.categories?.nodes ?? [],
        },
    }
}
