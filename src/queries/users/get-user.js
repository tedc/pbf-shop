import { gql } from '@apollo/client'; 
import UserFragment from '../fragments/user';
export const GET_CUSTOMER = gql`
query GET_CUSTOMER($id:Int!) {
    customer(customerId: $id) {
        email
        firstName
        lastName
        ${UserFragment}
    }
}
`;

export const GET_CUSTOMER_GROUP = gql`
query GET_CUSTOMER_GROUP($parent:Int) {
    customers(where: {parent:$parent}) {
        nodes {
            email
            firstName
            lastName
            ${UserFragment}
        }
    }
}
`;

export const GET_ORDER = gql`
query GET_ORDER($id:ID!) {
    order(id: $id, idType: DATABASE_ID) {
        total
        subtotal
        shippingTotal
        date
        databaseId
        orderNumber
        paymentMethodTitle
        status
        hasBillingAddress
        hasShippingAddress
        lineItems {
            nodes {
                databaseId
                subtotal
                quantity
                productId
                orderId
                total
                product {
                    slug
                    name
                }
            }
        }
        billing {
            address1
            city
            company
            country
            email
            firstName
            lastName
            phone
            postcode
            vat
            state
        }
        shipping {
            address1
            city
            company
            country
            firstName
            lastName
            phone
            postcode
            state
        }
    }
}
`;