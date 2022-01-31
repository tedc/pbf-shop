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
    const { products, categories, params, pageInfo, session, query } = props;
    console.log( props?.where, params, query)
    return (
        <Layout {...props}>
            <Seo seo={props.seo} uri={props.uri} />
            <ProductArchive {...{products, categories, params, query, pageInfo, session}}  />
        </Layout>
    )
};

export async function getServerSideProps( context ) {
    const session = await getSession(context);

    const { query, params } = context;


    const offset = getPageOffset( params?.pageNo );

    const where = {
        orderby : [{
            field : 'DATE',
            order: 'DESC',
        }],
        typeIn: [
            'SIMPLE',
            'VARIABLE'
        ],
        offsetPagination: { 
            size: PER_PAGE_FIRST,
            offset: offset
        }
    }


    if( !isEmpty(query, true) && !isUndefined(query) ) {
        Object.entries(query).map(([key, value])=> {
            if( key !== 'order' && key !== 'pageNo' && key !== 'search') {
                if(isUndefined(where.taxonomyFilter)) {
                    where.taxonomyFilter = {
                        filters : [],
                        relation : 'OR',
                    }
                }
                where.taxonomyFilter.filters.push({
                    taxonomy: 'PRODUCTCATEGORY',
                    terms: value === 'all' ? key : value.split(','),
                })
            } else {
                if( key === 'order') {
                    where.orderby = orders[value].fields;
                } else if ( key === 'search') {
                    where.search = value;
                }
            }
        })
    }

    const {data} = await client.query({
        query: GET_PRODUCT_ARCHIVE,
        variables: { 
            uri : '/prodotti', 
            query: where
        },
        context: {
            headers: {
                'authorization': session?.accessToken ? `Bearer ${session.accessToken}` : '',
            }
        }
    });
    // const queryParams = [];

    // data?.categories?.nodes && data?.categories?.nodes.map((category) => {
    //     if (!isEmpty(category?.slug)) {
    //         queryParams.push( category?.slug );
    //     }
    // });

    return {
        props: {
            seo : data?.page?.seo ?? '',
            uri : data?.page?.uri,
            products : data?.products?.edges ?? [],
            categories: data?.categories?.nodes ?? [],
            pageInfo: data?.products?.pageInfo,
            menus : data?.menus,
            options : data?.optionsPage?.impostazioni,
            session : session,
            query: query ?? null,
            where: where,
            params: params ?? null
        },
    }
};
