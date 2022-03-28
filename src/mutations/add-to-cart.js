import { gql } from "@apollo/client";

const ADD_TO_CART = gql`
    mutation ADD_TO_CART($input: AddToCartInput!) {
      addToCart(input: $input) {
        cartItem {
          key
          product {
            node {
              id
              productId: databaseId
              name
              type
              onSale
              slug
              image {
                id
                sourceUrl
                altText
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
    }
`;

export default ADD_TO_CART;
