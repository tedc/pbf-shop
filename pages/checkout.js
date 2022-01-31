import Layout from "../src/components/Layout";
import CheckoutForm from "../src/components/checkout/CheckoutForm";
import GET_COUNTRIES from "../src/queries/get-countries";
import client from "../src/components/ApolloClient";
import { GET_MENUS } from '../src/queries/get-menus';
import {PAGE_BY_URI} from '../src/queries/page/get-page';
import { GET_GATEWAYS } from '../src/queries/get-gateways';
import Seo from '../src/components/seo';
import {loadStripe} from '@stripe/stripe-js';
import {Elements, ElementsConsumer} from '@stripe/react-stripe-js';
import { Lock, Logo, Phone } from '../src/components/icons';
import Link from 'next/link';
import { isEmpty, isNull } from 'lodash';

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);


const CheckoutBanner = (options)=> {
    return(
    <nav className="banner banner--shrink">
        <h1 className="title title--font-size-12">
            <Lock />Checkout sicuro
        </h1>
        <Link href="/">
            <a className="brand">
                <Logo />
            </a>
        </Link>
        { !isEmpty(options?.sitePhone) && !isNull( options?.sitePhone ) &&
        <div className="banner__phone">
            Hai bisogno di aiuto?
            <a href={ `tel:${options?.sitePhone}` }><Phone />{options?.sitePhone}</a>
        </div> }
    </nav> 
)
}

const Checkout = (props) => (
    <Elements stripe={stripePromise}>
    	<Layout {...props}>
            <Seo seo={props.seo} uri={props.page.uri} />
    		<div className="checkout">
                <CheckoutBanner {...props?.options} />
                <ElementsConsumer>
                {({stripe, elements}) => (
                    <CheckoutForm stripe={stripe} elements={elements} countriesData={props?.data?.wooCountries ?? {}} gateways={props?.gateways} />
                )}
                </ElementsConsumer>
    		</div>
    	</Layout>
    </Elements>
);

export default Checkout;

export async function getStaticProps() {
    const gatewaysData = await client.query({
        query: GET_GATEWAYS,
    });
    const page = await client.query({
        query: PAGE_BY_URI,
        variables: { uri : '/checkout' }
    });
	const { data } = await client.query({
		query: GET_COUNTRIES
	});

    const gateways = gatewaysData?.data?.paymentGateways?.nodes ? gatewaysData?.data?.paymentGateways?.nodes.filter((gateway) => gateway.enabled ) : [ ]
	return {
		props: {
			data: data || {},
            seo : page?.data?.page?.seo ?? '',
            menus : page?.data?.menus,
            options : page?.data?.optionsPage?.impostazioni,
            isCheckout: true,
            page: page?.data?.page,
            gateways: gateways,
		},
		revalidate: 1
	};

}
