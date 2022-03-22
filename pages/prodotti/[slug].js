import Layout from '../../src/components/Layout';
import client from '../../src/components/ApolloClient';
import {PRODUCT_BY_SLUG_QUERY, PRODUCT_SLUGS} from '../../src/queries/products/get-product';
import { isEmpty  } from 'lodash';
import Seo from '../../src/components/seo';
import SingleProduct from '../../src/components/product/SingleProduct';

export default function Product(props) {
    return (
    <Layout {...props}>
        <Seo seo={props.seo} uri={props.product.slug} />
        { props?.product ? (
            <SingleProduct {...props}/>
        ) : (
            ''
        ) }
    </Layout>
)};



export async function getStaticProps(context) {
    const {params: { slug }} = context;
    
    const {data} = await client.query({
        query: PRODUCT_BY_SLUG_QUERY,
        variables: { slug },
    })

    return {
        props: {
            product: data?.product || {},
            menus: data?.menus,
            options: data?.optionsPage?.impostazioni,
            seo: data?.product?.seo ?? '',
            categories: data?.categories?.nodes,
            slug: slug
        },
        revalidate: 60
    };
}

export async function getStaticPaths () {
    const { data } = await client.query({
        query: PRODUCT_SLUGS
    })

    const pathsData = []

    data?.products?.nodes && data?.products?.nodes.map((product) => {
        if (!isEmpty(product?.slug)) {
            pathsData.push({ params: { slug: product?.slug } })
        }
    })

    return {
        paths: pathsData,
        fallback: true
    }
}
