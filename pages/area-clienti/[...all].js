import Layout from "../../src/components/Layout";
import Seo from "../../src/components/seo";
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
import getCustomerArea from '../../lib/customer-area';
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
            params: params,
            session: session,
            group: data?.customers?.nodes ?? [],
            countries: data?.wooCountries,
            user: data?.customer,
        },
    }

}