import { fetchProducts } from '../../lib/fetch-products';
import { useEffect, useState } from 'react';
import {isEmpty, isUndefined, isNull, chunk, filter } from 'lodash';
import { PER_PAGE_FIRST, totalPagesCount, orders } from '../../src/utils/pagination';
import Layout from "../../src/components/Layout";
import ProductArchive from "../../src/components/product/ProductArchives";
import Seo from '../../src/components/seo';
import { getSession } from 'next-auth/react';
export default function Prodotti(props) {
    const { products, categories, params, pageNo, productsData } = props;
    return (
        <Layout {...props}>
            <Seo seo={props.seo} uri={props.uri} />
            <ProductArchive {...{products, categories, params, pageNo, productsData }}  />
        </Layout>
    )
};

export async function getStaticProps(  ) {
    const data = await fetchProducts();
    const queryParams = [];

    data?.categories?.nodes && data?.categories?.nodes.map((category) => {
        if (!isEmpty(category?.slug)) {
            queryParams.push( category?.slug );
        }
    });

    let productsData = [...data?.products?.nodes ];
    productsData = filter(productsData, (p)=> p?.details?.hideOnB2c !== true );
    productsData = filter(productsData, (p)=> p?.details?.wholesalerProduct !== true);
    const products = chunk(productsData, PER_PAGE_FIRST);

    return {
        props: {
            seo : data?.page?.seo ?? '',
            uri : data?.page?.uri,
            productsData : data?.products?.nodes ?? [],
            products : products[0] ?? [],
            categories: data?.categories?.nodes ?? [],
            menus : data?.menus,
            options : data?.optionsPage?.impostazioni,
            params: queryParams ?? null,
            pageNo: 1
        },
        revalidate: 300
    }
};
