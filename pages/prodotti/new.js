import client from "../../src/components/ApolloClient";
import { useEffect, useState } from 'react';
import {isEmpty, isUndefined, isNull} from 'lodash';
import { PER_PAGE_FIRST, totalPagesCount, orders } from '../../src/utils/pagination';
import Layout from "../../src/components/Layout";
import ProductArchive from "../../src/components/product/ProductArchives";
import { GET_PRODUCT_ARCHIVE_NEW } from '../../src/queries/products/get-products';
import Seo from '../../src/components/seo';
import { getSession } from 'next-auth/react';
export default function Prodotti(props) {
    const { products, categories, params, pageInfo, pageNo } = props;
    return (
        <Layout {...props}>
            <Seo seo={props.seo} uri={props.uri} />
            <ProductArchives {...{products, categories, params, pageInfo, pageNo }}  />
        </Layout>
    )
};

export async function getStaticProps(  ) {
    const {data} = await client.query({
        query: GET_PRODUCT_ARCHIVE_NEW,
        variables: { 
            uri : '/prodotti', 
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
            pageNo: 1
        },
        revalidate: 60
    }
};
