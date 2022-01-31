import {ProductFragment} from './product';
const UserFragment = `
    totalSpent
    orderCount
    displayName
    firstName
    lastName
    id
    databaseId
    username
    purchaseMonthlyFrequency
    averageSpent
    billing {
        address1
        address2
        city
        company
        country
        email
        firstName
        lastName
        phone
        postcode
        state
        vat
    }
    shipping {
        address1
        address2
        city
        company
        country
        email
        firstName
        lastName
        phone
        postcode
        state
    }
    orders {
        nodes {
            createdVia
            orderKey
            orderNumber
            orderVersion
            paymentMethodTitle
            subtotal
            total
            status
            databaseId
            discountTotal
            date
            lineItems {
                edges {
                    node {
                        databaseId
                        subtotal
                        quantity
                        product {
                            ${ProductFragment}
                        }
                    }
                }
            }
            shipping {
                address1
                city
                company
                country
                email
                firstName
                lastName
                phone
                postcode
                state
            }
            billing {
                address1
                address2
                city
                company
                country
                firstName
                email
                lastName
                phone
                postcode
                state
            }
        }
    }
`;

export default UserFragment;