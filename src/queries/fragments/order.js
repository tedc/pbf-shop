import {ProductFragment} from './product';
const OrderFragment = `
    createdVia
    orderKey
    orderNumber
    orderVersion
    total
    subtotal
    shippingTotal
    date
    databaseId
    paymentMethodTitle
    paymentMethod
    status
    hasBillingAddress
    hasShippingAddress
    discountTotal
    lineItems {
        nodes {
            databaseId
            subtotal
            quantity
            productId
            orderId
            total
            product {
                ${ProductFragment}
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
    }`;
export default OrderFragment;