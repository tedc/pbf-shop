import Layout from "../../../../src/components/Layout";
import Seo from "../../../../src/components/seo";
import GET_COUNTRIES from "../../../../src/queries/get-countries";
import client from "../../../../src/components/ApolloClient";
import { GET_MENUS } from '../../../../src/queries/get-menus';
import axios from 'axios';
import Wrapper from '../../../../src/components/area-clienti/Wrapper';
import Customer from '../../../../src/components/area-clienti/Customer';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';
import { GET_CUSTOMER_GROUP } from '../../../../src/queries/users/get-user';
export default function AreaPage(props) {
    const pageProps = {...props, current: 'dashboard'};
    const { params } = props;
    return (
        <Layout {...props}>
            <Wrapper {...pageProps}>
                <Customer {...props}/>
            </Wrapper>
        </Layout>
    )
}

export async function getServerSideProps ( context ) {
    const { params, req, res } = context || {};
    
    const menus = await client.query({
        query: GET_MENUS,
    });

    const countries = await client.query({
        query: GET_COUNTRIES
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
            params: params,
            session: session,
            group: children?.data?.customers?.nodes ?? [],
            countries: countries?.data,
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