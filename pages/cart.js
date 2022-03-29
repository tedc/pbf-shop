import client from "../src/components/ApolloClient";
import Layout from "../src/components/Layout";
import {PAGE_BY_URI} from '../src/queries/page/get-page';
import Seo from '../src/components/seo';
import CartItemsContainerLocal from "../src/components/cart/cart-page/CartItemsContainerLocal";
import { shippingZones, shippingMethods} from '../src/utils/shipping';

const Cart = (props) => {
    return (
		<Layout {...props}>
            <Seo seo={props.seo} uri={props.page.uri} />
			<CartItemsContainerLocal {...props}/>
		</Layout>
	)
};

export default Cart;

export async function getStaticProps( context ) {
    const {data} = await client.query({
        query: PAGE_BY_URI,
        variables: { uri : '/cart' }
    });
    const zones = await shippingZones();

    let methods;

    if( zones ) {
        for( let i = 0; i < zones.length; i++) {
            const res = await shippingMethods(zones[i]?.id);
            methods = res;
        }
    }
    
    
    return {
        props: {
            seo : data?.page?.seo ?? '',  
            menus : data?.menus,
            options : data?.optionsPage?.impostazioni,
            page: data?.page,
            categories: data?.categories?.nodes ?? [],
            methods: methods
        },
        revalidate: 1
    }
}