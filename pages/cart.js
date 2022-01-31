import client from "../src/components/ApolloClient";
import Layout from "../src/components/Layout";
import { GET_MENUS } from '../src/queries/get-menus';
import {PAGE_BY_URI} from '../src/queries/page/get-page';
import Seo from '../src/components/seo';
import CartItemsContainer from "../src/components/cart/cart-page/CartItemsContainer";

const Cart = (props) => {
	return (
		<Layout {...props}>
            <Seo seo={props.seo} uri={props.page.uri} />
			<CartItemsContainer {...props}/>
		</Layout>
	)
};

export default Cart;

export async function getStaticProps( context ) {
    const {data} = await client.query({
        query: PAGE_BY_URI,
        variables: { uri : '/cart' }
    });
    const menus = await client.query({
        query: GET_MENUS,
    });
    return {
        props: {
            seo : data?.page?.seo ?? '',  
            menus : data?.menus,
            options : data?.optionsPage?.impostazioni,
            page: data?.page,
            categories: menus?.data?.categories?.nodes ?? []
        },
        revalidate: 1
    }
}