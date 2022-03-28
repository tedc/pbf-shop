import Layout from "../../src/components/Layout";
import Seo from "../../src/components/seo";
import GET_COUNTRIES from "../../src/queries/get-countries";
import { GET_MENUS } from '../../src/queries/get-menus';
import Wrapper from '../../src/components/area-clienti/Wrapper';
import AccountForm from '../../src/components/area-clienti/AccountForm';
import { getSession } from 'next-auth/react';
import getCustomerArea from '../../lib/customer-area';
export default function AreaPage(props) {
    const pageProps = {...props, current: 'dashboard'};
    return (
        <Layout {...props}>
            <Wrapper {...pageProps}>
                <h2 className="title title--grow-40-bottom title--font-size-24">Informazioni personali</h2>
                <AccountForm {...props} />
            </Wrapper>
        </Layout>
    )
}


export async function getServerSideProps ( context ) {
    const { params, req, res } = context || {};
    
    const session = await getSession(context);
    
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