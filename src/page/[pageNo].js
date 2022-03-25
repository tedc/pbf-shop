import { useEffect, useState } from 'react';
import { getPageOffset, PER_PAGE_FIRST, PER_PAGE_REST, orders } from '../../../src/utils/pagination';
import {isEmpty, isUndefined, isNull} from 'lodash';
import Layout from "../../../src/components/Layout";
import ProductArchive from "../../../src/components/product/ProductArchive";
import client from "../../../src/components/ApolloClient";
import { GET_PRODUCT_ARCHIVE, GET_TOTAL_PRODUCTS_COUNT } from '../../../src/queries/products/get-products';
import { GET_MENUS } from '../../../src/queries/get-menus';
import Pagination from '../../../src/components/product/pagination';
import Seo from '../../../src/components/seo';
import { getSession } from 'next-auth/react';

export default function Prodotti(props) {
    const { products, categories, params, pageInfo, pageNo } = props;
    return (
        <Layout {...props}>
            <Seo seo={props.seo} uri={props.uri} />
            <ProductArchive {...{products, categories, params, pageInfo, pageNo }}  />
        </Layout>
    )
};

export async function getStaticProps( { params } ) {

    const { pageNo } = params || {};
    const offset = getPageOffset( pageNo );

    const {data} = await client.query({
        query: GET_PRODUCT_ARCHIVE,
        variables: { 
            uri : '/prodotti', 
            offset: offset
        },
    });
    const queryParams = [];

    data?.categories?.nodes && data?.categories?.nodes.map((category) => {
        if (!isEmpty(category?.slug)) {
            queryParams.push( category?.slug );
        }
    });

    return {
        props: {
            seo : data?.page?.seo ?? '',
            uri : data?.page?.uri,
            products : data?.products?.edges ?? [],
            categories: data?.categories?.nodes ?? [],
            pageInfo: data?.products?.pageInfo,
            menus : data?.menus,
            options : data?.optionsPage?.impostazioni,
            params: queryParams ?? null,
            statiParams: params,
            pageNo
        },
    }
};



export async function getStaticPaths() {
    const { data } = await client.query( {
        query: GET_TOTAL_PRODUCTS_COUNT,
    } );
    const totalPostsCount = data?.productsCount?.pageInfo?.offsetPagination?.total ?? 0;
    //* since the first page posts and other page posts will be different, we subtract the no of posts we'll show on first page and then divide the result with the no of posts we'll show on other pages and then will add 1 for the first page that we subtracted.
    const pagesCount = Math.ceil( ( totalPostsCount - PER_PAGE_FIRST ) / PER_PAGE_REST + 1 );
    const paths = new Array( pagesCount ).fill( '' ).map( ( _, index ) => ( {
        params: {
            pageNo: ( index + 1 ).toString(),
        },
    } ) );

    return {
        paths: [ ...paths ],
        fallback: false,
    };
}