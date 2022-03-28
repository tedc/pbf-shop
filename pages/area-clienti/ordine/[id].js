import Layout from "../../../src/components/Layout";
import Seo from "../../../src/components/seo";
import Wrapper from '../../../src/components/area-clienti/Wrapper';
import Order from '../../../src/components/area-clienti/Order';
import { getSession } from 'next-auth/react';
import getCustomerArea from '../../../lib/customer-area';
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
    
    
    const session = await getSession(context);
    if( session === null ) {
        res.setHeader('Location', '/area-clienti');
        res.statusCode = 302;
    }
   
    const data = await getCustomerArea(session);

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
            user: data?.customer,
        },
    }

    // return {
    //     props: {
    //         countries: countries?.data || {},
    //         seo : seo,
    //         menus: data?.menus,
    //         options: data?.optionsPage?.impostazioni,
    //         isCheckout: false,
    //         categories: data?.categories?.nodes ?? [],
    //         authToken: authToken,
    //     },
    // };
}