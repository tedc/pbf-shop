import { gql } from '@apollo/client';
import SeoFragment from "../fragments/seo";
import SettingsFragment from '../fragments/settings';
import CategoriesFragment from '../fragments/categories';
import { ProductFragment, ProductsTop, ProductsNew, ProductsSales } from '../fragments/product';
import { PER_PAGE_FIRST } from '../../utils/pagination';

export const GET_PRODUCTS = gql`
 query GET_PRODUCTS( $query: RootQueryToProductConnectionWhereArgs! ) {
   products: products(where: $query) {
    edges {
      node {
        ${ProductFragment}
      }
      cursor
    }
    pageInfo {
      offsetPagination {
        total
      }
    }
  }
 }
 `;

export const GET_PRODUCTS_BLOCKS = gql`
query GET_PRODUCTS_BLOCKS( $newQuery: RootQueryToProductConnectionWhereArgs, $salesQuery : RootQueryToProductConnectionWhereArgs, $topQuery : RootQueryToProductConnectionWhereArgs ) {
    ${ProductsNew}
    ${ProductsTop}
    ${ProductsSales}
 }
 `;

export const GET_PRODUCTS_TOP = gql`
query GET_PRODUCTS_BLOCKS( $topQuery : RootQueryToProductConnectionWhereArgs ) {
    ${ProductsTop}
 }
 `;

export const GET_PRODUCTS_NEW = gql`
query GET_PRODUCTS_BLOCKS( $newQuery : RootQueryToProductConnectionWhereArgs ) {
    ${ProductsTop}
 }
 `;

export const GET_PRODUCTS_SALES = gql`
query GET_PRODUCTS_BLOCKS( $salesQuery : RootQueryToProductConnectionWhereArgs ) {
    ${ProductsTop}
 }
 `;

 export const GET_PRODUCT_ARCHIVE = gql`
 query GET_PRODUCT_ARCHIVE( $uri: String ) {
    
${SettingsFragment}
${CategoriesFragment}
   page: pageBy(uri: $uri) {
        id
        uri
        seo {
            ...SeoFragment
        }
    }
  products: products(where:{ typeIn: [SIMPLE,VARIABLE], offsetPagination: {size: ${PER_PAGE_FIRST} } }) {
    edges {
      node {
        ${ProductFragment}
      }
      cursor
    }
    pageInfo {
      offsetPagination {
        total
      }
    }
  }
 }
${SeoFragment}
`;

export const GET_TOTAL_PRODUCTS_COUNT = gql`
  query GET_TOTAL_PRODUCTS_COUNT {
    productsCount: products(where: {typeIn: [SIMPLE, VARIABLE]}) {
      pageInfo {
        offsetPagination {
          total
        }
      }
    }
  }
`;