import { gql } from "@apollo/client";

const GET_CART = gql`
query GET_CART {
  cart {
    contents {
      nodes {
        key
        product {
          node {
            id
            productId: databaseId
            name
            type
            onSale
            slug
            kits {
              nodes {
                  databaseId
                }
            }
            productCategories {
              nodes {
                databaseId
              }
            }
            image {
              id
              sourceUrl
              srcSet
              altText
              title
            }
            userVisibility {
                id
                role
            }
            details {
                wholesalerProduct
                hideOnB2c
              }
          }
        }
        quantity
        total
        subtotal
        subtotalTax
      }
    }
    appliedCoupons {
      code
      discountAmount
      discountTax
    }
    subtotal
    subtotalTax
    shippingTax
    shippingTotal
    total
    totalTax
    feeTax
    feeTotal
    discountTax
    discountTotal
  }
}
`;

export default GET_CART;
