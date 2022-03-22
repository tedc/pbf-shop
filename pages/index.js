import Layout from "../src/components/Layout";
import { useRouter } from 'next/router';
import client from '../src/components/ApolloClient';
import {PAGE_BY_URI} from '../src/queries/page/get-page';
import {GET_PRODUCTS, GET_PRODUCTS_BLOCKS} from '../src/queries/products/get-products';
import { GET_MENUS } from '../src/queries/get-menus';
import Page from '../src/components/Page';
import { isEmpty, isArray, isUndefined } from 'lodash';

export default function Home (props) {
    return (
			<Layout {...props}>
				<Page {...props} />
			</Layout>
	)
};

export async function getStaticProps ( ) {
    const {data} = await client.query({
        query: PAGE_BY_URI,
        variables: { uri : '/' }
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
            databaseId: data?.page?.databaseId ?? null
        },
        revalidate: 60
    }
};
