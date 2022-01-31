import Layout from "../../src/components/Layout";
import Seo from "../../src/components/seo";
import GET_COUNTRIES from "../../src/queries/get-countries";
import client from "../../src/components/ApolloClient";
import { GET_MENUS } from '../../src/queries/get-menus';
import Wrapper from '../../src/components/area-clienti/Wrapper';
import AccountForm from '../../src/components/area-clienti/AccountForm';
import { getSession } from 'next-auth/react';
import { GET_CUSTOMER_GROUP } from '../../src/queries/users/get-user';
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
    
    const menus = await client.query({
        query: GET_MENUS,
    });

    const session = await getSession(context);

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