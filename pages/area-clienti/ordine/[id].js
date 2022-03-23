import Layout from "../../../src/components/Layout";
import Seo from "../../../src/components/seo";
import GET_COUNTRIES from "../../../src/queries/get-countries";
import client from "../../../src/components/ApolloClient";
import { GET_MENUS } from '../../../src/queries/get-menus';
import Wrapper from '../../../src/components/area-clienti/Wrapper';
import Order from '../../../src/components/area-clienti/Order';
import { getSession } from 'next-auth/react';
import { GET_CUSTOMER_GROUP, GET_ORDER } from '../../../src/queries/users/get-user';
export default function Ordine(props) {
    return (
        <Layout {...props}>
            <Wrapper {...props}>
                <Order {...props} />
            </Wrapper>
        </Layout>
    )
}


export async function getServerSideProps ( context ) {
    const { params, req, res } = context || {};
    
    const menus = await client.query({
        query: GET_MENUS,
    });

    const session = await getSession(context);
    if( session === null ) {
        res.setHeader('Location', '/area-clienti');
        res.statusCode = 302;
    }
    const children = await client.query( {
        query : GET_CUSTOMER_GROUP,
        variables: {
            parent : session?.user?.databaseId
        },
        context: {
            headers: {
                'authorization' : session?.accessToken ? `Bearer ${session?.accessToken}`: '',
            }
        }
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
            session: session,
            group: children?.data?.customers?.nodes ?? [],
            params: params,
            user: children?.data?.customer,
        },
    }

    // return {
    //     props: {
    //         countries: countries?.data || {},
    //         seo : seo,
    //         menus: menus?.data?.menus,
    //         options: menus?.data?.optionsPage?.impostazioni,
    //         isCheckout: false,
    //         categories: menus?.data?.categories?.nodes ?? [],
    //         authToken: authToken,
    //     },
    // };
}