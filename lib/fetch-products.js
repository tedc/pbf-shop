import client from "../src/components/ApolloClient";
import { GET_PRODUCT_ARCHIVE_NEW } from '../src/queries/products/get-products';
export async function fetchProducts() {
    const {data} = await client.query({
        query: GET_PRODUCT_ARCHIVE_NEW,
        variables: { 
            uri : '/prodotti', 
        },
    });
    return data;
}