const ProductFragment = `
    id
    name
    databaseId
    onSale
    userVisibility {
        id
        role
    }
    productCategories {
        edges {
            node {
                name
                slug
                databaseId
                parentDatabaseId
            }
        }
    }
    ... on SimpleProduct {  
        sku
        price
        salePrice
        regularPrice
        uri
        featuredImage {
            node {
                altText
                mediaDetails {
                    width
                    height
                    sizes {
                        height
                        width
                        sourceUrl
                    }
                }
                sourceUrl
            }
        }
    }
    ... on VariableProduct {
        sku
        price
        salePrice
        regularPrice
        uri
        featuredImage {
            node {
                altText
                mediaDetails {
                    width
                    height
                    sizes {
                        height
                        width
                        sourceUrl
                    }
                }
                sourceUrl
            }
        }
    }
`;
const ProductsNew = `productsNew: products(where: $newQuery) {
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
  }`;
const ProductsTop = `productsTop: products(where: $topQuery) {
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
  }`;
const ProductsSales = `productsSales: products(where: $salesQuery) {
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
  }`;
export {
    ProductFragment,
    ProductsNew,
    ProductsSales,
    ProductsTop
}