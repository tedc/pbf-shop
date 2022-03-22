import Layout from "../../src/components/Layout";
import Seo from "../../src/components/seo";
import GET_COUNTRIES from "../../src/queries/get-countries";
import client from "../../src/components/ApolloClient";
import { GET_MENUS } from '../../src/queries/get-menus';
import Wrapper from '../../src/components/area-clienti/Wrapper';
import Orders from '../../src/components/area-clienti/Orders';
import BillingShippingForm from '../../src/components/area-clienti/BillingShippingForm';
import GroupTable from '../../src/components/area-clienti/GroupTable';
import CustomersOrders from '../../src/components/area-clienti/CustomersOrders';
import AddUser from '../../src/components/area-clienti/AddUser';
import Tutorials from '../../src/components/area-clienti/Tutorials';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';
import { GET_CUSTOMER_GROUP } from '../../src/queries/users/get-user';
export default function AreaPage(props) {
    const pageProps = {...props, current: 'dashboard'};
    const { params } = props;
     const GetLayout = ()=> {
        if( params?.all.indexOf( 'ordini' ) !== -1) {
            return <Orders {...props} />
        } else if( params?.all.indexOf( 'fatturazione' ) !== -1 || params?.all.indexOf( 'spedizione' ) !== -1) {
            const isShipping = params?.all.indexOf( 'fatturazione' ) !== -1 ? false : true;
            const formProps = {...props, isShipping};
            return <BillingShippingForm {...formProps} />
        } else if( params?.all.indexOf( 'rete' ) !== -1 ) {
            if( params?.all.indexOf( 'aggiungi-utente' ) === -1 ) {
                if( params?.all.indexOf( 'parrucchieri' ) === -1) {
                    return <CustomersOrders {...props} />
                } else {
                    return <GroupTable {...props} />
                }
                
            } else {
                return <AddUser {...props} />;
            }
        } else if( params?.all.indexOf( 'corsi-tutorial' ) !== -1 ) {
            return <Tutorials {...props} />
        }
        return '';
    }
    return (
        <Layout {...props}>
            <Wrapper {...pageProps}>
                <GetLayout />
            </Wrapper>
        </Layout>
    )
}

export async function getServerSideProps ( context ) {
    const { params, req, res } = context || {};
    
    
    const session = await getSession(context);

    const { data } = await client.query( {
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
            menus: data?.menus,
            options: data?.optionsPage?.impostazioni,
            isCheckout: false,
            categories: data?.categories?.nodes ?? [],
            params: params,
            session: session,
            group: data?.customers?.nodes ?? [],
            countries: data?.wooCountries,
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