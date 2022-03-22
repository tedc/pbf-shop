import Layout from "../src/components/Layout";
import { useRouter } from 'next/router';
import client from '../src/components/ApolloClient';
import {PAGE_BY_URI} from '../src/queries/page/get-page';
import {GET_PAGES_URI} from '../src/queries/page/get-pages';
import { GET_PRODUCTS_BLOCKS } from '../src/queries/products/get-products';
import { GET_MENUS } from '../src/queries/get-menus';
import Page from '../src/components/Page';
import { isEmpty, isArray, isUndefined } from 'lodash';
import {FALLBACK, isCustomPageUri} from '../src/utils/pages';

export default function StaticPage (props) {
    return (
        <Layout {...props}>
            <Page {...props} />
        </Layout>
    )
};


export async function getStaticProps( {params} ) {
    const {data} = await client.query({
        query: PAGE_BY_URI,
        variables: { uri : params?.slug.join( '/' ) }
    });
    const productBlocks = {};
    data?.page?.blocks && data?.page?.blocks.map((block, index) => {
        if (block.name === 'acf/products') {
            const bloccoProdotti = block.bloccoProdotti;
            const data = JSON.parse(block.attributes.data);

            const products = data.products;
            let where = {
                orderby : [{
                    field : 'DATE',
                    order: 'DESC',
                }]
            },
            kind = bloccoProdotti.kind,
            first = kind === 'new' ? 4 : 6;
            if( ! isEmpty( products) ) {
                let ids = [];
                products.forEach((id)=> {
                    ids.push(parseInt(id));
                });
                where.include = ids;
                where.orderby = [{
                    field: 'IN',
                    order: 'ASC'
                }];
                first =  isArray( products ) ? products.length : 1;
            } else {
                if(kind === 'sales') {
                    where.orderby = [{
                        field: 'SALE_PRICE',
                        order: 'ASC'
                    }];
                    where.onSale = true;
                } else if (kind === 'best') {
                    where.orderby = [{
                        field: 'TOTAL_SALES',
                        order: 'DESC'
                    }];
                }
            }
            where.typeIn = [
                'SIMPLE',
                'VARIABLE'
            ];
            where.offsetPagination = {
                size: first,
                offset: 0,
            }
            let key = 'newQuery';
            if(kind === 'sales') {
                key = 'salesQuery';
            } else if (kind === 'best') {
                key = 'topQuery'
            }
            productBlocks[key] = where;
        }
    });
    const blocksProps = await client.query({
        query: GET_PRODUCTS_BLOCKS,
        variables: productBlocks
    });
    return {
        props: {
            blocks: data?.page?.blocks ?? '',
            seo : data?.page?.seo ?? '',
            uri : data?.page?.uri,
            products: blocksProps?.data,
            queries : productBlocks ?? {},
            menus : data?.menus,
            options : data?.optionsPage?.impostazioni,
            template: data?.page?.template?.templateName ?? '',
            content: data?.page?.content ?? '',
            categories: data?.categories?.nodes ?? [],
            databaseId: data?.page?.databaseId
        },
        revalidate: 1
    }
}

/**
 * Since the page name uses catch-all routes,
 * for example [...slug],
 * that's why params would contain slug which is an array.
 * For example, If we need to have dynamic route '/foo/bar'
 * Then we would add paths: [ params: { slug: ['foo', 'bar'] } } ]
 * Here slug will be an array is ['foo', 'bar'], then Next.js will statically generate the page at /foo/bar
 *
 * At build time next js will will make an api call get the data and
 * generate a page bar.js inside .next/foo directory, so when the page is served on browser
 * data is already present, unlike getInitialProps which gets the page at build time but makes an api
 * call after page is served on the browser.
 *
 * @see https://nextjs.org/docs/basic-features/data-fetching#the-paths-key-required
 *
 * @returns {Promise<{paths: [], fallback: boolean}>}
 */
export async function getStaticPaths() {
    const {data} = await client.query( {
        query: GET_PAGES_URI
    } );

    const pathsData = [];

    data?.pages?.nodes && data?.pages?.nodes.map( page => {
        if ( ! isEmpty( page?.uri ) && ! isCustomPageUri( page?.uri ) ) {
            const slugs = page?.uri?.split( '/' ).filter( pageSlug => pageSlug );
            pathsData.push( {params: {slug: slugs}} );
        }
    } );

    return {
        paths: pathsData,
        fallback: FALLBACK
    };
}