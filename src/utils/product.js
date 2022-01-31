import {isEmpty, isUndefined} from "lodash";
import {GET_PRODUCTS} from '../queries/products/get-products';
import client from "../components/ApolloClient";
import { useRouter } from 'next/router';
const discountPercent = ( regularPrice, salesPrice ) => {
    if( isEmpty( regularPrice ) || isEmpty(salesPrice) ) {
        return null;
    }

    const formattedRegularPrice = parseInt( regularPrice?.substring(1) );
    const formattedSalesPrice = parseInt( salesPrice?.substring(1) );

    const discountPercent = ( ( formattedRegularPrice - formattedSalesPrice ) / formattedRegularPrice ) * 100;

    return {
        discountPercent: formattedSalesPrice !== formattedRegularPrice ? `${parseInt(discountPercent)}%` : null,
        strikeThroughClass: formattedSalesPrice < formattedRegularPrice ? 'product-regular-price mr-2 line-through text-sm text-gray-600 font-normal' : ''
    }
}   
const getProducts = function( $query = {}) {
    return client.query({
        query: GET_PRODUCTS,
        variables: {  query: $query }
    });
};


const productsUrlParams = function(router) {
    let url = router.asPath;
    if(!isUndefined(router.query.pageNo)) {
        url = router.asPath.replace(`page/${router.query.pageNo}/`, '');

    } 
    const baseUrl = router.pathname.replace('/page/[pageNo]', '');
    url = url.replace(`${baseUrl}/?`, '');
    const urlParams = new URLSearchParams( url );
    const uparams = router.asPath.indexOf('?') !== -1 ? Object.fromEntries(urlParams.entries()) : false;
    return uparams;
}


/** Returns the page query, or null if the page is not yet hydrated. */
export default function getQuery() {
  const router = useRouter();

  const hasQueryParams =
    /\[.+\]/.test(router.route) || /\?./.test(router.asPath);
  const ready = !hasQueryParams || Object.keys(router.query).length > 0;

  if (!ready) return null;

  return router.query;
}

export {
    discountPercent,
    getProducts,
    productsUrlParams,
    getQuery
}