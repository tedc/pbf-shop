const image = `image {
            altText
            sourceUrl
            mediaDetails {
                height
                width
            }
        }`
const ProductFragment = `
    id
    name
    databaseId
    onSale
    userVisibility {
        id
        role
    }
    categoryName
    details {
        hideOnB2c
        wholesalerProduct
    }
    productCategoriesIds
    ... on SimpleProduct {  
        sku
        price
        salePrice
        regularPrice
        uri
        ${image}
    }
    ... on VariableProduct {
        sku
        price
        salePrice
        regularPrice
        uri
        ${image}
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