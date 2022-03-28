import Layout from "../../../src/components/Layout";
import Seo from "../../../src/components/seo";
import GET_COUNTRIES from "../../../src/queries/get-countries";
import client from "../../../src/components/ApolloClient";
import Wrapper from '../../../src/components/area-clienti/Wrapper';
import Tutorial from '../../../src/components/area-clienti/Tutorial';
import { GET_TUTORIAL } from '../../../src/queries/users/get-tutorials';
import getCustomerArea from '../../../lib/customer-area';
import { getSession } from 'next-auth/react';
export default function Ordine(props) {
    return (
        <Layout {...props}>
            <Wrapper {...props}>
                <Tutorial {...props} />
            </Wrapper>
        </Layout>
    )
}


export async function getServerSideProps ( context ) {
    const { params, req, res } = context || {};
    
    
    const session = await getSession(context);
    if( session === null ) {
        res.setHeader('Location', '/area-clienti');
        res.statusCode = 302;
    }
    const data  = await getCustomerArea(session);

    const { data : tutorial } = await client.query( {
        query : GET_TUTORIAL,
        variables: {
            id : params?.id
        },
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
            menus: data?.menus,
            options: data?.optionsPage?.impostazioni,
            isCheckout: false,
            categories: data?.categories?.nodes ?? [],
            session: session,
            group: data?.customers?.nodes ?? [],
            params: params,
            tutorial: tutorial?.tutorial,
            user: data?.customer,
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