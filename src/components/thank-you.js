import {useState, useEffect, useContext} from "react";
import Link from 'next/link';
import Layout from "../src/components/Layout";
import {AppContext} from "../src/components/context/AppContext";
import Layout from "../src/components/Layout";
import { useRouter } from 'next/router';
import client from '../src/components/ApolloClient';
import {PAGE_BY_URI} from '../src/queries/page/get-page';
import {GET_PAGES_URI} from '../src/queries/page/get-pages';
import {GET_PRODUCTS, GET_PRODUCTS_BLOCKS} from '../src/queries/products/get-products';
import { GET_MENUS } from '../src/queries/get-menus';
import Page from '../src/components/Page';
import { isEmpty, isArray, isUndefined } from 'lodash';

const ThankYouContent = () => {
    const [cart, setCart] = useContext(AppContext);
    const [isSessionFetching, setSessionFetching] = useState(false);
    const [sessionData, setSessionData] = useState({});
    const session_id = process.browser ? Router.query.session_id : null;
    const order_id = process.browser ? Router.query.order_id : null;

    useEffect(() => {
        setSessionFetching(true);
        if (process.browser) {
            localStorage.removeItem('woo-next-cart');
            setCart(null);

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

    }, [order_id]);

    return (
        <div className="columns columns--jcc columns--shrink columns--grow-140">
            <div className="content content--page column column--s7-lg">
                <h1 className="title title--font-size-38 title--grow-40-bottom">Ordine completato con successo. Grazie per aver scelto Professional By Fama</h1>
            </div>
        </div>
    )
}

const ThankYou = () => {
    return (
        <Layout>
            <ThankYouContent/>
        </Layout>
    )
}

export async function getStaticPaths() {
    const menus = await client.query({
        query: GET_MENUS,
    });

    const seo = {
        title: 'Area clienti | Professional By Fama',
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
